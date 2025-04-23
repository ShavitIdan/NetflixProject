const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Profile name is required'],
    trim: true
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  savedVideos: [{
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    poster_path: String,
    backdrop_path: String,
    overview: String
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  isSelected: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile; 