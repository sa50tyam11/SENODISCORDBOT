const mongoose = require('mongoose');

const warningSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  moderatorId: { type: String, required: true },
  reason: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Warning || mongoose.model('Warning', warningSchema);
