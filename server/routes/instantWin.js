const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { spinWheel, awardPrize, canSpin, getWheelStats } = require('../utils/instantWin');
const { checkAchievements } = require('../utils/achievements');

// Get wheel configuration (public)
router.get('/config', (req, res) => {
  try {
    const stats = getWheelStats();
    res.json(stats);
  } catch (error) {
    console.error('Get wheel config error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Check if user can spin
router.get('/can-spin', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const canSpinNow = canSpin(user);
    const lastSpinTime = user.lastWheelSpin;
    
    res.json({
      canSpin: canSpinNow,
      lastSpinTime,
      totalSpins: user.stats.wheelSpins || 0,
      instantWins: user.stats.instantWins || 0,
      totalCashWon: user.stats.totalCashWon || 0
    });
  } catch (error) {
    console.error('Check can spin error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Spin the wheel
router.post('/spin', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if user can spin
    if (!canSpin(user)) {
      return res.status(400).json({ 
        error: 'You must wait before spinning again',
        canSpin: false
      });
    }
    
    // Spin the wheel
    const prize = spinWheel();
    
    // Award the prize
    const result = await awardPrize(user, prize);
    
    // Update last spin time
    user.lastWheelSpin = new Date();
    await user.save();
    
    // Check for new achievements
    const newAchievements = await checkAchievements(user);
    
    res.json({
      success: true,
      prize: result.prize,
      newBalance: result.newBalance,
      newAchievements: newAchievements.map(a => ({
        name: a.name,
        description: a.description,
        icon: a.icon,
        reward: a.reward
      })),
      totalSpins: user.stats.wheelSpins,
      instantWins: user.stats.instantWins || 0
    });
  } catch (error) {
    console.error('Spin wheel error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's wheel history
router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      totalSpins: user.stats.wheelSpins || 0,
      instantWins: user.stats.instantWins || 0,
      totalCashWon: user.stats.totalCashWon || 0,
      currentBalance: user.cashBalance || 0,
      lastSpinTime: user.lastWheelSpin
    });
  } catch (error) {
    console.error('Get wheel history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Request cash withdrawal (admin will process)
router.post('/withdraw', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (amount < 5) {
      return res.status(400).json({ error: 'Minimum withdrawal is £5' });
    }
    
    if (amount > user.cashBalance) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    
    // Create withdrawal request (would be processed by admin)
    // For now, just return success message
    res.json({
      success: true,
      message: 'Withdrawal request submitted. You will receive payment within 3-5 business days.',
      amount,
      remainingBalance: user.cashBalance
    });
  } catch (error) {
    console.error('Withdraw error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
