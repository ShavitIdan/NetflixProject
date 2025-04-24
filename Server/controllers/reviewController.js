const Review = require('../models/Review');
const Video = require('../models/Video');
const Profile = require('../models/Profile');

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { videoId, profileId, rating, content, isPublic } = req.body;

    // Check if profile exists
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Find or create video document
    let video = await Video.findOne({ tmdbId: videoId });
    if (!video) {
      video = new Video({ tmdbId: videoId });
      await video.save();
    }

    // Check if review already exists for this video and profile
    const existingReview = await Review.findOne({ video: video._id, profile: profileId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this video' });
    }

    // Create new review
    const review = new Review({
      video: video._id,
      profile: profileId,
      rating,
      content,
      isPublic
    });

    await review.save();

    // Update video's average rating
    const reviews = await Review.find({ video: video._id });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    video.averageRating = totalRating / reviews.length;
    await video.save();

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Error creating review' });
  }
};

// Get all reviews for a specific video
exports.getVideoReviews = async (req, res) => {
  try {
    const { videoId } = req.params;

    // Find video document
    const video = await Video.findOne({ tmdbId: videoId });
    if (!video) {
      return res.json([]); // Return empty array if no reviews exist
    }

    // Get all public reviews for the video
    const reviews = await Review.find({ video: video._id, isPublic: true })
      .populate('profile', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Error getting video reviews:', error);
    res.status(500).json({ message: 'Error getting video reviews' });
  }
};

// Get all reviews for a specific profile
exports.getProfileReviews = async (req, res) => {
  try {
    const { profileId } = req.params;

    // Check if profile exists
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Get all reviews for the profile
    const reviews = await Review.find({ profile: profileId })
      .populate('video', 'tmdbId')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Error getting profile reviews:', error);
    res.status(500).json({ message: 'Error getting profile reviews' });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, content, isPublic } = req.body;

    console.log('Updating review:', {
      reviewId: id,
      userProfileId: req.user.profileId,
      body: req.body
    });

    // Find the review
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    console.log('Found review:', {
      reviewProfileId: review.profile.toString(),
      userProfileId: req.user.profileId
    });

    // Check if the user owns this review
    if (review.profile.toString() !== req.user.profileId?.toString()) {
      console.log('Authorization failed:', {
        reviewProfileId: review.profile.toString(),
        userProfileId: req.user.profileId?.toString()
      });
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    // Update review
    review.rating = rating;
    review.content = content;
    review.isPublic = isPublic;
    await review.save();

    // Update video's average rating
    const video = await Video.findById(review.video);
    const reviews = await Review.find({ video: review.video });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    video.averageRating = totalRating / reviews.length;
    await video.save();

    res.json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Error updating review' });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('Deleting review:', {
      reviewId: id,
      userProfileId: req.user.profileId
    });

    // Find the review
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    console.log('Found review:', {
      reviewProfileId: review.profile.toString(),
      userProfileId: req.user.profileId?.toString()
    });

    // Check if the user owns this review
    if (review.profile.toString() !== req.user.profileId?.toString()) {
      console.log('Authorization failed:', {
        reviewProfileId: review.profile.toString(),
        userProfileId: req.user.profileId?.toString()
      });
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    // Delete review using findByIdAndDelete
    await Review.findByIdAndDelete(id);

    // Update video's average rating
    const video = await Video.findById(review.video);
    const reviews = await Review.find({ video: review.video });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    video.averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    await video.save();

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Error deleting review' });
  }
}; 