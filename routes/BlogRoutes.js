const express = require('express');
const { getAllBlog, createBlog, getBlogById, updateBlog, deleteBlog } = require('../controllers/blogController');

// const { authMiddleware, hasRole } = require('../middleware/Auth');

const router = express.Router();
// // Route to create a new category (only admins can create)
// router.post('/', authMiddleware, hasRole(['admin']), createCategory);
router.post('/', createBlog);


// // Route to get all categories (accessible by all roles, including subcategories)
router.get('/', getAllBlog);

// // Route to get a category by ID (accessible by all roles, with subcategories)
router.get('/:id', getBlogById);

// // Route to update a category (only admins can update)
// router.put('/:id', authMiddleware, hasRole(['admin']), updateCategory);
router.put('/:id',updateBlog);


// // Route to delete a category (only admins can delete)
// router.delete('/:id', authMiddleware, hasRole(['admin']), deleteCategory);
router.delete('/:id', deleteBlog);

module.exports = router;