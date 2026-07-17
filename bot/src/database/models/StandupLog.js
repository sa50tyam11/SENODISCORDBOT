const mongoose = require('mongoose');

const standupLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  yesterday: { type: String, default: '' },
  today: { type: String, default: '' },
  blockers: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.StandupLog || mongoose.model('StandupLog', standupLogSchema);
