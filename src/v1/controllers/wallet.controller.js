const getWalletData = (req, res, next) => {
    res.status(200).json({ msg: 'getWalletData', id: req.params.wallet_id });
};
const walletSetup = (req, res, next) => {
    res.status(200).json({ msg: 'walletSetup' });
};

module.exports = {
    getWalletData,
    walletSetup,
};
