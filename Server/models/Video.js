const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  tmdbId: {
    type: String,
    required: true,
    unique: true
  },
  averageRating: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video; 