const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  content: {
    type: String,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure one review per profile per video
reviewSchema.index({ video: 1, profile: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review; 