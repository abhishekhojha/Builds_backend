const crypto = require("crypto")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const nodemailer = require("nodemailer")
require("dotenv").config()
// Configure the nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
async function SendOtp(req, res) {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json({ message: "All fields are required: email, otp, name, password, and role." });
    }
    try {
        const ExistingUser = await User.findOne({ email })
        if (ExistingUser.isVerified) {
            return res.status(400).json({ message: "User with this email is verified" });
        } else if (!ExistingUser.isVerified) {
            const otp = crypto.randomInt(100000, 999999).toString();
            const otpExpiry = Date.now() + OTP_EXPIRY_TIME;

        } else {
            const otp = crypto.randomInt(100000, 999999).toString();
            const otpExpiry = Date.now() + OTP_EXPIRY_TIME;
            const newUser = new User({ email, name, password, otp, otpExpiry });
            await newUser.save();
            // Send OTP via email
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Your OTP for Signup",
                text: `Your OTP is ${otp}. It will expire in 10 minutes.`
            };

            await transporter.sendMail(mailOptions);

            res.status(200).json({ message: "OTP sent to email" });
        }

    } catch (error) {
        res.status(500).send("There are some issues while sending issues", error)
    }
    res.status(500).send("There are some issues while sending issues")
}