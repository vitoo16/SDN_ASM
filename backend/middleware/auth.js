const jwt = require('jsonwebtoken');
const Member = require('../models/Member');

// Authentication middleware - verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database to ensure they still exist
    const user = await Member.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token - user not found' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

// Admin authorization middleware
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin privileges required' 
    });
  }

  next();
};

// Self or admin authorization - allows users to edit their own data or admin to edit any
const requireSelfOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }

  const targetUserId = req.params.id || req.params.memberId;
  
  // Allow if user is admin or accessing their own data
  if (req.user.isAdmin || req.user._id.toString() === targetUserId) {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied - can only modify your own data' 
    });
  }
};

// Member only authorization (excludes admin from certain actions)
const requireMember = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireSelfOrAdmin,
  requireMember
};