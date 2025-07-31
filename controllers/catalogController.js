const Catalog = require('../models/Catalog');

exports.createCatalog = async (req, res) => {
    try {
        const { title, description, feedback, videoUrl, thumbnail, uploadedBy } = req.body;

        if (!title || !feedback || !videoUrl || !uploadedBy) {
            return res.status(400).json({ message: 'Required fields are missing.' });
        }

        const catalog = new Catalog({
            title,
            description,
            feedback,
            videoUrl,
            thumbnail,
            uploadedBy,
        });

        const saved = await catalog.save();
        res.status(201).json({
            message: 'Catalog entry created successfully',
            data: saved,
        });
    } catch (err) {
        console.error('Error creating catalog:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getCatalogs = async (req, res) => {
    try {
        const catalog = await Catalog.find()
        res.status(200).json(catalog);
    } catch (error) {
        res.status(500).send({ message: "Error fetching feedback form", error });
    }
}

// Get a single catalog by ID
exports.getCatalogById = async (req, res) => {
    try {
        const catalog = await Catalog.findById(req.params.id).populate('feedback uploadedBy');
        if (!catalog) {
            return res.status(404).json({ message: 'Catalog not found' });
        }
        res.status(200).json(catalog);
    } catch (error) {
        res.status(500).json({ message: "Error fetching catalog", error });
    }
};

// Update a catalog by ID
exports.updateCatalog = async (req, res) => {
    try {
        const updatedCatalog = await Catalog.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedCatalog) {
            return res.status(404).json({ message: 'Catalog not found' });
        }
        res.status(200).json({
            message: 'Catalog updated successfully',
            data: updatedCatalog,
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating catalog", error });
    }
};

// Delete a catalog by ID
exports.deleteCatalog = async (req, res) => {
    try {
        const deletedCatalog = await Catalog.findByIdAndDelete(req.params.id);
        if (!deletedCatalog) {
            return res.status(404).json({ message: 'Catalog not found' });
        }
        res.status(200).json({ message: 'Catalog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: "Error deleting catalog", error });
    }
};