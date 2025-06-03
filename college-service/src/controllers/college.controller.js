const College = require('../models/college.model');

exports.getColleges = async (req, res) => {
  try {
    const colleges = await College.find();
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.collegeId);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }
    res.json(college);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCollege = async (req, res) => {
  try {
    const college = new College(req.body);
    await college.save();
    res.status(201).json(college);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndUpdate(req.params.collegeId, req.body, { new: true, runValidators: true });
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }
    res.json(college);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndDelete(req.params.collegeId);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }
    res.json({ message: 'College deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
