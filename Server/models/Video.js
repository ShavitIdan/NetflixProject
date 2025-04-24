const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  tmdbId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  poster_path: String,
  backdrop_path: String,
  overview: String,
  media_type: {
    type: String,
    enum: ['movie', 'tv'],
    required: true
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