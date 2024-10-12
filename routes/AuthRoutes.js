const express = require('express');
const { Login, SendOtp, VerifyOTP } = require('../controllers/AuthController');
const router = express.Router();

// Route to send OTP for signup
router.post('/send-otp', SendOtp);

// Route to verify OTP and complete signup
router.post('/verify-otp', VerifyOTP);

// Route to login
router.post('/login', Login);

module.exports = router;
