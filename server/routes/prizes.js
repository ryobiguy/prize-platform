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
    
    // Calculate entries in last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentEntries = prize.participants.filter(p => 
      p.enteredAt && new Date(p.enteredAt) > oneHourAgo
    ).length;
    
    res.json({ prize, recentEntries });
  } catch (error) {
    console.error('Get prize error:', error);
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

      // Calculate number of plays (each play costs entryCost entries)
      const numberOfPlays = Math.floor(entries / prize.entryCost);
      
      if (numberOfPlays === 0) {
        return res.status(400).json({ error: `Minimum ${prize.entryCost} entries required to play` });
      }

      // Deduct entries
      const totalEntriesUsed = numberOfPlays * prize.entryCost;
      user.availableEntries -= totalEntriesUsed;
      prize.totalEntries += totalEntriesUsed;

      // Play multiple times
      const winChance = 0.05; // 5% chance (1 in 20)
      let wonPrizes = [];

      for (let i = 0; i < numberOfPlays; i++) {
        // Check if prizes still available
        const currentAvailable = prize.prizePool.filter(p => p.remaining > 0);
        if (currentAvailable.length === 0) break;

        const didWin = Math.random() < winChance;

        if (didWin) {
          // Weighted prize selection - lower value prizes are more common
          const weightedPrizes = [];
          currentAvailable.forEach(p => {
            // Weight inversely proportional to value
            // £5-10 prizes get weight 10, £15-20 get weight 5, £25+ get weight 2, £60+ get weight 1
            let weight = 10;
            if (p.value >= 60) weight = 1;
            else if (p.value >= 25) weight = 2;
            else if (p.value >= 15) weight = 5;
            
            for (let w = 0; w < weight; w++) {
              weightedPrizes.push(p);
            }
          });
          
          // Select random prize from weighted pool
          const randomPrize = weightedPrizes[Math.floor(Math.random() * weightedPrizes.length)];
          
          // Decrease remaining count
          const poolPrize = prize.prizePool.find(p => p.name === randomPrize.name);
          poolPrize.remaining -= 1;

          // Add winner to prize
          prize.winners.push({
            user: req.userId,
            prizeName: randomPrize.name,
            prizeValue: randomPrize.value,
            prizeType: randomPrize.type,
            drawnAt: new Date()
          });

          // Add win to user's wins array with specific prize details
          user.wins.push({
            prize: prize._id,
            prizeName: randomPrize.name,
            prizeValue: randomPrize.value,
            prizeType: randomPrize.type,
            wonAt: new Date(),
            claimed: false
          });
          
          console.log(`✅ Added win to user ${req.userId}: ${randomPrize.name} (£${randomPrize.value})`);

          wonPrizes.push(randomPrize.name);
        }
      }

      await prize.save();
      await user.save();

      if (wonPrizes.length > 0) {
        const prizeList = wonPrizes.join(', ');
        return res.json({
          won: true,
          prizes: wonPrizes,
          message: `🎉 Congratulations! You won ${wonPrizes.length} prize${wonPrizes.length > 1 ? 's' : ''}: ${prizeList}!`,
          plays: numberOfPlays,
          remainingEntries: user.availableEntries
        });
      } else {
        return res.json({
          won: false,
          message: `No wins this time. You played ${numberOfPlays} times. Try again!`,
          plays: numberOfPlays,
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
      description: 'Win instant prizes! 31 winners daily! Includes Amazon, Just Eat, Uber Eats, Steam, Netflix gift cards, cash prizes, and Sony headphones! 5% win chance - 1 in 20 plays wins!',
      type: 'giftcard',
      value: 10,
      currency: 'GBP',
      imageUrl: '/prizes/mystery-prize.png',
      totalWinners: 31,
      entryCost: 10,
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
          name: '£10 Uber Eats Voucher',
          type: 'giftcard',
          value: 10,
          quantity: 5,
          remaining: 5,
          imageUrl: '/prizes/ubereats.png'
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
          name: '£25 Netflix Gift Card',
          type: 'giftcard',
          value: 25,
          quantity: 5,
          remaining: 5,
          imageUrl: '/prizes/netflix.png'
        },
        {
          name: 'Sony WH-CH720N Over-Ear NC Wireless Headphones',
          type: 'physical',
          value: 69.99,
          quantity: 1,
          remaining: 1,
          imageUrl: '/prizes/sony-headphones.png'
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
    console.error('Error details:', error.message);
    res.status(500).json({ 
      error: 'Server error', 
      details: error.message 
    });
  }
});

// Admin: Delete daily mystery prize
router.delete('/admin/delete-daily-mystery', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const result = await Prize.deleteOne({ 
      title: 'Daily Mystery Prize Pool'
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Daily Mystery Prize not found' });
    }

    res.json({
      message: 'Daily Mystery Prize deleted successfully!'
    });
  } catch (error) {
    console.error('Delete daily mystery error:', error);
    res.status(500).json({ 
      error: 'Server error', 
      details: error.message 
    });
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
          prize: winner.prizeName || prize.title,
          prizeValue: winner.prizeValue || prize.value,
          prizeType: winner.prizeType || prize.type,
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
