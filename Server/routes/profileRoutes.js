const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getUserProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
  saveVideo,
  removeVideo,
  selectProfile
} = require('../controllers/profileController');

// Get all profiles for the authenticated user
router.get('/', auth, getUserProfiles);

// Create a new profile
router.post('/', auth, createProfile);

// Update a profile
router.put('/:profileId', auth, updateProfile);

// Delete a profile
router.delete('/:profileId', auth, deleteProfile);

// Select a profile
router.post('/select/:profileId', auth, selectProfile);

// Save video to profile
router.post('/save-video', auth, saveVideo);

// Remove video from profile
router.post('/remove-video', auth, removeVideo);

module.exports = router; 