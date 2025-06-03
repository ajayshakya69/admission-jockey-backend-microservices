const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');

// Get all notifications
router.get('/', notificationController.getNotifications);

// Get notification by ID
router.get('/:notificationId', notificationController.getNotificationById);

// Create new notification
router.post('/', notificationController.createNotification);

// Update notification by ID
router.put('/:notificationId', notificationController.updateNotification);

// Mark notification as read
router.put('/:notificationId/read', notificationController.markAsRead);

module.exports = router;
