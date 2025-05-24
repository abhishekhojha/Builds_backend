const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const nodemailer = require("nodemailer");
require("dotenv").config();
// Configure the nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
async function SendOtp(req, res) {
  const { email, name, password, role } = req.body;
  if (!email || !name || !password || !role) {
    return res.status(400).json({
      message:
        "hello All fields are required: email, name, password, and role.",
    });
  }

  try {
    const ExistingUser = await User.findOne({ email });
    if (ExistingUser && ExistingUser != null) {
      if (ExistingUser.isEmailVerified) {
        return res
          .status(400)
          .json({ message: "User with this email is verified" });
      } else if (!ExistingUser.isEmailVerified) {
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = new Date(Date.now() + 20 * 60 * 1000);
        await User.findByIdAndUpdate(ExistingUser._id, {
          otp: otp,
          otpExpiry: otpExpiry,
          role: role
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Your OTP for Signup",
          text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: "OTP sent to email" });
      }
    } else {
      const otp = crypto.randomInt(100000, 999999).toString();
      const otpExpiry = new Date(Date.now() + 20 * 60 * 1000);
      const newUser = new User({ email, name, password, role, otp, otpExpiry });
      await newUser.save();
      // Send OTP via email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP for Signup",
        text: `Your OTP is ${otp}. It will expire in 20 minutes.`,
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({ message: "OTP sent to email" });
    }
  } catch (error) {
    return res.status(500).send(error);
  }

  return res.status(500).send("There are some issues while sending issues");
}

async function VerifyOTP(req, res) {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    // return
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

// Login User
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
        .json({ message: "Account is not verified. Please verify your OTP." });
    }

    // Compare password
    user.comparePassword(password, (err, isMatch) => {
      if (err || !isMatch)
        return res.status(401).json({ message: "Password did not matched" });
      const Token = user.generateToken();
      return res
        .status(201)
        .json({ message: "Login Successful", token: Token , role: user.role });
    });
  } catch (error) {
    return res.status(500).json({ message: "Error during login", error });
  }
}
module.exports = { SendOtp, VerifyOTP, Login };
