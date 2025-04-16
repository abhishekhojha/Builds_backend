const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const SecretToken = process.env.JWT_SECRET_TOKEN;
const saltRounds = 10;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
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
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 7,
      validate: {
        validator(value) {
          return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/.test(
            value
          );
        },
        message:
          "Password must be at least 7 characters long and include letters, numbers, and at least one special character",
      },
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        registrationDate: {
          type: Date,
        },
        expirationDate: {
          type: Date,
        },
        ref: "Course",
      },
    ],
    otp: {
      // Field for storing the OTP
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      trim: true,
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("Stream URL is invalid");
        }
      },
    },
    otpExpiry: {
      // Field for storing OTP expiration time
      type: Date,
      required: true,
    },
    isVerified: {
      // Field to check if the user is verified
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      // Field to check if the user's email is verified
      type: Boolean,
      default: false,
    },
    isBlocked: {
      // To block unusual acitve user
      type: Boolean,
      default: false,
    },
    adminApproved: {
      // For techers to access teachers pannel
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash the password before saving the user
userSchema.pre("save", function (next) {
  const user = this;
  
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.hash(user.password, saltRounds, function (err, hash) {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

// Method to compare password
userSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// Method to verify OTP
userSchema.methods.verifyOTP = function (otp) {
  const now = new Date();
  if (otp == this.otp && now < this.otpExpiry) {
    return true;
  }
  return false;
};

// Method to generate JWT token
userSchema.methods.generateToken = function () {
  if (!this.isEmailVerified) {
    throw new Error("User is not verified");
  }
  const token = jwt.sign(
    {
      id: this._id,
      role: this.role,
      isVerified: this.isVerified,
      isEmailVerified: this.isEmailVerified,
    },
    SecretToken,
    {
      expiresIn: 86400,
    }
  ); // 1 day expiry
  return token;
};
module.exports = mongoose.model("User", userSchema);
