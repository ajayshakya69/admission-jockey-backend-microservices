const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');

// Get all applications
router.get('/', applicationController.getApplications);

// Get application by ID
router.get('/:applicationId', applicationController.getApplicationById);

// Create new application
router.post('/', applicationController.createApplication);

// Update application by ID
router.put('/:applicationId', applicationController.updateApplication);

// Delete application by ID
router.delete('/:applicationId', applicationController.deleteApplication);

module.exports = router;
