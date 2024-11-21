require("dotenv").config();
const mongoose = require("mongoose");

module.exports.ConnectDatabase = async () => {
    try {
        await mongoose.connect(
            `${process.env.MONGODB_URL}/${process.env.DATABASE}`,
            {
                ssl: true,
                sslValidate: false,  // Disable SSL certificate validation for testing
                retryReads: true,
                retryWrites: true,
            }
        );
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
};
