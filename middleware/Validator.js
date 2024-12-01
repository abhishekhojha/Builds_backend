const { body, param } = require("express-validator");

exports.courseValidationRules = () => [
  body("title")
    .isString()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 255 })
    .withMessage("Title should not exceed 255 characters"),

  body("description")
    .isString()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 1000 })
    .withMessage("Description should not exceed 1000 characters"),

  body("streamUrl")
    .optional()
    .isURL()
    .withMessage("Stream URL must be a valid URL"),

  body("teachers")
    .isArray({ min: 1 })
    .withMessage("At least one teacher is required")
    .custom((teachers) => {
      if (teachers.some((teacher) => !/^[0-9a-fA-F]{24}$/.test(teacher))) {
        throw new Error("Each teacher ID must be a valid MongoDB ObjectId");
      }
      return true;
    }),

  body("duration")
    .isString()
    .notEmpty()
    .withMessage("Duration is required")
    .matches(/^\d+ (week|month|year)s?$/)
    .withMessage(
      "Duration must be in a valid format (e.g., '2 weeks', '3 months')"
    ),

  body("price.normalPrice")
    .isNumeric()
    .withMessage("Normal price must be a number")
    .notEmpty()
    .withMessage("Normal price is required")
    .custom((value) => value >= 0)
    .withMessage("Normal price must be a non-negative number"),

  body("price.salePrice")
    .isNumeric()
    .withMessage("Sale price must be a number")
    .notEmpty()
    .withMessage("Sale price is required")
    .custom((value, { req }) => {
      if (value > req.body.price.normalPrice) {
        throw new Error("Sale price cannot be greater than normal price");
      }
      return true;
    }),

  body("price.currency")
    .isString()
    .isLength({ min: 2, max: 3 })
    .withMessage("Currency should be a valid ISO code")
    .custom((value) => {
      const allowedCurrencies = ["IN", "USD", "EUR", "GBP"];
      if (!allowedCurrencies.includes(value)) {
        throw new Error(
          "Currency must be a valid ISO code (IN, USD, EUR, GBP)"
        );
      }
      return true;
    }),

  body("instructors.*.name")
    .isString()
    .notEmpty()
    .withMessage("Instructor name is required")
    .isLength({ max: 255 })
    .withMessage("Instructor name should not exceed 255 characters"),

  body("instructors.*.email")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("videos.*.name")
    .isString()
    .notEmpty()
    .withMessage("Video name is required")
    .isLength({ max: 255 })
    .withMessage("Video name should not exceed 255 characters"),

  body("videos.*.description")
    .isString()
    .notEmpty()
    .withMessage("Video description is required")
    .isLength({ max: 500 })
    .withMessage("Video description should not exceed 500 characters"),

  body("videos.*.url")
    .isURL()
    .withMessage("Video URL must be a valid URL")
    .isLength({ max: 255 })
    .withMessage("Video URL should not exceed 255 characters"),

  param("id").optional().isMongoId().withMessage("Invalid course ID format"),
];
