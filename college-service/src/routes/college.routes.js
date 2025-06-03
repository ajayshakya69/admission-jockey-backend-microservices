const express = require('express');
const router = express.Router();
const collegeController = require('../controllers/college.controller');

// Get all colleges
router.get('/', collegeController.getColleges);

// Get college by ID
router.get('/:collegeId', collegeController.getCollegeById);

// Create new college
router.post('/', collegeController.createCollege);

// Update college by ID
router.put('/:collegeId', collegeController.updateCollege);

// Delete college by ID
router.delete('/:collegeId', collegeController.deleteCollege);

module.exports = router;
