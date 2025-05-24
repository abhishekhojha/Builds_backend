const Exam = require("../models/exam");
const { validationResult } = require("express-validator");
const Submission = require("../models/submmition");
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
    const { title, description, startTime, endTime, participants, questions } =
      req.body;

    const exam = new Exam({
      title,
      description,
      startTime,
      endTime,
      participants,
      questions,
    });

    await exam.save();
    return res.status(201).json({ message: "Exam created successfully", exam });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to create exam", details: error.message });
  }
};

// Get all exams
exports.getAllExams = async (req, res) => {
  try {
    // Extract page and limit from query, with default values
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate how many documents to skip
    const skip = (page - 1) * limit;

    // Fetch paginated exams
    const exams = await Exam.find()
      .populate("participants", "name email")
      .skip(skip)
      .limit(limit);

    // Get total count for pagination info
    const totalExams = await Exam.countDocuments();

    return res.status(200).json({
      exams,
      currentPage: page,
      totalPages: Math.ceil(totalExams / limit),
      totalExams,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to fetch exams", details: error.message });
  }
};

// Get exam by ID
exports.getExamById = async (req, res) => {
  handleValidationErrors(req, res);

  try {
    const { examId } = req.params;
    const exam = await Exam.findById(examId).populate(
      "participants",
      "name email"
    );

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

// Update an exam
exports.updateExam = async (req, res) => {
  handleValidationErrors(req, res);

  try {
    const { examId } = req.params;
    console.log(req.body);

    const updatedExam = await Exam.findByIdAndUpdate(examId, req.body, {
      new: true,
    });
    console.log(updatedExam);

    if (!updatedExam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    return res
      .status(200)
      .json({ message: "Exam updated successfully", updatedExam });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to update exam", details: error.message });
  }
};

// Delete an exam
exports.deleteExam = async (req, res) => {
  handleValidationErrors(req, res);

  try {
    const { examId } = req.params;
    const deletedExam = await Exam.findByIdAndDelete(examId);

    if (!deletedExam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    return res.status(200).json({ message: "Exam deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to delete exam", details: error.message });
  }
};

exports.getAllExamsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const exams = await Exam.find({ participants: userId });
    const examsWithSubmissionStatus = [];

    for (const exam of exams) {
      const submission = await Submission.findOne({
        exam: exam._id,
        participant: userId,
      });

      examsWithSubmissionStatus.push({
        ...exam.toObject(),
        hasSubmitted: submission ? true : false,
      });
    }

    return res.status(200).json(examsWithSubmissionStatus);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to fetch exams", details: error.message });
  }
};
