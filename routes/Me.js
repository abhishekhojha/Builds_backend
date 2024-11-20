const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/me'); 

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = req.user;

    res.status(200).send({
      name: user.name,
      email: user.email,
      role: user.role,
      courses: user.courses,
      isVerified: user.isVerified,
      isEmailVerified: user.isEmailVerified,
      isBlocked: user.isBlocked,
      adminApproved: user.adminApproved,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    res.status(500).send({ message: 'Server error while fetching user details', error });
  }
});

module.exports = router;
