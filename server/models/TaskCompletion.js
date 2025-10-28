const mongoose = require('mongoose');

const taskCompletionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationMethod: {
    type: String,
    enum: ['automatic', 'manual', 'pending'],
    default: 'pending'
  },
  verificationData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  entriesAwarded: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  verifiedAt: {
    type: Date
  }
});

// Compound index to prevent duplicate completions (for non-repeatable tasks)
taskCompletionSchema.index({ user: 1, task: 1 });

module.exports = mongoose.model('TaskCompletion', taskCompletionSchema);
