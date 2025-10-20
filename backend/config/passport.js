const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Member = require('../models/Member');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await Member.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in database
        let user = await Member.findOne({ 
          $or: [
            { googleId: profile.id },
            { email: profile.emails[0].value }
          ]
        });

        if (user) {
          // If user exists but doesn't have googleId, update it
          if (!user.googleId) {
            user.googleId = profile.id;
            user.provider = 'google';
            if (profile.photos && profile.photos.length > 0) {
              user.avatar = profile.photos[0].value;
            }
            await user.save();
          }
          return done(null, user);
        }

        // Create new user if doesn't exist
        const newUser = await Member.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName || profile.name.givenName + ' ' + profile.name.familyName,
          provider: 'google',
          avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
          // Set default values for required fields
          YOB: new Date().getFullYear() - 25, // Default to 25 years old
          gender: true, // Default to male
          isAdmin: false
        });

        done(null, newUser);
      } catch (error) {
        console.error('Error in Google Strategy:', error);
        done(error, null);
      }
    }
  )
);

module.exports = passport;

