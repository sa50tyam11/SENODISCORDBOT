const mongoose = require('mongoose');

const clientLogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  source: {
    type: String, // e.g., 'Cold Call', 'Insta DM'
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'interested'],
    default: 'pending',
  },
  loggedBy: {
    type: String,
    required: true,
  },
  loggedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ClientLog', clientLogSchema);
