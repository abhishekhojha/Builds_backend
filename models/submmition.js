const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  participant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: { type: Map, of: String }, 
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Submission', submissionSchema);
