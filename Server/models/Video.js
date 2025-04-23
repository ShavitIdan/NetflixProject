const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  videoID: {
    type: String,
    required: [true, 'Video URL is required']
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]
}, {
  timestamps: true
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video; 