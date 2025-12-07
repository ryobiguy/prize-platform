const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');

// Claim daily bonus
router.post('/claim', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user already claimed today
    const now = new Date();
    const lastBonus = user.lastDailyBonus ? new Date(user.lastDailyBonus) : null;
    
    if (lastBonus) {
      const hoursSinceLastBonus = (now - lastBonus) / (1000 * 60 * 60);
      if (hoursSinceLastBonus < 24) {
        const hoursRemaining = Math.ceil(24 - hoursSinceLastBonus);
        return res.status(400).json({ 
          error: 'Already claimed today',
          hoursRemaining,
          nextClaimTime: new Date(lastBonus.getTime() + 24 * 60 * 60 * 1000)
        });
      }
    }

    // Award bonus (20p cash)
    const bonusAmount = 0.20;
    user.cashBalance = (user.cashBalance || 0) + bonusAmount;
    user.lastDailyBonus = now;
    
    await user.save();

    res.json({
      success: true,
      bonusAmount,
      newBalance: user.cashBalance,
      nextClaimTime: new Date(now.getTime() + 24 * 60 * 60 * 1000)
    });
  } catch (error) {
    console.error('Daily bonus error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Check daily bonus status
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const now = new Date();
    const lastBonus = user.lastDailyBonus ? new Date(user.lastDailyBonus) : null;
    
    let canClaim = true;
    let hoursRemaining = 0;
    let nextClaimTime = now;

    if (lastBonus) {
      const hoursSinceLastBonus = (now - lastBonus) / (1000 * 60 * 60);
      if (hoursSinceLastBonus < 24) {
        canClaim = false;
        hoursRemaining = Math.ceil(24 - hoursSinceLastBonus);
        nextClaimTime = new Date(lastBonus.getTime() + 24 * 60 * 60 * 1000);
      }
    }

    res.json({
      canClaim,
      hoursRemaining,
      nextClaimTime,
      bonusAmount: 0.20
    });
  } catch (error) {
    console.error('Daily bonus status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
