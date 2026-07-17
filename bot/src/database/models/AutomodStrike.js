
const mongoose = require('mongoose');

const automodStrikeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
  strikes: { type: Number, default: 0 },
  reasons: { type: [String], default: [] },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.AutomodStrike || mongoose.model('AutomodStrike', automodStrikeSchema);
