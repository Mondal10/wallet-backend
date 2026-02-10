require('dotenv').config();

const mongoose = require('mongoose');

const mongoInit = async () => {
    const mongo_db_url = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.uxeeqgl.mongodb.net/?appName=Cluster0`;

    // Connecting to MongoDB
    await mongoose.connect(mongo_db_url).then(() => {
        console.log('Database connected')
    }).catch(err => console.error(err));
};

module.exports = { mongoInit };