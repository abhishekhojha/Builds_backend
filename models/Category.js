const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Reference to the same Category model for subcategories
        default: null // If null, it's a top-level category
    }
}, { timestamps: true });

// Method to get all subcategories of a category
categorySchema.virtual('subcategories', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parentCategory'
});

module.exports = mongoose.model('Category', categorySchema);
