const express = require('express');
const { createExam, getAllExams, getExamById, updateExam, deleteExam } = require('../controllers/examController');
const { validateExam, validateExamId } = require('../validations/examValidation');

const router = express.Router();

router.post('/', validateExam, createExam);
router.get('/', getAllExams);
router.get('/:examId', validateExamId, getExamById);
router.put('/:examId', [validateExam, validateExamId], updateExam);
router.delete('/:examId', validateExamId, deleteExam);

module.exports = router;
