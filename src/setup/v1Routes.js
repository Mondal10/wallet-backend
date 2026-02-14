const walletRoutes = require('../v1/routes/wallet.routes');
const transactionRoutes = require('../v1/routes/transaction.routes');

const v1RoutesInit = (app) => {
    app.use('/v1/wallet', walletRoutes);
    app.use('/v1/transaction', transactionRoutes);
}

module.exports = { v1RoutesInit };
