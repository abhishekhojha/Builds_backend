const express = require('express');
const router = express.Router();
const userDetailsController = require('../controllers/userDetailsController');
const { hasRole } = require('../middleware/Auth');

// POST / (student, teacher, admin can save their own details)
router.post(
    '/',
    hasRole(['student', 'teacher', 'admin']),
    userDetailsController.saveUserDetails
);

// GET /:userId (only self or admin can access)
router.get(
    '/:userId',
    hasRole(['student', 'teacher', 'admin']),
    userDetailsController.getUserDetails
);

module.exports = router;
