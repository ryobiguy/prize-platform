const mongoose = require('mongoose');
const Prize = require('../models/Prize');
require('dotenv').config();

const createDailyMysteryPrize = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if daily mystery prize already exists
    const existing = await Prize.findOne({ title: 'Daily Mystery Prize Pool' });
    if (existing) {
      console.log('Daily Mystery Prize already exists!');
      process.exit(0);
    }

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);

    const dailyMysteryPrize = new Prize({
      title: 'Daily Mystery Prize Pool',
      description: 'Win instant prizes! 30 winners daily! Includes Amazon, Just Eat, Starbucks, Steam, Netflix gift cards and cash prizes! 5% win chance - 1 in 20 plays wins!',
      type: 'giftcard',
      value: 10, // Average value
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
    console.log('✅ Daily Mystery Prize Pool created successfully!');
    console.log(`Prize ID: ${dailyMysteryPrize._id}`);
    console.log('Total prizes in pool: 30');
    console.log('Entry cost: 100 entries per play');
    console.log('Win chance: 5% (1 in 20 plays)');
    console.log('Expected plays to distribute all prizes: 600');
    console.log('Expected revenue: £600 | Prize cost: £400 | PROFIT: £200');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating daily mystery prize:', error);
    process.exit(1);
  }
};

createDailyMysteryPrize();
