const { body, param } = require("express-validator");

// Validate submission
exports.validateSubmission = [
  param("examId").isMongoId().withMessage("Invalid exam ID"),
  body("participantId").isMongoId().withMessage("Invalid participant ID"),
  body("answers")
    .isObject()
    .withMessage("Answers must be an object")
    .custom((answers) => {
      if (Object.keys(answers).length === 0) {
        throw new Error("Answers cannot be empty");
      }
      return true;
    }),
];
