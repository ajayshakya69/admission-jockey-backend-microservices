const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Profile' },
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  grade: { type: String },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Education', educationSchema);
