const express = require('express');
const router = express.Router();
const passport = require('passport');

// @route   GET /auth/google
// @desc    Authenticate with Google
// @access  Public
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

// @route   GET /auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/?openAuth=login&error=google_auth_failed',
    session: true
  }),
  async (req, res) => {
    try {
      const jwt = require('jsonwebtoken');
      
      // Generate JWT token
      const token = jwt.sign(
        { id: req.user._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
      );

      // Set JWT token in httpOnly cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      // Set session
      req.session.user = {
        _id: req.user._id.toString(),
        email: req.user.email,
        name: req.user.name,
        isAdmin: req.user.isAdmin,
        gender: req.user.gender,
        YOB: req.user.YOB,
        avatar: req.user.avatar,
        provider: req.user.provider
      };

      // Save session before redirect
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
        }
        
        // Redirect with token setup
        const redirectUrl = req.session.redirectUrl || '/';
        delete req.session.redirectUrl;
        
        res.send(`
          <!DOCTYPE html>
          <html>
          <head><title>Logging in with Google...</title></head>
          <body>
            <p style="text-align: center; padding: 2rem; font-family: system-ui;">
              Đang đăng nhập với Google...
            </p>
            <script>
              // Set token in localStorage for admin dashboard AJAX calls
              localStorage.setItem('token', '${token}');
              // Redirect to target page
              window.location.href = '${redirectUrl}';
            </script>
          </body>
          </html>
        `);
      });
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect('/?openAuth=login&error=auth_failed');
    }
  }
);

module.exports = router;

