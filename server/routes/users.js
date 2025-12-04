const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const TaskCompletion = require('../models/TaskCompletion');
const Prize = require('../models/Prize');
const emailService = require('../services/emailService');

// Get user dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('prizeEntries.prize', 'title imageUrl endDate')
      .populate('wins.prize', 'title type value imageUrl');

    const completedTasks = await TaskCompletion.find({ 
      user: req.userId,
      verified: true 
    }).populate('task', 'title entriesAwarded completedAt');

    const recentActivity = completedTasks
      .sort((a, b) => b.completedAt - a.completedAt)
      .slice(0, 10);

    // Most recent purchases (limit 10)
    const purchases = (user.purchases || [])
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10);

    res.json({
      user,
      stats: {
        totalEntries: user.totalEntries,
        availableEntries: user.availableEntries,
        activePrizes: user.prizeEntries.length,
        tasksCompleted: completedTasks.length,
        totalWins: user.wins.length
      },
      recentActivity,
      purchases
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's prize entries
router.get('/entries', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate({
        path: 'prizeEntries.prize',
        select: 'title description imageUrl endDate status totalEntries'
      });

    res.json({ entries: user.prizeEntries });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's wins
router.get('/wins', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate({
        path: 'wins.prize',
        select: 'title description type value imageUrl'
      });

    res.json({ wins: user.wins });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit prize claim request
router.post('/claim-prize', auth, async (req, res) => {
  try {
    const { winId, prizeTitle, message } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get user details
    const user = await User.findById(req.userId).select('username email');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send email notification to admin
    await emailService.sendPrizeClaimNotification(user, prizeTitle, message);

    res.json({ 
      success: true,
      message: 'Claim request received! We will contact you soon.' 
    });
  } catch (error) {
    console.error('Claim prize error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
