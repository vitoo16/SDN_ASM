const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Members",
    required: true
  }
}, { 
  timestamps: true 
});

const perfumeSchema = new Schema({
  perfumeName: {
    type: String,
    required: true,
    trim: true
  },
  uri: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  concentration: {
    type: String,
    required: true,
    enum: ['Extrait', 'EDP', 'EDT', 'EDC'] // Extrait, Eau de Parfum, Eau de Toilette, Eau de Cologne
  },
  description: {
    type: String,
    required: true
  },
  ingredients: {
    type: String,
    required: true
  },
  volume: {
    type: Number,
    required: true,
    min: 0
  },
  targetAudience: {
    type: String,
    required: true,
    enum: ['male', 'female', 'unisex']
  },
  comments: [commentSchema],
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brands",
    required: true
  }
}, { 
  timestamps: true 
});

// Index for better search performance
perfumeSchema.index({ perfumeName: 'text', description: 'text' });

// Method to check if user already commented
perfumeSchema.methods.hasUserCommented = function(userId) {
  return this.comments.some(comment => comment.author.toString() === userId.toString());
};

module.exports = mongoose.model('Perfumes', perfumeSchema);