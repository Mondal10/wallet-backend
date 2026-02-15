const express = require('express');
const router = express.Router();

const {
    makeTransaction,
    getAllTransactions,
    exportTransactions,
} = require('../controllers/transaction.controller');

router.post('/transact/:walletId', makeTransaction);

router.get('/transactions', getAllTransactions);
router.get('/:walletId/export', exportTransactions);

module.exports = router;
