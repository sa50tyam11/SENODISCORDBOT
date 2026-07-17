const mongoose = require('mongoose');

const focusModeSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true }
});

module.exports = mongoose.models.FocusMode || mongoose.model('FocusMode', focusModeSchema);
