const Profile = require('../models/profile.model');
const Preferences = require('../models/preferences.model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads/avatars');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, req.params.userId + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId }).populate('preferences');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    let preferences = await Preferences.findOne({ userId: req.params.userId });
    if (preferences) {
      preferences.set(req.body);
      await preferences.save();
    } else {
      preferences = new Preferences({ userId: req.params.userId, ...req.body });
      await preferences.save();
    }
    res.json(preferences);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.uploadAvatar = [
  upload.single('avatar'),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ userId: req.params.userId });
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      profile.avatarUrl = `/uploads/avatars/${req.file.filename}`;
      await profile.save();
      res.json({ message: 'Avatar uploaded successfully', avatarUrl: profile.avatarUrl });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];
