const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const router = express.Router();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up Nodemailer transporter (using Gmail as an example)

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
// POST route to handle form submission
router.post("/", (req, res) => {
  const { fullName, email, message } = req.body;

  // Mail options
  const mailOptions = {
    from: email, // Sender's email address
    to: "buildsyourmind3@gmail.com", // Your recipient email
    subject: "New Contact Form Submission",
    text: `You have received a new message from ${fullName} (${email})\n\nMessage:\n${message}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send("Error sending email");
    }
    res.status(200).send("Email sent successfully");
  });
});
module.exports = router;