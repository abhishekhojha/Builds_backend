const express = require("express");
const { getLeaderboard } = require("../controllers/leaderboardController");

const router = express.Router();

// Get leaderboard for an exam
router.get("/:examId", getLeaderboard);

module.exports = router;
