const cron = require('node-cron');
const Prize = require('../models/Prize');
const User = require('../models/User');
const emailService = require('./emailService');

class PrizeDrawScheduler {
  constructor() {
    this.jobs = [];
  }

  // Start the automated prize draw scheduler
  start() {
    console.log('🎯 Prize Draw Scheduler started');

    // Run every hour to check for prizes ready to draw
    const hourlyJob = cron.schedule('0 * * * *', async () => {
      console.log('⏰ Running hourly prize draw check...');
      await this.checkAndDrawPrizes();
    });

    // Also run daily at midnight for cleanup
    const dailyJob = cron.schedule('0 0 * * *', async () => {
      console.log('🌙 Running daily prize status update...');
      await this.updatePrizeStatuses();
    });

    this.jobs.push(hourlyJob, dailyJob);

    // Run initial check on startup
    setTimeout(() => {
      this.checkAndDrawPrizes();
      this.updatePrizeStatuses();
    }, 5000); // Wait 5 seconds after server start
  }

  // Stop all scheduled jobs
  stop() {
    this.jobs.forEach(job => job.stop());
    console.log('🛑 Prize Draw Scheduler stopped');
  }

  // Update prize statuses based on dates
  async updatePrizeStatuses() {
    try {
      const prizes = await Prize.find({
        status: { $in: ['upcoming', 'active', 'ended'] }
      });

      let updated = 0;
      for (const prize of prizes) {
        const oldStatus = prize.status;
        prize.updateStatus();
        
        if (oldStatus !== prize.status) {
          await prize.save();
          updated++;
          console.log(`📊 Prize "${prize.title}" status: ${oldStatus} → ${prize.status}`);
        }
      }

      if (updated > 0) {
        console.log(`✅ Updated ${updated} prize status(es)`);
      }
    } catch (error) {
      console.error('❌ Error updating prize statuses:', error);
    }
  }

  // Check for prizes ready to draw and automatically draw winners
  async checkAndDrawPrizes() {
    try {
      const now = new Date();
      const currentDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
      
      // Find prizes that:
      // 1. Have ended
      // 2. Don't have winners yet
      // 3. Have participants
      // 4. Meet minimum entry requirements
      const readyPrizes = await Prize.find({
        endDate: { $lte: now },
        'winners.0': { $exists: false },
        'participants.0': { $exists: true },
        status: { $in: ['active', 'ended'] }
      }).populate('participants.user', 'username email');

      if (readyPrizes.length === 0) {
        console.log('✓ No prizes ready for drawing');
        return;
      }

      console.log(`🎲 Found ${readyPrizes.length} prize(s) ended. Current day: ${currentDay}`);

      for (const prize of readyPrizes) {
        // Check minimum entries
        if (prize.totalEntries < prize.minimumEntries) {
          console.log(`⚠️  Prize "${prize.title}" doesn't meet minimum entries (${prize.totalEntries}/${prize.minimumEntries})`);
          continue;
        }

        // Check if today is the designated draw day
        const prizeDrawDay = prize.drawDay || 'Friday';
        if (currentDay !== prizeDrawDay) {
          console.log(`⏳ Prize "${prize.title}" waiting for ${prizeDrawDay} (today is ${currentDay})`);
          continue;
        }

        console.log(`🎯 Drawing winners for: ${prize.title} (Draw Day: ${prizeDrawDay})`);
        
        try {
          const result = await this.drawWinners(prize);
          
          if (result.success) {
            console.log(`✅ Successfully drew ${result.winners.length} winner(s) for "${prize.title}"`);
            
            // Send notifications to winners
            await this.notifyWinners(prize, result.winners);
          } else {
            console.error(`❌ Failed to draw winners for "${prize.title}":`, result.error);
          }
        } catch (error) {
          console.error(`❌ Error drawing prize "${prize.title}":`, error);
        }
      }
    } catch (error) {
      console.error('❌ Error checking ready prizes:', error);
    }
  }

  // Draw winners for a specific prize
  async drawWinners(prize) {
    try {
      // Create weighted array of user IDs based on entries
      const entries = [];
      prize.participants.forEach(participant => {
        for (let i = 0; i < participant.entries; i++) {
          entries.push(participant.user._id.toString());
        }
      });

      if (entries.length === 0) {
        return { success: false, error: 'No entries for this prize' };
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
          
          const winnerData = {
            user: winnerId,
            drawnAt: new Date(),
            notified: false
          };
          
          winners.push(winnerData);

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
        return { success: false, error: 'Could not draw any winners' };
      }

      // Save winners to prize
      prize.winners = winners;
      prize.status = 'drawn';
      await prize.save();

      return { success: true, winners };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Send email notifications to all winners
  async notifyWinners(prize, winners) {
    try {
      const populatedPrize = await Prize.findById(prize._id)
        .populate('winners.user', 'username email');

      for (const winner of populatedPrize.winners) {
        try {
          await emailService.sendWinnerNotification(winner.user, prize);
          
          // Mark as notified
          winner.notified = true;
          console.log(`📧 Notified winner: ${winner.user.username}`);
        } catch (error) {
          console.error(`❌ Failed to notify ${winner.user.username}:`, error);
        }
      }

      await populatedPrize.save();

      // Send admin notification if admin email is configured
      if (process.env.ADMIN_EMAIL) {
        await emailService.sendPrizeDrawNotification(
          process.env.ADMIN_EMAIL,
          prize,
          populatedPrize.winners
        );
      }

      console.log(`✅ All winner notifications sent for "${prize.title}"`);
    } catch (error) {
      console.error('❌ Error notifying winners:', error);
    }
  }

  // Manual trigger for testing
  async manualDraw(prizeId) {
    try {
      const prize = await Prize.findById(prizeId)
        .populate('participants.user', 'username email');

      if (!prize) {
        return { success: false, error: 'Prize not found' };
      }

      if (prize.winners.length > 0) {
        return { success: false, error: 'Winners already drawn' };
      }

      const result = await this.drawWinners(prize);
      
      if (result.success) {
        await this.notifyWinners(prize, result.winners);
      }

      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new PrizeDrawScheduler();
