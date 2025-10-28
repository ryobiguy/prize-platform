const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const TaskCompletion = require('../models/TaskCompletion');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { verifyTwitterFollow, verifyTwitterRetweet, verifyTwitterLike } = require('../services/twitterService');

// Get all available tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ isActive: true });
    
    // Get user's completed tasks
    const completedTasks = await TaskCompletion.find({ 
      user: req.userId,
      verified: true 
    }).select('task');
    
    const completedTaskIds = completedTasks.map(tc => tc.task.toString());
    
    // Mark completed tasks
    const tasksWithStatus = tasks.map(task => ({
      ...task.toObject(),
      completed: completedTaskIds.includes(task._id.toString()),
      canComplete: task.isRepeatable || !completedTaskIds.includes(task._id.toString())
    }));

    res.json({ tasks: tasksWithStatus });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Complete a task
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task || !task.isActive) {
      return res.status(404).json({ error: 'Task not found or inactive' });
    }

    // Check if task already completed (for non-repeatable tasks)
    if (!task.isRepeatable) {
      const existingCompletion = await TaskCompletion.findOne({
        user: req.userId,
        task: task._id,
        verified: true
      });

      if (existingCompletion) {
        return res.status(400).json({ error: 'Task already completed' });
      }
    }

    // Verify task based on type
    let verified = false;
    let verificationData = {};

    switch (task.type) {
      case 'twitter_follow':
        verified = await verifyTwitterFollow(req.user, task.verificationData.accountToFollow);
        break;
      case 'twitter_retweet':
        verified = await verifyTwitterRetweet(req.user, task.verificationData.postUrl);
        break;
      case 'twitter_like':
        verified = await verifyTwitterLike(req.user, task.verificationData.postUrl);
        break;
      case 'watch_ad':
        // Ad verification would be handled by ad provider callback
        verified = req.body.adCompleted === true;
        verificationData = { adId: req.body.adId, timestamp: new Date() };
        break;
      case 'daily_login':
        // Check if already logged in today
        const today = new Date().setHours(0, 0, 0, 0);
        const lastLogin = await TaskCompletion.findOne({
          user: req.userId,
          task: task._id,
          completedAt: { $gte: today }
        });
        verified = !lastLogin;
        break;
      default:
        verified = false;
    }

    if (!verified) {
      return res.status(400).json({ error: 'Task verification failed' });
    }

    // Create task completion
    const completion = new TaskCompletion({
      user: req.userId,
      task: task._id,
      verified: true,
      verificationMethod: 'automatic',
      verificationData,
      entriesAwarded: task.entriesReward,
      verifiedAt: new Date()
    });

    await completion.save();

    // Update user entries
    const user = await User.findById(req.userId);
    user.totalEntries += task.entriesReward;
    user.availableEntries += task.entriesReward;
    user.completedTasks.push(task._id);
    await user.save();

    // Update task completion count
    task.completionCount += 1;
    await task.save();

    res.json({
      message: 'Task completed successfully',
      entriesEarned: task.entriesReward,
      totalEntries: user.totalEntries,
      availableEntries: user.availableEntries
    });
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
