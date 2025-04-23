const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Get all profiles for the current user
router.get('/', profileController.getUserProfiles);

// Create a new profile
router.post('/', profileController.createProfile);

// Update a profile
router.put('/:profileId', profileController.updateProfile);

// Delete a profile
router.delete('/:profileId', profileController.deleteProfile);

module.exports = router; 