const Submission = require("../models/submmition");
const Exam = require("../models/exam");
const { validationResult } = require("express-validator");

// Controller to handle validation errors
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

// Submit answers for an exam
exports.submitAnswers = async (req, res) => {
  handleValidationErrors(req, res);

  try {
    const { examId } = req.params;
    const { participantId, answers } = req.body;

    // Fetch the exam
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    // Check if the participant is allowed
    if (!exam.participants.includes(participantId)) {
      return res
        .status(403)
        .json({ error: "Participant not allowed for this exam" });
    }

    // Check if the exam is within the allowed time frame
    const currentTime = new Date();
    if (currentTime < exam.startTime || currentTime > exam.endTime) {
      return res
        .status(403)
        .json({ error: "Exam not accessible at this time" });
    }

    // Check for duplicate submission
    const existingSubmission = await Submission.findOne({
      exam: examId,
      participant: participantId,
    });
    if (existingSubmission) {
      return res.status(400).json({
        error: "Participant has already submitted answers for this exam",
      });
    }

    // Save the submission
    const submission = new Submission({
      exam: examId,
      participant: participantId,
      answers,
    });

    await submission.save();
    res
      .status(201)
      .json({ message: "Answers submitted successfully", submission });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to submit answers", details: error.message });
  }
};

exports.getExams = async (req, res) => {
  handleValidationErrors(req, res);

  try {
    const { examId } = req.params;
    const exam = await Exam.findOne({
      _id: examId,
      startTime: { $gte: new Date("2024-11-01") }, // condition 1
      endTime: { $gt: new Date() }, // condition 2
    }).populate("participants", "name email");

    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    return res.status(200).json(exam);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to fetch exam", details: error.message });
  }
};

// Fetch all submissions for an exam
exports.getSubmissionsByExam = async (req, res) => {
  try {
    const { examId } = req.params;

    const submissions = await Submission.find({ exam: examId }).populate(
      "participant",
      "name email"
    );

    res.status(200).json(submissions);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch submissions", details: error.message });
  }
};

// Fetch a participant's submission
exports.getParticipantSubmission = async (req, res) => {
  try {
    const { examId, participantId } = req.params;

    const submission = await Submission.findOne({
      exam: examId,
      participant: participantId,
    });

    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    res.status(200).json(submission);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch submission", details: error.message });
  }
};

// Evaluate marks for a submission
exports.evaluateMarks = async (req, res) => {
  try {
    const { examId, participantId } = req.params;

    // Fetch the exam
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    // Fetch the participant's submission
    const submission = await Submission.findOne({
      exam: examId,
      participant: participantId,
    });
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    // Calculate marks
    let totalMarks = 0;
    let maxMarks = exam.questions.length;

    exam.questions.forEach((question) => {
      const submittedAnswer = submission.answers.get(question.questionText);
      if (submittedAnswer === question.correctAnswer) {
        totalMarks++;
      }
    });

    res.status(200).json({
      participantId,
      examId,
      marks: totalMarks,
      maxMarks,
      percentage: ((totalMarks / maxMarks) * 100).toFixed(2),
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to evaluate marks", details: error.message });
  }
};
