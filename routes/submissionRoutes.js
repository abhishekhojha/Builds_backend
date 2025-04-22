const express = require("express");
const {
  submitAnswers,
  getSubmissionsByExam,
  getParticipantSubmission,
  evaluateMarks,
  getExams,
  evaluateAllMarks,
} = require("../controllers/submissionController");
const { validateEvaluation } = require("../validations/evaluationValidation");
const { validateSubmission } = require("../validations/submissionValidation");
const { hasRole } = require("../middleware/Auth");

const router = express.Router();

// Submit answers
router.post("/:examId", validateSubmission, submitAnswers);

router.get("/evaluate-all/:examId", evaluateAllMarks);
// Get all submissions for an exam
router.get("/:examId", getSubmissionsByExam);

router.get("/exam/:examId", getExams);

// Get a participant's submission for an exam
router.get("/:examId/:participantId", getParticipantSubmission);

// Evaluate marks for a participant
router.get(
  "/:examId/:participantId/evaluate",
  validateEvaluation,
  evaluateMarks
);
module.exports = router;
