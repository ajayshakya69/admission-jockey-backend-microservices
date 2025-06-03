const Reminder = require('../models/reminder.model');

exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find();
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReminderById = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.reminderId);
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createReminder = async (req, res) => {
  try {
    const reminder = new Reminder(req.body);
    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(req.params.reminderId, req.body, { new: true, runValidators: true });
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    res.json(reminder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndDelete(req.params.reminderId);
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
