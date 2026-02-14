const express = require('express');
const router = express.Router();

const {
    makeTransaction,
    getAllTransactions,
} = require('../controllers/transaction.controller');

router.post('/transact/:walletId', makeTransaction);

router.get('/transactions', getAllTransactions);

module.exports = router;
