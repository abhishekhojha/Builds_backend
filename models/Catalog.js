const mongoose = require("mongoose");

const catalogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    feedback: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feedback",
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnail: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Catalog", catalogSchema);
