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
router.put('/:id', hasRole(['admin']), async (req, res) => {
  
  if(!req.params.id || !req.body.role) 
    return res.status(400).json({ error: 'id and role is required' });
  try {
    const user = await User.findOneAndUpdate({ _id: req.params.id }, { role: req.body.role }, { new: true });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/search", hasRole(['admin']), async (req, res) => {
  if(!req.query.q) return res.status(400).json({ error: 'q is required' });
  console.log(req.query.q);
  let page = 1;
  let limit = parseInt(req.query.limit) || 20;
  try {
    const users = await User.find({ email: { $regex: req.query.q, $options: "i" } }).select('-password').limit(limit);
    const totalPage = 1;
    const data = {
      users: users,
      page: page,
      totalPages: totalPage
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
module.exports = router