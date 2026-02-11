const express = require('express');
const router = express.Router();

const { getWalletData, walletSetup } = require('../controllers/wallet.controller');

router.get('/:wallet_id', getWalletData);

router.post('/setup', walletSetup);

module.exports = router;
