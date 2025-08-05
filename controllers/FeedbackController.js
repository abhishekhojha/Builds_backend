const { Feedback, Response } = require("../models/Feedback");

// Create a new feedback form with questions
exports.createFeedbackForm = async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).send({ message: "Feedback form created", feedback });
  } catch (error) {
    res.status(500).send({ message: "Error creating feedback form", error });
  }
};

// Get all feedbacks
exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedback = await Feedback.find();
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).send({ message: "Error fetching feedback form", error });
  }
};
// Get a feedback form with its questions
exports.getFeedbackForm = async (req, res) => {
  try {
    const feedbackId = req.params.id;
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).send({ message: "Feedback form not found" });
    }
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).send({ message: "Error fetching feedback form", error });
  }
};
exports.getFeedbackResponse = async (req, res) => {
  try {
    const feedbackId = req.params.id;
    const feedback = await Response.find({ feedbackId }).populate("user");
    if (!feedback) {
      return res.status(404).send({ message: "Feedback Responses not found" });
    }
    res.status(200).json(feedback);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching feedback Responses", error });
  }
};
exports.updateFeedbackForm = async (req, res) => {
  try {
    const { title, questions } = req.body;
    const updated = await Feedback.findByIdAndUpdate(
      req.params.id,
      { title, questions },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).send({ message: "Error updating feedback", error: err });
  }
};
exports.deleteFeedbackForm = async (req, res) => {
  try {
    const deleted = await Feedback.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Feedback not found" });

    res.status(200).json({ message: "Feedback form deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting feedback form", error });
  }
};

// Save responses to a feedback form
exports.submitFeedbackResponse = async (req, res) => {
  try {
    const { feedbackId, responses } = req.body;

    // Create a new response document
    const feedbackResponse = new Response({
      feedbackId,
      user: req.user.id,
      responses,
    });

    await feedbackResponse.save();
    res
      .status(201)
      .send({ message: "Feedback submitted successfully", feedbackResponse });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error submitting feedback response", error });
  }
};
