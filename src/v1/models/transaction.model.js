const mongoose = require('mongoose');
const { TRANSACTION_TYPE } = require('../../common/constants');

const transactionSchema = new mongoose.Schema({
    walletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true,
    },
    amount: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
        min: [0, 'Amount must be a positive number.'], // Ensures the value is >= 0 (since we have credit and debit indicator)
    },
    balance: {
        type: mongoose.Schema.Types.Decimal128,
    },
    description: {
        type: String,
        trim: true,
    },
    type: {
        type: String,
        enum: [TRANSACTION_TYPE.CREDIT, TRANSACTION_TYPE.DEBIT],
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);