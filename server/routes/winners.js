const express = require('express');
const router = express.Router();
const Prize = require('../models/Prize');

// Get recent winners for live feed
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Get all prizes with winners
    const prizes = await Prize.find({ 
      'winners.0': { $exists: true } 
    })
      .populate('winners.user', 'username')
      .sort({ 'winners.drawnAt': -1 })
      .limit(50);

    // Flatten and sort all winners
    const allWinners = [];
    prizes.forEach(prize => {
      prize.winners.forEach(winner => {
        allWinners.push({
          username: winner.user?.username || 'Anonymous',
          prizeName: winner.prizeName || prize.title,
          prizeValue: winner.prizeValue || prize.value,
          wonAt: winner.drawnAt,
          prizeId: prize._id
        });
      });
    });

    // Sort by date and limit
    const recentWinners = allWinners
      .sort((a, b) => new Date(b.wonAt) - new Date(a.wonAt))
      .slice(0, limit);

    res.json({ winners: recentWinners });
  } catch (error) {
    console.error('Recent winners error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
