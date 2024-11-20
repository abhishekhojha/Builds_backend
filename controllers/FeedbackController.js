const { Feedback, Response } = require('../models/Feedback');

// Create a new feedback form with questions
exports.createFeedbackForm = async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).send({ message: 'Feedback form created', feedback });
  } catch (error) {
    res.status(500).send({ message: 'Error creating feedback form', error });
  }
};

// Get a feedback form with its questions
exports.getFeedbackForm = async (req, res) => {
  try {
    const feedbackId = req.params.id;
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).send({ message: 'Feedback form not found' });
    }
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching feedback form', error });
  }
};

// Save responses to a feedback form
exports.submitFeedbackResponse = async (req, res) => {
  try {
    const { feedbackId, responses } = req.body;
    console.log(req.user)

    // Create a new response document
    const feedbackResponse = new Response({
      feedbackId,
      user: req.user.id,
      responses
    });

    await feedbackResponse.save();
    res.status(201).send({ message: 'Feedback submitted successfully', feedbackResponse });
  } catch (error) {
    res.status(500).send({ message: 'Error submitting feedback response', error });
  }
};