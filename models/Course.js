const mongoose = require("mongoose");

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
    active: Boolean,
    duration: {
      type: String,
      required: true,
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
        socialLinks: {
          title: {
            type: String,
            required: true,
            true: true,
          },
          url: {
            type: String,
            required: true,
            true: true,
          },
        },
        description: {
          type: String,
          trim: true,
        },
        imgUrl: {
          type: String,
          trim: true,
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
        },
      },
    ],
    module: {
      total: {
        type: Number,
        required: true,
      },
      completed: {
        type: Number,
        required: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
