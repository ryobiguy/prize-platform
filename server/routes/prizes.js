const express = require('express');
const router = express.Router();
const Prize = require('../models/Prize');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Get all active prizes
router.get('/', async (req, res) => {
  try {
    const prizes = await Prize.find({ status: { $in: ['active', 'upcoming'] } })
      .sort({ featured: -1, endDate: 1 });
    
    // Update statuses
    prizes.forEach(prize => prize.updateStatus());
    
    res.json({ prizes });
  } catch (error) {
    console.error('Get prizes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single prize
router.get('/:id', async (req, res) => {
  try {
    const prize = await Prize.findById(req.params.id)
      .populate('participants.user', 'username')
      .populate('winners.user', 'username');
    
    if (!prize) {
      return res.status(404).json({ error: 'Prize not found' });
    }

    prize.updateStatus();
    res.json({ prize });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Enter a prize draw
router.post('/:id/enter', auth, async (req, res) => {
  try {
    const { entries } = req.body;
    const prize = await Prize.findById(req.params.id);
    
    if (!prize) {
      return res.status(404).json({ error: 'Prize not found' });
    }

    prize.updateStatus();
    
    if (prize.status !== 'active') {
      return res.status(400).json({ error: 'Prize is not active' });
    }

    const user = await User.findById(req.userId);
    
    if (user.availableEntries < entries) {
      return res.status(400).json({ error: 'Insufficient entries' });
    }

    // Check if user already entered
    const existingEntry = prize.participants.find(p => p.user.toString() === req.userId.toString());
    
    if (existingEntry) {
      const totalEntries = existingEntry.entries + entries;
      if (totalEntries > prize.maxEntriesPerUser) {
        return res.status(400).json({ error: `Maximum ${prize.maxEntriesPerUser} entries per user` });
      }
      existingEntry.entries += entries;
    } else {
      if (entries > prize.maxEntriesPerUser) {
        return res.status(400).json({ error: `Maximum ${prize.maxEntriesPerUser} entries per user` });
      }
      prize.participants.push({ user: req.userId, entries });
    }

    prize.totalEntries += entries;
    await prize.save();

    // Update user entries
    user.availableEntries -= entries;
    user.prizeEntries.push({
      prize: prize._id,
      entriesUsed: entries
    });
    await user.save();

    res.json({ 
      message: 'Entries submitted successfully',
      prize,
      remainingEntries: user.availableEntries
    });
  } catch (error) {
    console.error('Enter prize error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get recent winners for live feed (public)
router.get('/recent-winners', async (req, res) => {
  try {
    const prizes = await Prize.find({ 'winners.0': { $exists: true } })
      .populate('winners.user', 'username')
      .select('title value winners')
      .sort({ 'winners.drawnAt': -1 })
      .limit(20);

    const recentWinners = [];
    prizes.forEach(prize => {
      prize.winners.forEach(winner => {
        recentWinners.push({
          username: winner.user.username,
          prizeTitle: prize.title,
          prizeValue: prize.value,
          wonAt: winner.drawnAt
        });
      });
    });

    // Sort by most recent and limit to 10
    recentWinners.sort((a, b) => new Date(b.wonAt) - new Date(a.wonAt));

    res.json({ winners: recentWinners.slice(0, 10) });
  } catch (error) {
    console.error('Get recent winners error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all winners (public)
router.get('/winners/all', async (req, res) => {
  try {
    const prizes = await Prize.find({ 'winners.0': { $exists: true } })
      .populate('winners.user', 'username createdAt')
      .select('title value type winners')
      .sort({ 'winners.drawnAt': -1 })
      .limit(50);

    const allWinners = [];
    prizes.forEach(prize => {
      prize.winners.forEach(winner => {
        // Anonymize username for privacy (show first letter + ***)
        const username = winner.user.username;
        const anonymizedName = username.charAt(0).toUpperCase() + username.slice(1, 3) + '***';
        
        allWinners.push({
          name: anonymizedName,
          prize: prize.title,
          prizeValue: prize.value,
          prizeType: prize.type,
          date: winner.drawnAt
        });
      });
    });

    // Sort by most recent
    allWinners.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ winners: allWinners.slice(0, 50) });
  } catch (error) {
    console.error('Get public winners error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
