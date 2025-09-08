const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { Resend } = require("resend");
require("dotenv").config();

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

async function SendOtp(req, res) {
  const { email, name, password, role } = req.body;
  if (!email || !name || !password || !role) {
    return res.status(400).json({
      message:
        "All fields are required: email, name, password, and role.",
    });
  }

  try {
    const ExistingUser = await User.findOne({ email });
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 20 * 60 * 1000); // 20 minutes

    if (ExistingUser) {
      if (ExistingUser.isEmailVerified) {
        return res
          .status(400)
          .json({ message: "User with this email is already verified" });
      } else {
        // Update OTP and role for existing non-verified user
        await User.findByIdAndUpdate(ExistingUser._id, {
          otp,
          otpExpiry,
          role,
        });

        // Send OTP via Resend
        await resend.emails.send({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Your OTP for Signup",
          text: `Your OTP is ${otp}. It will expire in 20 minutes.`,
        });

        return res.status(200).json({ message: "OTP sent to email" });
      }
    } else {
      // Create new user with OTP
      const newUser = new User({ email, name, password, role, otp, otpExpiry });
      await newUser.save();

      // Send OTP via Resend
      await resend.emails.send({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP for Signup",
        text: `Your OTP is ${otp}. It will expire in 20 minutes.`,
      });

      return res.status(200).json({ message: "OTP sent to email" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error sending OTP", error });
  }
}

async function VerifyOTP(req, res) {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Validate OTP
    if (user.verifyOTP(otp)) {
      await User.findByIdAndUpdate(user._id, {
        isEmailVerified: true,
        otp: null,
        otpExpiry: null,
      });
      return res.status(200).json({ message: "OTP verified, signup complete" });
    }

    return res.status(400).json({ message: "Invalid or expired OTP" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error during OTP verification", error });
  }
}

async function SignUp(req, res) {
  const { email, name, password, role } = req.body;

  if (!email || !name || !password || !role) {
    return res.status(400).json({
      message: "All fields are required: email, name, password, and role.",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const newUser = new User({
      email,
      name,
      password,
      role,
      isEmailVerified: true,
      otp: "000000", // dummy
      otpExpiry: new Date(), // dummy
    });

    await newUser.save();

    const token = newUser.generateToken();

    return res.status(201).json({
      message: "Signup successful",
      token,
      role: newUser.role,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error during signup", error });
  }
}

async function Login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isEmailVerified) {
      return res
        .status(400)
        .json({ message: "Account not verified. Please verify your OTP." });
    }

    user.comparePassword(password, (err, isMatch) => {
      if (err || !isMatch)
        return res.status(401).json({ message: "Password did not match" });

      const token = user.generateToken();
      return res.status(201).json({
        message: "Login successful",
        token,
        role: user.role,
      });
    });
  } catch (error) {
    return res.status(500).json({ message: "Error during login", error });
  }
}

module.exports = { SendOtp, VerifyOTP, Login, SignUp };
