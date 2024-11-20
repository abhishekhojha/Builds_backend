const express = require('express');
const feedbackController = require('../controllers/FeedbackController');
const router = express.Router();
const { hasRole } = require('../middleware/Auth');

// Create a feedback form with questions
router.post('/create',hasRole(['student']), feedbackController.createFeedbackForm);

// Get a feedback form by ID
router.get('/:id',hasRole(['student']), feedbackController.getFeedbackForm);

// Submit a feedback response
router.post('/submit',hasRole(['student']), feedbackController.submitFeedbackResponse);

module.exports = router;