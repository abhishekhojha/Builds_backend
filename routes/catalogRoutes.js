const express = require('express');
const router = express.Router();
const {
    createCatalog,
    getCatalogs,
    getCatalogById,
    updateCatalog,
    deleteCatalog,
} = require('../controllers/catalogController');

// POST /api/catalog
router.post('/', createCatalog);

// GET all catalogs
router.get('/', getCatalogs);

// GET single catalog
router.get('/:id', getCatalogById);

// PUT update catalog
router.put('/:id', updateCatalog);

// DELETE catalog
router.delete('/:id', deleteCatalog);

module.exports = router;
