const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminder.controller');

// Get all reminders
router.get('/reminders', reminderController.getReminders);

// Get reminder by ID
router.get('/reminders/:reminderId', reminderController.getReminderById);

// Create new reminder
router.post('/reminders', reminderController.createReminder);

// Update reminder by ID
router.put('/reminders/:reminderId', reminderController.updateReminder);

// Delete reminder by ID
router.delete('/reminders/:reminderId', reminderController.deleteReminder);

module.exports = router;
