const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: false,
    minlength: 6
  },
  authProvider: {
    type: String,
    enum: ['local', 'google', 'apple'],
    default: 'local'
  },
  profilePicture: {
    type: String,
    default: ''
  },
  totalEntries: {
    type: Number,
    default: 0
  },
  availableEntries: {
    type: Number,
    default: 0
  },
  completedTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  completedOffers: [{
    offerId: String,
    entries: Number,
    completedAt: {
      type: Date,
      default: Date.now
    },
    ip: String
  }],
  prizeEntries: [{
    prize: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prize'
    },
    entriesUsed: {
      type: Number,
      default: 0
    },
    enteredAt: {
      type: Date,
      default: Date.now
    }
  }],
  wins: [{
    prize: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prize'
    },
    wonAt: {
      type: Date,
      default: Date.now
    },
    claimed: {
      type: Boolean,
      default: false
    }
  }],
  socialAccounts: {
    twitter: {
      username: String,
      verified: { type: Boolean, default: false }
    },
    instagram: {
      username: String,
      verified: { type: Boolean, default: false }
    },
    youtube: {
      username: String,
      verified: { type: Boolean, default: false }
    }
  },
  // Streak System
  streak: {
    current: {
      type: Number,
      default: 0
    },
    longest: {
      type: Number,
      default: 0
    },
    lastLoginDate: {
      type: Date,
      default: null
    }
  },
  // Achievements
  achievements: [{
    id: String,
    name: String,
    description: String,
    icon: String,
    unlockedAt: {
      type: Date,
      default: Date.now
    },
    reward: {
      type: Number,
      default: 0
    }
  }],
  // Stats for achievements
  stats: {
    adsWatched: {
      type: Number,
      default: 0
    },
    surveysCompleted: {
      type: Number,
      default: 0
    },
    referralsMade: {
      type: Number,
      default: 0
    },
    prizesWon: {
      type: Number,
      default: 0
    },
    totalEntriesEarned: {
      type: Number,
      default: 0
    },
    wheelSpins: {
      type: Number,
      default: 0
    },
    instantWins: {
      type: Number,
      default: 0
    },
    totalCashWon: {
      type: Number,
      default: 0
    }
  },
  // Cash balance from instant wins
  cashBalance: {
    type: Number,
    default: 0
  },
  lastWheelSpin: {
    type: Date,
    default: null
  },
  // Level System
  level: {
    type: Number,
    default: 1
  },
  experience: {
    type: Number,
    default: 0
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
