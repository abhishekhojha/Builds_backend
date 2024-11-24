const { body, param } = require('express-validator');

// Validation for creating/updating an exam
exports.validateExam = [
  body('title').notEmpty().withMessage('Title is required'),
  body('startTime')
    .isISO8601()
    .withMessage('Valid startTime is required')
    .custom((value, { req }) => {
      if (new Date(value) >= new Date(req.body.endTime)) {
        throw new Error('startTime must be before endTime');
      }
      return true;
    }),
  body('endTime').isISO8601().withMessage('Valid endTime is required'),
  body('participants').optional().isArray().withMessage('Participants must be an array'),
  body('questions').isArray().withMessage('Questions must be an array'),
  body('questions.*.questionText').notEmpty().withMessage('Each question must have questionText'),
  body('questions.*.options').isArray({ min: 2 }).withMessage('Each question must have at least two options'),
  body('questions.*.correctAnswer').notEmpty().withMessage('Each question must have a correctAnswer'),
];

// Validation for exam ID
exports.validateExamId = [
  param('examId').isMongoId().withMessage('Invalid exam ID'),
];
