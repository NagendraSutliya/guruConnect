const mongoose = require('mongoose');

const WebsiteCMSSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    unique: true, // e.g., 'hero', 'about', 'news'
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  isEnabled: {
    type: Boolean,
    default: true,
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  }
}, { timestamps: true });

module.exports = mongoose.model('WebsiteCMS', WebsiteCMSSchema);
