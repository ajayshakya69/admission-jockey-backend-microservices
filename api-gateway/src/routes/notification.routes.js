const express = require('express');
const router = express.Router();
const axios = require('axios');

const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:4008';

// Forward notification-related requests to notification-service
router.post('/email', async (req, res) => {
  try {
    const response = await axios.post(NOTIFICATION_SERVICE_URL + '/notifications/email', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.post('/push', async (req, res) => {
  try {
    const response = await axios.post(NOTIFICATION_SERVICE_URL + '/notifications/push', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(NOTIFICATION_SERVICE_URL + '/notifications', { params: req.query });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.put('/:id/read', async (req, res) => {
  try {
    const response = await axios.put(NOTIFICATION_SERVICE_URL + '/notifications/' + req.params.id + '/read', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

module.exports = router;
