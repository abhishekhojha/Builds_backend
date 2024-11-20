const express = require('express');
const feedbackController = require('../controllers/FeedbackController');
const router = express.Router();

// Create a feedback form with questions
router.post('/create', feedbackController.createFeedbackForm);

// Get a feedback form by ID
router.get('/:id', feedbackController.getFeedbackForm);

// Submit a feedback response
router.post('/submit', feedbackController.submitFeedbackResponse);

module.exports = router;