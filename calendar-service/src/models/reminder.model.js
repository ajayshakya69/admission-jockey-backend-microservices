const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  remindAt: { type: Date, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  isCompleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);
