const express = require('express');
const router = express.Router();
const axios = require('axios');

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:4001';

// Forward user profile requests to user-service
router.get('/:userId', async (req, res) => {
  try {
    const response = await axios.get(USER_SERVICE_URL + '/users/' + req.params.userId);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.put('/:userId', async (req, res) => {
  try {
    const response = await axios.put(USER_SERVICE_URL + '/users/' + req.params.userId, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.post('/:userId/education', async (req, res) => {
  try {
    const response = await axios.post(USER_SERVICE_URL + '/users/' + req.params.userId + '/education', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.put('/:userId/preferences', async (req, res) => {
  try {
    const response = await axios.put(USER_SERVICE_URL + '/users/' + req.params.userId + '/preferences', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.post('/:userId/avatar', async (req, res) => {
  try {
    const response = await axios.post(USER_SERVICE_URL + '/users/' + req.params.userId + '/avatar', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

module.exports = router;
