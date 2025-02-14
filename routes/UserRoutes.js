const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { hasRole } = require('../middleware/Auth');

router.get('/', hasRole(['admin']) ,async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 20;
  let offset = (page - 1) * limit;
  try {
    const users = await User.find({ role: { $ne: "admin" }}).select('-password').skip(offset).limit(limit);
    const totalPage = Math.ceil(await User.countDocuments() / limit);
    const data = {
      users: users,
      page: page,
      totalPages: totalPage
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router