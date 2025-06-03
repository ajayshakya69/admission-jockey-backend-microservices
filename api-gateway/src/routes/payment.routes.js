const express = require('express');
const router = express.Router();
const axios = require('axios');

const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:4007';

// Forward payment-related requests to payment-service
router.post('/payments', async (req, res) => {
  try {
    const response = await axios.post(PAYMENT_SERVICE_URL + '/payments', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.get('/payments/:id', async (req, res) => {
  try {
    const response = await axios.get(PAYMENT_SERVICE_URL + '/payments/' + req.params.id);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.get('/payments', async (req, res) => {
  try {
    const response = await axios.get(PAYMENT_SERVICE_URL + '/payments', { params: req.query });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.post('/webhooks/razorpay', async (req, res) => {
  try {
    const response = await axios.post(PAYMENT_SERVICE_URL + '/webhooks/razorpay', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.post('/webhooks/stripe', async (req, res) => {
  try {
    const response = await axios.post(PAYMENT_SERVICE_URL + '/webhooks/stripe', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

module.exports = router;
