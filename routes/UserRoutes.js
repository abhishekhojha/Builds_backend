const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { hasRole } = require("../middleware/Auth");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const saltRounds = 10;
require("dotenv").config();
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
router.get("/", hasRole(["admin", "teacher"]), async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  let offset = (page - 1) * limit;
  try {
    const users = await User.find({ role: { $ne: "admin" } })
      .select("-password")
      .skip(offset)
      .limit(limit);
    const totalPage = Math.ceil((await User.countDocuments()) / limit);
    const data = {
      users: users,
      page: page,
      totalPages: totalPage,
    };
    console.log(data);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "email is required" });
  try {
    const user = await User.findOne({ email })
      .select("-password")
      .select("-otp")
      .select("-courses");
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 20 * 60 * 1000);
    await User.findByIdAndUpdate(user._id, {
      otp: otp,
      otpExpiry: otpExpiry,
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Signup",
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put("update/:id", hasRole(["admin"]), async (req, res) => {
  if (!req.params.id || !req.body.role) {
    return res.status(400).json({ error: "id and role is required" });
  }
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { role: req.body.role },
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/search", hasRole(["admin"]), async (req, res) => {
  if (!req.query.q) return res.status(400).json({ error: "q is required" });
  console.log(req.query.q);
  let page = 1;
  let limit = parseInt(req.query.limit) || 20;
  try {
    const users = await User.find({
      email: { $regex: req.query.q, $options: "i" },
    })
      .select("-password")
      .limit(limit);
    const totalPage = 1;
    const data = {
      users: users,
      page: page,
      totalPages: totalPage,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put("/forgot-password", async (req, res) => {
  const { email, otp } = req.body;
  let { password } = req.body;
  if (!email) return res.status(400).json({ error: "email is required" });
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    // return
    // bcrypt.hash(password, saltRounds, function (err, hash) {
    //   if (err) return res.status(500).json({ error: err });
    //   password = hash;
    // });
    // let newHash = bcrypt.hash(password, saltRounds, function (err, hash) {
    //   if (err) return res.status(500).json({ error: err });
    //   return hash;
    // });
    let newHash = bcrypt.hashSync(password, saltRounds);
    if (user.verifyOTP(otp)) {
      let updated = await User.findByIdAndUpdate(user._id, {
        isEmailVerified: true,
        password: newHash,
      });
      return res.status(200).json({ message: "Password updated" });
    } else {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put("/checks", async (req, res) => {
  return res.status(200).json({ message: "User is authenticated" });
});
module.exports = router;
