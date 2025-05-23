const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
require('../server/config/db')
const connectionDB = require('./config/db')
const router = require('./routes')

const app = express()
const allowedOrigins = ['http://localhost:3000','http://localhost:3001','http://localhost:3002', 'https://checkout.chapa.co']; // Add more origins as needed

app.use(express.json({ limit: '10mb' })); // JSON payload size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // URL-encoded payload size limit

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true, // Allow credentials
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
    })
)
app.use(cookieParser())

app.use("/api", router)

const PORT = 5000 || process.env.PORT



    app.listen(PORT, () => {
        console.log("connnect to DB")
        console.log("Server is running on Port " + PORT)
    })

    