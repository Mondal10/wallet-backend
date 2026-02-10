const express = require("express");

const serverInit = async () => {
    const app = express();

    // Disable header for security
    app.disable('x-powered-by');

    // Middleware for parsing JSON
    app.use(express.json({ limit: '1MB' }));

    // Header setup for Cross Origin Access
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');

            return res.status(200).json({});
        }

        // So that it won't block the incoming request
        // and go through other routes
        next();
    });

    // Routes
    // Todo: Add routes

    // Handle 404 error
    app.use('/', (req, res, next) => {
        const error = new Error('Not Found');

        error.status = 404;
        next(error);
    });

    app.use((error, req, res, next) => {
        const { status, message } = error;
        res.status(status || 500);

        res.json({
            message
        });
    });
}

module.exports = { serverInit };