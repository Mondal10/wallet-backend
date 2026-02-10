const { mongoInit } = require('./src/setup/mongo');
const { serverInit } = require('./src/setup/server');

const init = async () => {
    await mongoInit();
    await serverInit();
};

init().catch(err => {
    console.error(err);
    process.exit(1);
});

//handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error(err);
});