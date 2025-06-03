const express = require('express');
const router = express.Router();
const axios = require('axios');

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:4000';

// Forward all auth requests to auth-service
router.post('/register', async (req, res) => {
  try {
    const response = await axios.post(AUTH_SERVICE_URL + '/auth/register', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const response = await axios.post(AUTH_SERVICE_URL + '/auth/login', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.post('/refresh-token', async (req, res) => {
  try {
    const response = await axios.post(AUTH_SERVICE_URL + '/auth/refresh-token', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const response = await axios.post(AUTH_SERVICE_URL + '/auth/forgot-password', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const response = await axios.post(AUTH_SERVICE_URL + '/auth/reset-password', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.get('/verify-email/:token', async (req, res) => {
  try {
    const response = await axios.get(AUTH_SERVICE_URL + '/auth/verify-email/' + req.params.token);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

module.exports = router;
