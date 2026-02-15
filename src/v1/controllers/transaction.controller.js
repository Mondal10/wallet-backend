const mongoose = require("mongoose");
const { Parser } = require("@json2csv/plainjs");

const Wallet = require("../models/wallet.model");
const Transaction = require("../models/transaction.model");

const { roundTo4 } = require('../../common/utils');
const { TRANSACTION_TYPE } = require("../../common/constants");

const makeTransaction = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { walletId } = req.params;
        const { amount, description = '', type } = req.body;

        if (!amount || Number.isNaN(amount)) {
            return res.status(400).json({ message: "Valid amount required" });
        }

        if (!mongoose.Types.ObjectId.isValid(walletId)) {
            return res.status(400).json({ message: "Invalid wallet id" });
        }

        const wallet = await Wallet.findById(walletId).session(session);

        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }

        if (amount && amount < 0) {
            return res.status(400).json({ message: "Amount must be a positive number" });
        }

        const numericAmount = Number.parseFloat(amount);
        const currentBalance = Number.parseFloat(wallet.balance.toString());

        let newBalance;
        if (type === TRANSACTION_TYPE.CREDIT) {
            newBalance = Number.parseFloat(
                (currentBalance + numericAmount).toFixed(4)
            );
        }
        if (type === TRANSACTION_TYPE.DEBIT) {
            newBalance = Number.parseFloat(
                (currentBalance - numericAmount).toFixed(4)
            );
        }

        if (newBalance < 0) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // Update wallet
        wallet.balance = roundTo4(newBalance);
        await wallet.save({ session });

        // Rounding off the balance and amout value to 4 decimal places
        const normalizedAmount = roundTo4(amount);
        const normalizedBalance = roundTo4(newBalance);

        // Make transaction for the wallet
        const transaction = await Transaction.create(
            [
                {
                    walletId: wallet._id,
                    amount: normalizedAmount,
                    balance: normalizedBalance,
                    description,
                    type,
                }
            ],
            { session }
        );

        await session.commitTransaction();

        return res.status(201).json({
            id: transaction[0]._id,
            balance: Number.parseFloat(normalizedBalance.toString()),
        });

    } catch (error) {
        return res.status(500).json({ error: error });
    } finally {
        await session.abortTransaction();
        session.endSession();
    }
};

const getAllTransactions = async (req, res, next) => {
    try {
        const { walletId, skip = 0, limit = 10 } = req.query;

        if (!walletId || !mongoose.Types.ObjectId.isValid(walletId)) {
            return res.status(400).json({ message: "Invalid wallet id" });
        }

        const wallet = await Wallet.findById(walletId);

        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }

        const skipNum = Number(skip);
        const limitNum = Number(limit);

        if (!Number.isInteger(skipNum) || skipNum < 0) {
            return res.status(400).json({ message: "skip must be a non-negative integer" });
        }

        if (!Number.isInteger(limitNum) || limitNum <= 0) {
            return res.status(400).json({ message: "limit must be a positive integer" });
        }

        const transactions = await Transaction.find({ walletId }).sort({ createdAt: -1 }).skip(skipNum).limit(limitNum);

        const formatted = transactions.map((txn) => ({
            id: txn._id,
            walletId: txn.walletId,
            amount: Number.parseFloat(txn.amount.toString()),
            balance: Number.parseFloat(txn.balance.toString()),
            description: txn.description,
            date: txn.createdAt,
            type: txn.type,
        }));

        return res.status(200).json(formatted);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

const exportTransactions = async (req, res, next) => {
    try {
        const { walletId } = req.params;

        if (!walletId || !mongoose.Types.ObjectId.isValid(walletId)) {
            return res.status(400).json({ message: "Invalid wallet id" });
        }

        const wallet = await Wallet.findById(walletId);

        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }

        const transactions = await Transaction.find({ walletId }).sort({
            createdAt: -1,
        });

        const formatted = transactions.map((tx) => ({
            id: tx._id.toString(),
            walletId: tx.walletId.toString(),
            amount: Number.parseFloat(tx.amount.toString()),
            balance: Number.parseFloat(tx.balance.toString()),
            description: tx.description || "",
            date: tx.createdAt,
            type: tx.type,
        }));

        const fields = [
            "id",
            "walletId",
            "amount",
            "balance",
            "description",
            "date",
            "type",
        ];

        const parser = new Parser({ fields });
        const csv = parser.parse(formatted);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=transactions.csv"
        );

        return res.status(200).send(csv);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    makeTransaction,
    getAllTransactions,
    exportTransactions,
};