const express = require('express');
const { body } = require('express-validator');
const { 
  getAllPerfumes, 
  getPerfumeById, 
  createPerfume, 
  updatePerfume, 
  deletePerfume,
  addComment,
  updateComment,
  deleteComment
} = require('../controllers/perfumeController');
const { authenticateToken, requireAdmin, requireMember } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const perfumeValidation = [
  body('perfumeName').trim().isLength({ min: 2 }).withMessage('Perfume name must be at least 2 characters'),
  body('uri').isURL().withMessage('Invalid image URL'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('concentration').isIn(['Extrait', 'EDP', 'EDT', 'EDC']).withMessage('Invalid concentration type'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('ingredients').trim().isLength({ min: 5 }).withMessage('Ingredients must be at least 5 characters'),
  body('volume').isFloat({ min: 0 }).withMessage('Volume must be a positive number'),
  body('targetAudience').isIn(['male', 'female', 'unisex']).withMessage('Invalid target audience'),
  body('brand').isMongoId().withMessage('Invalid brand ID')
];

const commentValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('content').trim().isLength({ min: 5 }).withMessage('Comment must be at least 5 characters')
];

// Public routes (GET operations)
router.get('/', getAllPerfumes);
router.get('/:perfumeId', getPerfumeById);

// Admin only routes (POST, PUT, DELETE operations)
router.post('/', authenticateToken, requireAdmin, perfumeValidation, handleValidationErrors, createPerfume);
router.put('/:perfumeId', authenticateToken, requireAdmin, perfumeValidation, handleValidationErrors, updatePerfume);
router.delete('/:perfumeId', authenticateToken, requireAdmin, deletePerfume);

// Member routes for comments
router.post('/:perfumeId/comments', authenticateToken, requireMember, commentValidation, handleValidationErrors, addComment);
router.put('/:perfumeId/comments/:commentId', authenticateToken, requireMember, commentValidation, handleValidationErrors, updateComment);
router.delete('/:perfumeId/comments/:commentId', authenticateToken, requireMember, deleteComment);

module.exports = router;