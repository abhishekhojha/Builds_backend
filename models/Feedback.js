const mongoose = require('mongoose');

const feedbackFormSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Title  of the feedback form
  questions: [
    {
      question: { type: String, required: true }, // The question text
      type: { 
        type: String, 
        enum: ['text', 'multiple-choice', 'rating'], 
        required: true 
      },
      options: { type: [String], default: [] }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

// Define the response schema
const responseSchema = new mongoose.Schema({
  feedbackId: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback', required: true }, // Reference to feedback form
  responses: [
    {
      question: { type: String, required: true }, // The question answered
      answer: { type: mongoose.Schema.Types.Mixed, required: true } // The answer given (could be text, number, etc.)
    }
  ],
  date: { type: Date, default: Date.now }
});

// Model for feedback form
const Feedback = mongoose.model('Feedback', feedbackFormSchema);

// Model for feedback response
const Response = mongoose.model('Response', responseSchema);

module.exports = { Feedback, Response };
