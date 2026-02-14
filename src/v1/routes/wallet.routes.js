const express = require('express');
const router = express.Router();

const { getWalletData, walletSetup } = require('../controllers/wallet.controller');

router.post('/setup', walletSetup); // Info: Placement matters because Express matches routes top to bottom.

router.get('/:walletId', getWalletData);

module.exports = router;
