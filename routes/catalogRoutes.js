const express = require('express');
const router = express.Router();
const {
    createCatalog,
    getCatalogs,
    getCatalogById,
    updateCatalog,
    deleteCatalog,
} = require('../controllers/catalogController');
const { hasRole } = require('../middleware/Auth');

// POST /api/catalog
router.post('/', hasRole(["admin"]), createCatalog);

// GET all catalogs
router.get('/', getCatalogs);

// GET single catalog
router.get('/:id', getCatalogById);

// PUT update catalog
router.put('/:id', hasRole(["admin"]), updateCatalog);

// DELETE catalog
router.delete('/:id', hasRole(["admin"]), deleteCatalog);

module.exports = router;
