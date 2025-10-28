const express = require('express');
const router = express.Router();
const Prize = require('../models/Prize');
const Task = require('../models/Task');
const User = require('../models/User');
const { adminAuth } = require('../middleware/auth');
const emailService = require('../services/emailService');
const prizeDrawScheduler = require('../services/prizeDrawScheduler');

// Create new prize
router.post('/prizes', adminAuth, async (req, res) => {
  try {
    const prize = new Prize(req.body);
    await prize.save();
    res.status(201).json({ message: 'Prize created', prize });
  } catch (error) {
    console.error('Create prize error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update prize
router.put('/prizes/:id', adminAuth, async (req, res) => {
  try {
    const prize = await Prize.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Prize updated', prize });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete prize
router.delete('/prizes/:id', adminAuth, async (req, res) => {
  try {
    await Prize.findByIdAndDelete(req.params.id);
    res.json({ message: 'Prize deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Draw winners for a prize
router.post('/prizes/:id/draw', adminAuth, async (req, res) => {
  try {
    const prize = await Prize.findById(req.params.id);
    const { forceOverride } = req.body; // Allow admin to override draw day check
    
    if (!prize) {
      return res.status(404).json({ error: 'Prize not found' });
    }

    if (prize.winners.length > 0) {
      return res.status(400).json({ error: 'Winners already drawn for this prize' });
    }

    if (prize.status !== 'ended' && prize.status !== 'active') {
      return res.status(400).json({ error: 'Prize must be ended or active before drawing' });
    }

    // Check minimum entries requirement
    if (prize.totalEntries < prize.minimumEntries) {
      return res.status(400).json({ 
        error: `Minimum ${prize.minimumEntries} entries required. Currently has ${prize.totalEntries} entries.`,
        minimumRequired: prize.minimumEntries,
        currentEntries: prize.totalEntries
      });
    }

    // Check if today is the designated draw day (unless admin forces override)
    if (!forceOverride) {
      const now = new Date();
      const currentDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
      const prizeDrawDay = prize.drawDay || 'Friday';
      
      if (currentDay !== prizeDrawDay) {
        return res.status(400).json({ 
          error: `This prize is scheduled to be drawn on ${prizeDrawDay}. Today is ${currentDay}.`,
          drawDay: prizeDrawDay,
          currentDay: currentDay,
          message: 'The draw will happen automatically on the scheduled day, or you can force it now by confirming.'
        });
      }
    }

    // Create weighted array of user IDs based on entries
    const entries = [];
    prize.participants.forEach(participant => {
      for (let i = 0; i < participant.entries; i++) {
        entries.push(participant.user.toString());
      }
    });

    if (entries.length === 0) {
      return res.status(400).json({ error: 'No entries for this prize' });
    }

    // Draw winners (prevent duplicate winners)
    const winners = [];
    const selectedUserIds = new Set();
    const availableEntries = [...entries];

    for (let i = 0; i < prize.totalWinners && availableEntries.length > 0; i++) {
      let winnerId;
      let attempts = 0;
      const maxAttempts = 100;

      // Keep drawing until we get a unique winner or run out of attempts
      do {
        const randomIndex = Math.floor(Math.random() * availableEntries.length);
        winnerId = availableEntries[randomIndex];
        attempts++;
      } while (selectedUserIds.has(winnerId) && attempts < maxAttempts);

      // If we found a unique winner
      if (!selectedUserIds.has(winnerId)) {
        selectedUserIds.add(winnerId);
        
        winners.push({
          user: winnerId,
          drawnAt: new Date(),
          notified: false
        });

        // Update user's wins
        await User.findByIdAndUpdate(winnerId, {
          $push: {
            wins: {
              prize: prize._id,
              wonAt: new Date(),
              claimed: false
            }
          }
        });

        // Remove all entries from this user to prevent duplicate wins
        availableEntries.splice(0, availableEntries.length, 
          ...availableEntries.filter(id => id !== winnerId)
        );
      }
    }

    if (winners.length === 0) {
      return res.status(400).json({ error: 'Could not draw any winners' });
    }

    prize.winners = winners;
    prize.status = 'drawn';
    await prize.save();

    const populatedPrize = await Prize.findById(prize._id)
      .populate('winners.user', 'username email')
      .populate('participants.user', 'username');

    // Send email notifications to winners
    for (const winner of populatedPrize.winners) {
      try {
        await emailService.sendWinnerNotification(winner.user, prize);
        winner.notified = true;
        console.log(`📧 Notified winner: ${winner.user.username}`);
      } catch (error) {
        console.error(`❌ Failed to notify ${winner.user.username}:`, error);
      }
    }
    
    await populatedPrize.save();

    res.json({ 
      message: `Successfully drew ${winners.length} winner(s)`,
      prize: populatedPrize,
      winners: winners.length
    });
  } catch (error) {
    console.error('Draw winners error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new task
router.post('/tasks', adminAuth, async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json({ message: 'Task created', task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update task
router.put('/tasks/:id', adminAuth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Task updated', task });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete task
router.delete('/tasks/:id', adminAuth, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get admin stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPrizes = await Prize.countDocuments();
    const activePrizes = await Prize.countDocuments({ status: 'active' });
    const totalTasks = await Task.countDocuments();
    const drawnPrizes = await Prize.countDocuments({ status: 'drawn' });

    // Calculate total prize value given away
    const prizesWithWinners = await Prize.find({ 'winners.0': { $exists: true } });
    const totalPrizeValue = prizesWithWinners.reduce((sum, prize) => sum + (prize.value * prize.winners.length), 0);

    res.json({
      stats: {
        totalUsers,
        totalPrizes,
        activePrizes,
        totalTasks,
        drawnPrizes,
        totalPrizeValue
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all winners across all prizes
router.get('/winners', adminAuth, async (req, res) => {
  try {
    const prizes = await Prize.find({ 'winners.0': { $exists: true } })
      .populate('winners.user', 'username email createdAt')
      .sort({ 'winners.drawnAt': -1 });

    const allWinners = [];
    prizes.forEach(prize => {
      prize.winners.forEach(winner => {
        allWinners.push({
          _id: winner._id,
          user: winner.user,
          prize: {
            _id: prize._id,
            title: prize.title,
            value: prize.value,
            type: prize.type
          },
          drawnAt: winner.drawnAt,
          notified: winner.notified
        });
      });
    });

    // Sort by most recent
    allWinners.sort((a, b) => new Date(b.drawnAt) - new Date(a.drawnAt));

    res.json({ winners: allWinners });
  } catch (error) {
    console.error('Get winners error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark winner as notified
router.put('/winners/:prizeId/:winnerId/notify', adminAuth, async (req, res) => {
  try {
    const prize = await Prize.findById(req.params.prizeId);
    
    if (!prize) {
      return res.status(404).json({ error: 'Prize not found' });
    }

    const winner = prize.winners.find(w => w.user.toString() === req.params.winnerId);
    
    if (!winner) {
      return res.status(404).json({ error: 'Winner not found' });
    }

    winner.notified = true;
    await prize.save();

    res.json({ message: 'Winner marked as notified', winner });
  } catch (error) {
    console.error('Notify winner error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get prizes ready for drawing
router.get('/prizes/ready-to-draw', adminAuth, async (req, res) => {
  try {
    const now = new Date();
    const prizes = await Prize.find({
      endDate: { $lte: now },
      'winners.0': { $exists: false },
      'participants.0': { $exists: true }
    })
    .populate('participants.user', 'username')
    .sort({ endDate: -1 });

    res.json({ prizes });
  } catch (error) {
    console.error('Get ready prizes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Test email service
router.post('/test-email', adminAuth, async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email address required' });
    }

    const result = await emailService.sendTestEmail(email);
    
    if (result.success) {
      res.json({ message: 'Test email sent successfully', messageId: result.messageId });
    } else {
      res.status(500).json({ error: 'Failed to send test email', details: result.error });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Manually trigger prize draw scheduler check
router.post('/trigger-draw-check', adminAuth, async (req, res) => {
  try {
    // This will check all prizes and draw winners for those that are ready
    await prizeDrawScheduler.checkAndDrawPrizes();
    res.json({ message: 'Prize draw check triggered successfully' });
  } catch (error) {
    console.error('Trigger draw check error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
