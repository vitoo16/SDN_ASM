const mongoose = require('mongoose');
const { Schema } = mongoose;

const brandSchema = new Schema({
  brandName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Brands', brandSchema);