const express = require('express');
const router = express.Router();
const axios = require('axios');

const CALENDAR_SERVICE_URL = process.env.CALENDAR_SERVICE_URL || 'http://localhost:4006';

// Forward calendar and reminder related requests to calendar-service
router.get('/events', async (req, res) => {
  try {
    const response = await axios.get(CALENDAR_SERVICE_URL + '/calendar/events', { params: req.query });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.post('/events', async (req, res) => {
  try {
    const response = await axios.post(CALENDAR_SERVICE_URL + '/calendar/events', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.put('/events/:id', async (req, res) => {
  try {
    const response = await axios.put(CALENDAR_SERVICE_URL + '/calendar/events/' + req.params.id, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.delete('/events/:id', async (req, res) => {
  try {
    const response = await axios.delete(CALENDAR_SERVICE_URL + '/calendar/events/' + req.params.id);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.post('/reminders', async (req, res) => {
  try {
    const response = await axios.post(CALENDAR_SERVICE_URL + '/reminders', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.get('/reminders', async (req, res) => {
  try {
    const response = await axios.get(CALENDAR_SERVICE_URL + '/reminders', { params: req.query });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.put('/reminders/:id', async (req, res) => {
  try {
    const response = await axios.put(CALENDAR_SERVICE_URL + '/reminders/' + req.params.id, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.delete('/reminders/:id', async (req, res) => {
  try {
    const response = await axios.delete(CALENDAR_SERVICE_URL + '/reminders/' + req.params.id);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

module.exports = router;
