const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
app.use(express.json());
app.use(cors());
const nodemailer = require("nodemailer");
const AuthRoute = require("./routes/AuthRoutes");
const CatagoryRoute = require("./routes/category");
const CourseRoute = require("./routes/courseRoute");
const OrderRoute = require("./routes/OrderRoute");
const FeedbackForm = require("./routes/FeedbackRoute")
const Me = require("./routes/Me")
const ExamRoute = require("./routes/examRoute")
const LeaderboardRoutes = require("./routes/leaderboardRoutes")
const SubmissionRoutes = require("./routes/submissionRoutes")
// import ServerlessHttp from "serverless-http";

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("You are on build's Homepage Go back");
});
app.use("/auth", AuthRoute);
app.use("/catagories", CatagoryRoute);
app.use("/course", CourseRoute);
app.use("/order", OrderRoute);
app.use("/feedback", FeedbackForm);
app.use("/", Me);
app.use("/exam",ExamRoute);
app.use("/leaderboard",LeaderboardRoutes);
app.use("/submission",SubmissionRoutes);
console.log(Date.now())
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

app.listen(PORT, () => {
  console.log("Server is running on port 5000");
  connectDB();
});
// app.get('/.netlify/functions/api', (req, res) => {
//   return res.json({
//       messages: "hello world!"
//   })
// })

// const handler = ServerlessHttp(app);

// module.exports.handler = async(event, context) => {
//     const result = await handler(event, context);
//     return result;
// }