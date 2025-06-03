const express = require('express');
const router = express.Router();
const axios = require('axios');

const APPLICATION_SERVICE_URL = process.env.APPLICATION_SERVICE_URL || 'http://localhost:4004';

// Forward application builder related requests to application-service
router.get('/applications', async (req, res) => {
  try {
    const response = await axios.get(APPLICATION_SERVICE_URL + '/applications', { params: req.query });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.post('/applications', async (req, res) => {
  try {
    const response = await axios.post(APPLICATION_SERVICE_URL + '/applications', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.put('/applications/:id', async (req, res) => {
  try {
    const response = await axios.put(APPLICATION_SERVICE_URL + '/applications/' + req.params.id, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.get('/applications/:id/status', async (req, res) => {
  try {
    const response = await axios.get(APPLICATION_SERVICE_URL + '/applications/' + req.params.id + '/status');
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.post('/applications/:id/documents', async (req, res) => {
  try {
    const response = await axios.post(APPLICATION_SERVICE_URL + '/applications/' + req.params.id + '/documents', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.get('/forms/:collegeId', async (req, res) => {
  try {
    const response = await axios.get(APPLICATION_SERVICE_URL + '/forms/' + req.params.collegeId);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

module.exports = router;
