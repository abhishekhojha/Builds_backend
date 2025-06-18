const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
} = require("../controllers/OrderController");
const { hasRole } = require("../middleware/Auth");

// Route to create order
router.post("/create", hasRole(["student"]), createOrder);

// Route to verify payment
router.post("/verify", hasRole(["student"]), verifyPayment);

module.exports = router;
