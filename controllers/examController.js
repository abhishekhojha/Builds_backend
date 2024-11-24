const Exam = require('../models/exam'); 
const { validationResult } = require('express-validator');

// Controller to handle validation errors
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

// Create an exam
exports.createExam = async (req, res) => {
  handleValidationErrors(req, res);

  try {
    const { title, description, startTime, endTime, participants, questions } = req.body;

    const exam = new Exam({
      title,
      description,
      startTime,
      endTime,
      participants,
      questions,
    });

    await exam.save();
    res.status(201).json({ message: 'Exam created successfully', exam });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create exam', details: error.message });
  }
};

// Get all exams
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find();
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exams', details: error.message });
  }
};

// Get exam by ID
exports.getExamById = async (req, res) => {
  handleValidationErrors(req, res);

  try {
    const { examId } = req.params;
    const exam = await Exam.findById(examId).populate('participants', 'name email');

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exam', details: error.message });
  }
};

// Update an exam
exports.updateExam = async (req, res) => {
  handleValidationErrors(req, res);

  try {
    const { examId } = req.params;
    const updatedExam = await Exam.findByIdAndUpdate(examId, req.body, { new: true });

    if (!updatedExam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    res.status(200).json({ message: 'Exam updated successfully', updatedExam });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update exam', details: error.message });
  }
};

// Delete an exam
exports.deleteExam = async (req, res) => {
  handleValidationErrors(req, res);

  try {
    const { examId } = req.params;
    const deletedExam = await Exam.findByIdAndDelete(examId);

    if (!deletedExam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete exam', details: error.message });
  }
};
