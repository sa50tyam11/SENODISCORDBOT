const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  link: { type: String, required: true },
  notes: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Idea || mongoose.model('Idea', ideaSchema);
