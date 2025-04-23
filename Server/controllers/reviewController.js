const Review = require('../models/Review');
const Video = require('../models/Video');
const Profile = require('../models/Profile');

// Create review
exports.createReview = async (req, res) => {
  try {
    const { videoId, profileId, rating, content, isPublic } = req.body;
    
    // Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    // Check if profile exists
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    const review = new Review({
      video: videoId,
      profile: profileId,
      rating,
      content,
      isPublic
    });
    
    const newReview = await review.save();
    
    // Add review to video's reviews array
    video.reviews.push(newReview._id);
    await video.save();
    
    // Add review to profile's reviews array
    profile.reviews.push(newReview._id);
    await profile.save();
    
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all reviews for a video
exports.getVideoReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ 
      video: req.params.videoId,
      isPublic: true 
    }).populate('profile');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reviews for a profile
exports.getProfileReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ profile: req.params.profileId })
      .populate('video');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    review.rating = req.body.rating || review.rating;
    review.content = req.body.content || review.content;
    review.isPublic = req.body.isPublic !== undefined ? req.body.isPublic : review.isPublic;
    
    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Remove review from video's reviews array
    await Video.findByIdAndUpdate(review.video, {
      $pull: { reviews: review._id }
    });
    
    // Remove review from profile's reviews array
    await Profile.findByIdAndUpdate(review.profile, {
      $pull: { reviews: review._id }
    });
    
    await review.remove();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 