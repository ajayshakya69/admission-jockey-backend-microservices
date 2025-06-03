const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendar.controller');

// Get all events
router.get('/events', calendarController.getEvents);

// Get event by ID
router.get('/events/:eventId', calendarController.getEventById);

// Create new event
router.post('/events', calendarController.createEvent);

// Update event by ID
router.put('/events/:eventId', calendarController.updateEvent);

// Delete event by ID
router.delete('/events/:eventId', calendarController.deleteEvent);

module.exports = router;
