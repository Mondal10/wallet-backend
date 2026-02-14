const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    balance: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model('Wallet', walletSchema);