const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  website: { type: String },
  establishedYear: { type: Number },
  coursesOffered: [{ type: String }],
  contactEmail: { type: String },
  contactPhone: { type: String },
  address: { type: String },
  logoUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('College', collegeSchema);
