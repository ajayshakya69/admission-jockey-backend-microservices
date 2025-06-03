const Education = require('../models/education.model');

exports.addEducation = async (req, res) => {
  try {
    const education = new Education({
      userId: req.params.userId,
      ...req.body
    });
    await education.save();
    res.status(201).json(education);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
