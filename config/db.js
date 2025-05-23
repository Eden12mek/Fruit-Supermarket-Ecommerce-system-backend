const mongoose = require('mongoose')
require('dotenv').config();

mongoose.connect(process.env.DATABASE_URI,{
    dbName: process.env.DB_NAME
}).then(() => {
    console.log("Connected to MongoDB");
    }
).catch((error) => {
        console.log('Error connecting to database ' +error);
    }
)

module.exports = mongoose;