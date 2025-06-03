const mongoose = require('mongoose');

const preferencesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  preferredColleges: [{ type: String }],
  preferredCourses: [{ type: String }],
  notificationSettings: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('Preferences', preferencesSchema);
