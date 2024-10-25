// const express = require('express');
// const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/categoryController');
// const { authMiddleware, hasRole } = require('../middleware/Auth');

// const router = express.Router();

// // Route to create a new category (only admins can create)
// router.post('/', authMiddleware, hasRole(['admin']), createCategory);

// // Route to get all categories (accessible by all roles, including subcategories)
// router.get('/', getAllCategories);

// // Route to get a category by ID (accessible by all roles, with subcategories)
// router.get('/:id', getCategoryById);

// // Route to update a category (only admins can update)
// router.put('/:id', authMiddleware, hasRole(['admin']), updateCategory);

// // Route to delete a category (only admins can delete)
// router.delete('/:id', authMiddleware, hasRole(['admin']), deleteCategory);

// module.exports = router;