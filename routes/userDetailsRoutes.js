const express = require('express');
const router = express.Router();
const userDetailsController = require('../controllers/userDetailsController');
const { hasRole } = require('../middlewares/hasRole');

// POST /api/user-details (student, teacher, admin can save their own details)
router.post(
    '/user-details',
    hasRole(['student', 'teacher', 'admin']),
    userDetailsController.saveUserDetails
);

// GET /api/user-details/:userId (only self or admin can access)
router.get(
    '/user-details/:userId',
    hasRole(['student', 'teacher', 'admin']),
    userDetailsController.getUserDetails
);

module.exports = router;
