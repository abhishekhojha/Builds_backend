const { param } = require("express-validator");

// Validate evaluation request
exports.validateEvaluation = [
  param("examId").isMongoId().withMessage("Invalid exam ID"),
  param("participantId").isMongoId().withMessage("Invalid participant ID"),
];
