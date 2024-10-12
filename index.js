const express = require("express");
const app = express();
const cors = require("cors")
require("dotenv").config()
const mongoose = require("mongoose")
app.use(express.json());
app.use(cors())
const nodemailer = require("nodemailer")
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
    // const mailOptions = {
    //     from: "abhishekhojha45@gmail.com",
    //     to: "abhishekhojha45@gmail.com",
    //     subject: "Hello from Nodemailer",
    //     text: "This is a test email sent using Nodemailer.",
    // };
    // transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //         res.send("Error sending email: ", error);
    //     } else {
    //         res.send("Email sent: ", info.response);
    //     }
    // });
    res.send("You are on build's Homepage Go back")
})

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

app.listen(PORT, () => {
    console.log("Server is running on port 5000")
    connectDB()
})