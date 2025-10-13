const express = require('express');
const { body } = require('express-validator');
const { 
  registerMember, 
  loginMember, 
  getProfile, 
  updateProfile, 
  changePassword,
  getAllMembers
} = require('../controllers/memberController');
const { 
  authenticateToken, 
  requireAdmin, 
  requireSelfOrAdmin 
} = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('YOB').isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Invalid year of birth'),
  body('gender').isBoolean().withMessage('Gender must be boolean (true/false)')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

const updateProfileValidation = [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('YOB').optional().isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Invalid year of birth'),
  body('gender').optional().isBoolean().withMessage('Gender must be boolean (true/false)')
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

// Public routes
router.post('/register', registerValidation, handleValidationErrors, registerMember);
router.post('/login', loginValidation, handleValidationErrors, loginMember);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/:id', authenticateToken, requireSelfOrAdmin, updateProfileValidation, handleValidationErrors, updateProfile);
router.put('/:id/password', authenticateToken, requireSelfOrAdmin, changePasswordValidation, handleValidationErrors, changePassword);

// Admin only routes
router.get('/collectors', authenticateToken, requireAdmin, getAllMembers);

module.exports = router;