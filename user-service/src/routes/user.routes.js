const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profile.controller');
const educationController = require('../controllers/education.controller');

// Get user profile
router.get('/:userId', profileController.getProfile);

// Update user profile
router.put('/:userId', profileController.updateProfile);

// Add education history
router.post('/:userId/education', educationController.addEducation);

// Update user preferences
router.put('/:userId/preferences', profileController.updatePreferences);

// Upload profile picture
router.post('/:userId/avatar', profileController.uploadAvatar);

module.exports = router;
