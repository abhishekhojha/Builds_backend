const express = require('express');
const { createExam, getAllExams, getExamById, updateExam, deleteExam,getAllExamsByUser } = require('../controllers/examController');
const { validateExam, validateExamId } = require('../validations/examValidation');
const { hasRole } = require('../middleware/Auth');

const router = express.Router();

router.post('/', validateExam, createExam);
router.get('/', getAllExams);
router.get('/:examId', validateExamId, getExamById);
router.put('/:examId', [validateExam, validateExamId], updateExam);
router.delete('/:examId', validateExamId, deleteExam);
router.post('/student', hasRole(['student']), getAllExamsByUser);

module.exports = router;
