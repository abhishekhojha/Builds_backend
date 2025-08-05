const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    age: {
      type: Number,
      min: 0,
    },
    contact: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    status: {
      type: String,
      enum: ["student", "employee", "others"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserDetails", userDetailsSchema);
