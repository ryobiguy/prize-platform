const mongoose = require('mongoose');

const instantWinSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['wheel', 'scratch', 'slot'],
    default: 'wheel'
  },
  active: {
    type: Boolean,
    default: true
  },
  prizes: [{
    name: String,
    value: Number,
    probability: Number, // 0.0 to 1.0
    type: {
      type: String,
      enum: ['cash', 'entries', 'physical', 'nothing'],
      default: 'entries'
    }
  }],
  cooldownHours: {
    type: Number,
    default: 24
  },
  requiresEntries: {
    type: Boolean,
    default: false
  },
  entryCost: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('InstantWin', instantWinSchema);
