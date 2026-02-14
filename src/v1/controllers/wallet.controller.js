const mongoose = require("mongoose");

const { roundTo4 } = require('../../common/utils');

const Wallet = require("../models/wallet.model");
const Transaction = require("../models/transaction.model");

const { TRANSACTION_TYPE } = require("../../common/constants");

const getWalletData = async (req, res, next) => {
    try {
        const { walletId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(walletId)) {
            return res.status(400).json({ message: "Invalid wallet id" });
        }

        const wallet = await Wallet.findById(walletId);

        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }

        return res.status(200).json({
            id: wallet._id,
            balance: Number.parseFloat(wallet.balance.toString()),
            name: wallet.name,
            date: wallet.createdAt,
        });
    } catch (error) {
        // console.log('error::', error);
        // next(error);
        return res.status(500).json({ error: error });
    }
};
const walletSetup = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, balance = 0 } = req.body;

        // Rounding off the balance value
        const normalizedBalance = roundTo4(balance);

        // Create wallet
        const wallet = await Wallet.create(
            [
                {
                    name,
                    balance: normalizedBalance,
                }
            ],
            { session }
        );

        // Create transaction for wallet creation
        const transaction = await Transaction.create(
            [
                {
                    walletId: wallet[0]._id,
                    amount: normalizedBalance,
                    balance: normalizedBalance,
                    description: 'Wallet created',
                    type: TRANSACTION_TYPE.CREDIT,
                }
            ],
            { session }
        );

        await session.commitTransaction();

        return res.status(200).json({
            id: wallet[0]._id,
            balance: Number.parseFloat(wallet[0].balance.toString()),
            transactionId: transaction[0]._id,
            name: wallet[0].name,
            date: wallet[0].createdAt,
        });

    } catch (error) {
        // console.log('error::', error);
        // next(error);
        return res.status(500).json({ error: error });
    } finally {
        await session.abortTransaction();
        session.endSession();
    }
};

module.exports = {
    getWalletData,
    walletSetup,
};
