const { body } = require("express-validator");

exports.validateCreateCourse = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),

  // Duration validations
  body("duration.value")
    .notEmpty()
    .withMessage("Duration value is required")
    .isInt({ min: 1 })
    .withMessage("Duration value must be a positive integer"),
  body("duration.unit")
    .notEmpty()
    .withMessage("Duration unit is required")
    .isIn(["day", "week", "month", "year"])
    .withMessage("Duration unit must be one of: day, week, month, year"),

  // Price validations
  body("price.normalPrice")
    .notEmpty()
    .withMessage("Normal price is required")
    .isNumeric()
    .withMessage("Normal price must be a number"),
  body("price.currency")
    .optional()
    .isIn(["IN", "USD", "EUR", "GBP"])
    .withMessage("Currency must be one of: IN, USD, EUR, GBP"),

  // Categories
  body("categoriesIds")
    .notEmpty()
    .withMessage("Categories must be provided")
    .isArray({ min: 1 })
    .withMessage("Categories must be a non-empty array"),
  body("categoriesIds.*")
    .isMongoId()
    .withMessage("Each category must be a valid Mongo ID"),

  // image
  body("imgUrl")
    .notEmpty()
    .withMessage("Image URL is required")
    .isURL()
    .withMessage("Image URL must be valid"),
];
