const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { updateStreak, getStreakInfo } = require('../utils/streaks');
const { checkAchievements, addExperience, experienceForNextLevel } = require('../utils/achievements');

// Get user's gamification stats
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const streakInfo = getStreakInfo(user);
    const expForNext = experienceForNextLevel(user.level);
    
    res.json({
      streak: streakInfo,
      level: user.level,
      experience: user.experience,
      experienceForNext: expForNext,
      achievements: user.achievements,
      stats: user.stats
    });
  } catch (error) {
    console.error('Get gamification stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update daily streak (called on login)
router.post('/streak/update', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const streakResult = await updateStreak(user);
    
    // Check for new achievements
    const newAchievements = await checkAchievements(user);
    
    res.json({
      streak: streakResult,
      newAchievements: newAchievements.map(a => ({
        name: a.name,
        description: a.description,
        icon: a.icon,
        reward: a.reward
      }))
    });
  } catch (error) {
    console.error('Update streak error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { period = 'weekly' } = req.query;
    
    let dateFilter = {};
    if (period === 'weekly') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { createdAt: { $gte: weekAgo } };
    } else if (period === 'monthly') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { createdAt: { $gte: monthAgo } };
    }
    
    // Get top users by total entries earned
    const topUsers = await User.find(dateFilter)
      .select('username level stats.totalEntriesEarned streak.current achievements')
      .sort({ 'stats.totalEntriesEarned': -1 })
      .limit(100);
    
    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      level: user.level,
      totalEntries: user.stats.totalEntriesEarned,
      streak: user.streak.current,
      achievementCount: user.achievements.length
    }));
    
    res.json({ leaderboard, period });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's leaderboard position
router.get('/leaderboard/position', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Count users with more entries
    const usersAbove = await User.countDocuments({
      'stats.totalEntriesEarned': { $gt: user.stats.totalEntriesEarned }
    });
    
    const position = usersAbove + 1;
    
    res.json({
      position,
      totalEntries: user.stats.totalEntriesEarned,
      username: user.username,
      level: user.level
    });
  } catch (error) {
    console.error('Get leaderboard position error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Manually trigger achievement check (for testing)
router.post('/achievements/check', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const newAchievements = await checkAchievements(user);
    
    res.json({
      newAchievements: newAchievements.map(a => ({
        name: a.name,
        description: a.description,
        icon: a.icon,
        reward: a.reward
      })),
      totalAchievements: user.achievements.length
    });
  } catch (error) {
    console.error('Check achievements error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
