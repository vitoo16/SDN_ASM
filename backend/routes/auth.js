const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// @route   GET /api/auth/google
// @desc    Authenticate with Google
// @access  Public
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=google_auth_failed`,
    session: false // We'll use JWT instead of session
  }),
  async (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign(
        { id: req.user._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
      );

      // Prepare user object (without password)
      const userObject = {
        _id: req.user._id,
        id: req.user._id, // Include both for compatibility
        email: req.user.email,
        name: req.user.name,
        YOB: req.user.YOB,
        gender: req.user.gender,
        isAdmin: req.user.isAdmin,
        provider: req.user.provider,
        avatar: req.user.avatar
      };

      // Redirect to frontend with token and user data
      const clientURL = process.env.CLIENT_URL || 'http://localhost:3000';
      const redirectURL = `${clientURL}/auth/google/success?token=${token}&user=${encodeURIComponent(JSON.stringify(userObject))}`;
      
      res.redirect(redirectURL);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      const clientURL = process.env.CLIENT_URL || 'http://localhost:3000';
      res.redirect(`${clientURL}/login?error=auth_failed`);
    }
  }
);

// @route   POST /api/auth/google/verify
// @desc    Verify Google token from React OAuth
// @access  Public
router.post('/google/verify', async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      });
    }

    // Verify the Google token
    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists
    const Member = require('../models/Member');
    let user = await Member.findOne({ 
      $or: [
        { googleId },
        { email }
      ]
    });

    if (user) {
      // Update existing user with Google info if needed
      if (!user.googleId) {
        user.googleId = googleId;
        user.provider = 'google';
        user.avatar = picture;
        await user.save();
      }
    } else {
      // Create new user
      user = await Member.create({
        googleId,
        email,
        name,
        provider: 'google',
        avatar: picture,
        YOB: new Date().getFullYear() - 25,
        gender: true,
        isAdmin: false
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    );

    // Return user and token
    res.json({
      success: true,
      message: 'Google authentication successful',
      data: {
        member: {
          _id: user._id,
          id: user._id,
          email: user.email,
          name: user.name,
          YOB: user.YOB,
          gender: user.gender,
          isAdmin: user.isAdmin,
          provider: user.provider,
          avatar: user.avatar
        },
        token
      }
    });
  } catch (error) {
    console.error('Google token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid Google token',
      error: error.message
    });
  }
});

module.exports = router;

