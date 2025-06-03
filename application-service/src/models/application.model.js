const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  collegeId: { type: mongoose.Schema.Types.ObjectId, required: true },
  course: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  submissionDate: { type: Date, default: Date.now },
  documents: [{ type: String }],
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
