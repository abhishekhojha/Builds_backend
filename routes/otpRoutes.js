const express = require('express');
const { generateAndSendOTP, verifyOTP } = require('../config/TwoFactor');

const router = express.Router();

router.post('/send-otp', async (req, res) => {
    const template_name = "B4 Mart Vrification"
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).send('Phone number is required.');
    }

    const success = await generateAndSendOTP(phoneNumber,template_name);
    if (success) {
        return res.status(200).send('OTP sent successfully.');
    } else {
        return res.status(500).send('Failed to send OTP.');
    }
});

router.post('/verify-otp', async (req, res) => {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
        return res.status(400).send('Phone number and OTP are required.');
    }

    const isValid = await verifyOTP(phoneNumber, otp);
    if (isValid) {
        return res.status(200).send('OTP verified successfully.');
    } else {
        return res.status(400).send('Invalid OTP.');
    }
});

module.exports = router;
