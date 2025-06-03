const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// Get all payments
router.get('/', paymentController.getPayments);

// Get payment by ID
router.get('/:paymentId', paymentController.getPaymentById);

// Create new payment
router.post('/', paymentController.createPayment);

// Update payment by ID
router.put('/:paymentId', paymentController.updatePayment);

// Delete payment by ID
router.delete('/:paymentId', paymentController.deletePayment);

module.exports = router;
