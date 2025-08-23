// softDelete.js
const express = require('express');
const router = express.Router();
const softDeleteController = require('../controllers/softDeleteController');

// Soft delete any entity
router.post('/delete', softDeleteController.softDelete);
// Restore soft deleted entity
router.post('/restore', softDeleteController.restore);

module.exports = router;
