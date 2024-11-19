const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/OrderController');

// Route to create order
router.post('/create', createOrder);

// Route to verify payment
router.post('/verify', verifyPayment);

module.exports = router;