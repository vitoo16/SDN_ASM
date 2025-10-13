const express = require('express');
const { body } = require('express-validator');
const { 
  getAllBrands, 
  getBrandById, 
  createBrand, 
  updateBrand, 
  deleteBrand 
} = require('../controllers/brandController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const brandValidation = [
  body('brandName').trim().isLength({ min: 2 }).withMessage('Brand name must be at least 2 characters')
];

// Public routes (GET operations)
router.get('/', getAllBrands);
router.get('/:brandId', getBrandById);

// Admin only routes (POST, PUT, DELETE operations)
router.post('/', authenticateToken, requireAdmin, brandValidation, handleValidationErrors, createBrand);
router.put('/:brandId', authenticateToken, requireAdmin, brandValidation, handleValidationErrors, updateBrand);
router.delete('/:brandId', authenticateToken, requireAdmin, deleteBrand);

module.exports = router;