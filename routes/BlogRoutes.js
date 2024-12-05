const express = require('express');
const { getAllBlog, createBlog, getBlogById, getLatestBlog, updateBlog, deleteBlog } = require('../controllers/blogController');

const { hasRole } = require('../middleware/Auth');

const router = express.Router();
// // Route to create a new category (only admins can create)
router.post('/', hasRole(['admin']), createBlog);


// // Route to get all categories (accessible by all roles, including subcategories)
router.get('/', getAllBlog);
router.get('/latest', getLatestBlog);


// // Route to get a category by ID (accessible by all roles, with subcategories)
router.get('/:id', getBlogById);

// // Route to update a category (only admins can update)
router.put('/:id', hasRole(['admin']),updateBlog);


// // Route to delete a category (only admins can delete)
router.delete('/:id', hasRole(['admin']), deleteBlog);

module.exports = router;