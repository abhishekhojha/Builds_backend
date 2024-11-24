const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }], // Multiple-choice options
  correctAnswer: { type: String, required: true }, // For grading
});

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Only selected participants can attempt
  questions: [questionSchema], // List of questions in the exam
});

module.exports = mongoose.model('Exam', examSchema);
