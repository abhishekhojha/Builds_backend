const Submission = require("../models/submmition");
const Exam = require("../models/exam");

exports.getLeaderboard = async (req, res) => {
  try {
    const { examId } = req.params;

    // Fetch the exam
    const exam = await Exam.findById(examId).populate(
      "participants",
      "name email"
    );
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    // Fetch all submissions for the exam
    const submissions = await Submission.find({ exam: examId }).populate(
      "participant",
      "name email"
    );
    if (submissions.length === 0) {
      return res
        .status(404)
        .json({ error: "No submissions found for this exam" });
    }

    const leaderboard = [];

    // Loop through each submission and calculate scores
    submissions.forEach((submission) => {
      let totalMarks = 0;
      const maxMarks = exam.questions.length;

      exam.questions.forEach((question) => {
        const submittedAnswer = submission.answers.get(question._id.toString());
        if (submittedAnswer === question.correctAnswer) {
          totalMarks++;
        }
      });

      const percentage = ((totalMarks / maxMarks) * 100).toFixed(2);

      leaderboard.push({
        participant: {
          id: submission.participant._id,
          name: submission.participant.name,
          email: submission.participant.email,
        },
        score: totalMarks,
        percentage: parseFloat(percentage),
      });
    });

    // Sort leaderboard by scores in descending order
    leaderboard.sort((a, b) => b.score - a.score);

    res.status(200).json({
      examId,
      examTitle: exam.title,
      leaderboard,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to generate leaderboard",
      details: error.message,
    });
  }
};
