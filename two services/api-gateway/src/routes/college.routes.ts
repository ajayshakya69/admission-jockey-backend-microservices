import express from "express";
import axios from "axios";

const router = express.Router();

const COLLEGE_SERVICE_URL = process.env.COLLEGE_SERVICE_URL || 'http://localhost:4002';

// Forward college-related requests to college-service
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(COLLEGE_SERVICE_URL + '/colleges', { params: req.query });
    res.status(response.status).json(response.data);
  } catch (error:any) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.get('/:collegeId', async (req, res) => {
  try {
    const response = await axios.get(COLLEGE_SERVICE_URL + '/colleges/' + req.params.collegeId);
    res.status(response.status).json(response.data);
  } catch (error:any) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.get('/:collegeId/courses', async (req, res) => {
  try {
    const response = await axios.get(COLLEGE_SERVICE_URL + '/colleges/' + req.params.collegeId + '/courses');
    res.status(response.status).json(response.data);
  } catch (error:any) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

router.get('/:collegeId/reviews', async (req, res) => {
  try {
    const response = await axios.get(COLLEGE_SERVICE_URL + '/colleges/' + req.params.collegeId + '/reviews');
    res.status(response.status).json(response.data);
  } catch (error:any) {
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: 'Internal server error' });
  }
});

module.exports = router;
