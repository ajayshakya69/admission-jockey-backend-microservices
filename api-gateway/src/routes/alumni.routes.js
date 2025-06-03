const express = require('express');
const router = express.Router();
const axios = require('axios');

const ALUMNI_SERVICE_URL = process.env.ALUMNI_SERVICE_URL || 'http://localhost:4005';

// Forward alumni-related requests to alumni-service
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(ALUMNI_SERVICE_URL + '/alumni', { params: req.query });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(ALUMNI_SERVICE_URL + '/alumni/' + req.params.id);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.post('/:id/connect', async (req, res) => {
  try {
    const response = await axios.post(ALUMNI_SERVICE_URL + '/alumni/' + req.params.id + '/connect', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.post('/:id/messages', async (req, res) => {
  try {
    const response = await axios.post(ALUMNI_SERVICE_URL + '/alumni/' + req.params.id + '/messages', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.get('/connections', async (req, res) => {
  try {
    const response = await axios.get(ALUMNI_SERVICE_URL + '/alumni/connections');
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.get('/messages', async (req, res) => {
  try {
    const response = await axios.get(ALUMNI_SERVICE_URL + '/alumni/messages');
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

module.exports = router;
