const express = require("express");
const feedbackController = require("../controllers/FeedbackController");
const router = express.Router();
const { hasRole } = require("../middleware/Auth");

// Create a feedback form with questions
router.post(
  "/create",
  hasRole(["admin"]),
  feedbackController.createFeedbackForm
);

// Get all feedbacks
router.get("/", feedbackController.getAllFeedbacks);

// Get a feedback form by ID
router.get("/:id", feedbackController.getFeedbackForm);

// Get a feedback form by ID
router.get("/response/:id", feedbackController.getFeedbackResponse);

// Update a feedback by id
router.put("/:id", hasRole(["admin"]), feedbackController.updateFeedbackForm);

// Delete a feedback by id
router.delete(
  "/:id",
  hasRole(["admin"]),
  feedbackController.deleteFeedbackForm
);

// Submit a feedback response
router.post(
  "/submit",
  hasRole(["student"]),
  feedbackController.submitFeedbackResponse
);

module.exports = router;
