const Category = require('../models/Category');

// Create a new category (can also be a subcategory)
exports.createCategory = async (req, res) => {
    const { name, description, parentCategory } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Category name is required.' });
    }

    try {
        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            return res.status(400).json({ message: 'Category with this name already exists.' });
        }

        const category = new Category({
            name,
            description,
            parentCategory: parentCategory || null // null if it's a top-level category
        });

        await category.save();
        res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error });
    }
};

// Get all categories (with their subcategories)
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ parentCategory: null }) // Get top-level categories only
            .populate('subcategories'); // Populate subcategories

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error });
    }
};

// Get category by ID (with subcategories)
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
            .populate('subcategories'); // Populate subcategories

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category', error });
    }
};

// Update a category (can also update parentCategory to reassign it)
exports.updateCategory = async (req, res) => {
    const { name, description, parentCategory } = req.body;

    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Update category fields
        if (name) category.name = name;
        if (description) category.description = description;
        if (parentCategory) category.parentCategory = parentCategory;

        await category.save();

        res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error });
    }
};

// Delete a category (only if it has no subcategories or courses assigned to it)
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Ensure the category has no subcategories or courses before deletion
        const subcategories = await Category.find({ parentCategory: req.params.id });
        if (subcategories.length > 0) {
            return res.status(400).json({ message: 'Cannot delete category with subcategories. Remove them first.' });
        }

        await category.remove();
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error });
    }
};