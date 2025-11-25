const mongoose = require('mongoose');

const prizeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['physical', 'giftcard', 'cash'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'GBP'
  },
  imageUrl: {
    type: String,
    default: ''
  },
  totalWinners: {
    type: Number,
    default: 1
  },
  entryCost: {
    type: Number,
    default: 1,
    min: 1
  },
  maxEntriesPerUser: {
    type: Number,
    default: 100
  },
  minimumEntries: {
    type: Number,
    default: 50,
    min: 1
  },
  drawFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'weekly'
  },
  drawDay: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    default: 'Friday'
  },
  drawTime: {
    type: String,
    default: '20:00' // 8 PM default
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'ended', 'drawn', 'cancelled'],
    default: 'upcoming'
  },
  totalEntries: {
    type: Number,
    default: 0
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    entries: {
      type: Number,
      default: 0
    }
  }],
  winners: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    drawnAt: {
      type: Date,
      default: Date.now
    },
    notified: {
      type: Boolean,
      default: false
    }
  }],
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update status based on dates
prizeSchema.methods.updateStatus = function() {
  const now = new Date();
  if (now < this.startDate) {
    this.status = 'upcoming';
  } else if (now >= this.startDate && now < this.endDate) {
    this.status = 'active';
  } else if (now >= this.endDate && this.winners.length === 0) {
    this.status = 'ended';
  } else if (this.winners.length > 0) {
    this.status = 'drawn';
  }
  return this.status;
};

module.exports = mongoose.model('Prize', prizeSchema);
