const mongoose = require('mongoose');
const { Schema } = mongoose;

const memberSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      // Password is required only for local authentication
      return this.provider === 'local' || !this.provider;
    },
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  YOB: {
    type: Number,
    required: function() {
      // YOB is required only for local registration
      return this.provider === 'local' || !this.provider;
    },
    min: 1900,
    max: new Date().getFullYear()
  },
  gender: {
    type: Boolean,
    required: function() {
      // Gender is required only for local registration
      return this.provider === 'local' || !this.provider;
    } // true = male, false = female
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  // OAuth provider information
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  googleId: {
    type: String,
    sparse: true, // Allows null values but ensures uniqueness when present
    unique: true
  },
  avatar: {
    type: String, // Store Google profile picture URL
    default: null
  }
}, { 
  timestamps: true 
});

// Instance method to check if user is admin
memberSchema.methods.isAdminUser = function() {
  return this.isAdmin;
};

// Static method to find admin users
memberSchema.statics.findAdmins = function() {
  return this.find({ isAdmin: true });
};

module.exports = mongoose.model('Members', memberSchema);