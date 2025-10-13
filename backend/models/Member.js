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
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  YOB: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear()
  },
  gender: {
    type: Boolean,
    required: true // true = male, false = female
  },
  isAdmin: {
    type: Boolean,
    default: false
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