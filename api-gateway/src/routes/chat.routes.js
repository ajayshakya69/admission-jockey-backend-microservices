const express = require('express');
const router = express.Router();
const axios = require('axios');

const CHATBOT_GATEWAY_URL = process.env.CHATBOT_GATEWAY_URL || 'http://localhost:4003';

// Forward chat-related requests to chatbot-gateway service
router.post('/message', async (req, res) => {
  try {
    const response = await axios.post(CHATBOT_GATEWAY_URL + '/chat/message', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.post('/voice', async (req, res) => {
  try {
    const response = await axios.post(CHATBOT_GATEWAY_URL + '/chat/voice', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.get('/history/:userId', async (req, res) => {
  try {
    const response = await axios.get(CHATBOT_GATEWAY_URL + '/chat/history/' + req.params.userId);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.post('/feedback', async (req, res) => {
  try {
    const response = await axios.post(CHATBOT_GATEWAY_URL + '/chat/feedback', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

module.exports = router;
