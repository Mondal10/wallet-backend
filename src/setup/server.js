const express = require("express");
const cors = require('cors');

const { v1RoutesInit } = require("./v1Routes");

const PORT = process.env.PORT || 8000;

const serverInit = async () => {
    const app = express();

    // Disable header for security
    app.disable('x-powered-by');

    // Middleware for parsing JSON
    app.use(express.json({ limit: '1MB' }));

    // Adds headers: Access-Control-Allow-Origin: *, for now all requests are allowed
    app.use(cors());

    // Routes
    // All the /v1/<path> routes
    v1RoutesInit(app);

    // Handle 404 error
    app.use('/', (req, res, next) => {
        console.log('404');
        const error = new Error('Route Not Found');

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


    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = { serverInit };
