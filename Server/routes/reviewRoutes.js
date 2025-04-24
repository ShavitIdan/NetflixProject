const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// Create a new review
router.post('/', auth, reviewController.createReview);

// Get all reviews for a specific video
router.get('/video/:videoId', auth, reviewController.getVideoReviews);

// Get all reviews for a specific profile
router.get('/profile/:profileId', auth, reviewController.getProfileReviews);

// Update a review
router.put('/:id', auth, reviewController.updateReview);

// Delete a review
router.delete('/:id', auth, reviewController.deleteReview);

module.exports = router; 