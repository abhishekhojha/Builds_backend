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
        required: true,
      },
    ],
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    seo: {
      title: {
        type: String,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
      keywords: {
        type: String,
        trim: true,
      },
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
      type: String,
      required: true,
      validate(value) {
        if (!/^\d+ (week|month|year)s?$/.test(value)) {
          throw new Error(
            "Duration must be a valid time format (e.g., '2 weeks')"
          );
        }
      },
    },
    price: {
      normalPrice: {
        type: Number,
        required: true,
      },
      salePrice: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        required: true,
        default: "IN",
        default: "IN",
        validate(value) {
          const allowedCurrencies = ["IN", "USD", "EUR", "GBP"];
          if (!allowedCurrencies.includes(value)) {
            throw new Error("Invalid currency");
          }
        },
      },
      isFree: Boolean,
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
              throw new Error("email is invalid");
            }
          },
        },
        socialLinks: [
          {
            title: {
              type: String,
              required: true,
              true: true,
            },
            url: {
              type: String,
              required: true,
              true: true,
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
            if (!validator.isURL(value)) {
              throw new Error("Social link URL is invalid");
            }
          },
        },
      },
    ],
    videos: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
          validate(value) {
            if (!validator.isURL(value)) {
              throw new Error("Social link URL is invalid");
            }
          },
        },
      },
    ],
    imgUrl: {
      type: String,
      trim: true,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Social link URL is invalid");
        }
      },
    },
    module: {
      total: {
        type: Number,
        required: true,
        min: 1,
      },
      completed: {
        type: Number,
        required: true,
        min: 0,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
