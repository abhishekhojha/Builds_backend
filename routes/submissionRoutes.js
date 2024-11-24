const express = require("express");
const {
  submitAnswers,
  getSubmissionsByExam,
  getParticipantSubmission,
  evaluateMarks
} = require("../controllers/submissionController");
const { validateEvaluation } = require('../validations/evaluationValidation');
const { validateSubmission } = require("../validations/submissionValidation");

const router = express.Router();

// Submit answers
router.post("/:examId", validateSubmission, submitAnswers);

// Get all submissions for an exam
router.get("/:examId", getSubmissionsByExam);

// Get a participant's submission for an exam
router.get("/:examId/:participantId", getParticipantSubmission);


// Evaluate marks for a participant
router.get('/:examId/:participantId/evaluate', validateEvaluation, evaluateMarks)
module.exports = router;
