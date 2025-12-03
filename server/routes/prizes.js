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

    // INSTANT WIN LOGIC
    if (prize.isInstantWin && prize.prizePool && prize.prizePool.length > 0) {
      // Check if there are prizes left
      const availablePrizes = prize.prizePool.filter(p => p.remaining > 0);
      
      if (availablePrizes.length === 0) {
        return res.status(400).json({ error: 'All prizes have been won!' });
      }

      // Calculate win probability (5% chance to win)
      const winChance = 0.05; // 5% chance (1 in 20)
      const didWin = Math.random() < winChance;

      // Deduct entries
      user.availableEntries -= entries;
      prize.totalEntries += entries;

      if (didWin) {
        // Select random prize from available pool
        const randomPrize = availablePrizes[Math.floor(Math.random() * availablePrizes.length)];
        
        // Decrease remaining count
        const poolPrize = prize.prizePool.find(p => p.name === randomPrize.name);
        poolPrize.remaining -= 1;

        // Add winner
        prize.winners.push({
          user: req.userId,
          prizeName: randomPrize.name,
          prizeValue: randomPrize.value,
          prizeType: randomPrize.type,
          drawnAt: new Date()
        });

        await prize.save();
        await user.save();

        return res.json({
          won: true,
          prize: {
            name: randomPrize.name,
            value: randomPrize.value,
            type: randomPrize.type
          },
          message: `🎉 Congratulations! You won ${randomPrize.name}!`,
          remainingEntries: user.availableEntries
        });
      } else {
        await prize.save();
        await user.save();

        return res.json({
          won: false,
          message: 'Not a winner this time. Try again!',
          remainingEntries: user.availableEntries
        });
      }
    }

    // REGULAR DRAW LOGIC (existing code)
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

// Admin: Create daily mystery prize (instant win)
router.post('/admin/create-daily-mystery', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Check if daily mystery prize already exists
    const existing = await Prize.findOne({ 
      title: 'Daily Mystery Prize Pool',
      status: 'active'
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Daily Mystery Prize already exists!' });
    }

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);

    const dailyMysteryPrize = new Prize({
      title: 'Daily Mystery Prize Pool',
      description: 'Win instant prizes! 30 winners daily! Includes Amazon, Just Eat, Starbucks, Steam, Netflix gift cards and cash prizes! 5% win chance - 1 in 20 plays wins!',
      type: 'giftcard',
      value: 10,
      currency: 'GBP',
      imageUrl: '/prizes/mystery-box.jpg',
      totalWinners: 30,
      entryCost: 100,
      maxEntriesPerUser: 10000,
      minimumEntries: 1,
      drawFrequency: 'instant',
      startDate: now,
      endDate: tomorrow,
      status: 'active',
      isInstantWin: true,
      featured: true,
      prizePool: [
        {
          name: '£10 Amazon Gift Card',
          type: 'giftcard',
          value: 10,
          quantity: 10,
          remaining: 10,
          imageUrl: '/prizes/amazon.png'
        },
        {
          name: '£15 Just Eat Voucher',
          type: 'giftcard',
          value: 15,
          quantity: 5,
          remaining: 5,
          imageUrl: '/prizes/justeat.png'
        },
        {
          name: '£10 Cash',
          type: 'cash',
          value: 10,
          quantity: 3,
          remaining: 3,
          imageUrl: '/prizes/cash.png'
        },
        {
          name: '£5 Starbucks Gift Card',
          type: 'giftcard',
          value: 5,
          quantity: 5,
          remaining: 5,
          imageUrl: '/prizes/starbucks.png'
        },
        {
          name: '£20 Steam Gift Card',
          type: 'giftcard',
          value: 20,
          quantity: 2,
          remaining: 2,
          imageUrl: '/prizes/steam.png'
        },
        {
          name: '£10 Netflix Gift Card',
          type: 'giftcard',
          value: 10,
          quantity: 5,
          remaining: 5,
          imageUrl: '/prizes/netflix.png'
        }
      ]
    });

    await dailyMysteryPrize.save();

    res.json({
      message: 'Daily Mystery Prize Pool created successfully!',
      prize: dailyMysteryPrize
    });
  } catch (error) {
    console.error('Create daily mystery error:', error);
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
