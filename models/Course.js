const mongoose = require("mongoose");
const validator = require("validator");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    seo: {
      title: { type: String, trim: true },
      description: { type: String, trim: true },
      keywords: { type: String, trim: true },
    },
    categoriesIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
    duration: {
      value: {
        type: Number,
        required: true,
        min: 1,
      },
      unit: {
        type: String,
        enum: ["day", "week", "month", "year"],
        required: true,
      },
    },
    price: {
      normalPrice: {
        type: Number,
        required: true,
      },
      salePrice: {
        type: Number,
      },
      currency: {
        type: String,
        default: "IN",
        validate(value) {
          const allowedCurrencies = ["IN", "USD", "EUR", "GBP"];
          if (!allowedCurrencies.includes(value)) {
            throw new Error("Invalid currency");
          }
        },
      },
      isFree: {
        type: Boolean,
        default: false,
      },
    },
    instructors: [
      {
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
          validate(value) {
            if (!validator.isEmail(value)) {
              throw new Error("Email is invalid");
            }
          },
        },
        socialLinks: [
          {
            title: {
              type: String,
              required: true,
              trim: true,
            },
            url: {
              type: String,
              required: true,
              trim: true,
              validate(value) {
                if (!validator.isURL(value)) {
                  throw new Error("Social link URL is invalid");
                }
              },
            },
          },
        ],
        description: {
          type: String,
          trim: true,
        },
        imgUrl: {
          type: String,
          trim: true,
          validate(value) {
            if (value && !validator.isURL(value)) {
              throw new Error("Instructor image URL is invalid");
            }
          },
        },
      },
    ],
    videos: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        url: {
          type: String,
          required: true,
          validate(value) {
            if (!validator.isURL(value)) {
              throw new Error("Video URL is invalid");
            }
          },
        },
      },
    ],
    imgUrl: {
      type: String,
      trim: true,
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("Course image URL is invalid");
        }
      },
    },
    module: {
      total: {
        type: Number,
        min: 1,
      },
      completed: {
        type: Number,
        min: 0,
        default: 0,
      },
    },
    streamUrl: {
      type: String,
      trim: true,
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("Stream URL is invalid");
        }
      },
    },
    status: {
      type: String,
      enum: ["draft", "in-progress", "published"],
      default: "draft",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
