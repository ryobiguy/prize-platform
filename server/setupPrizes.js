const mongoose = require('mongoose');
const Prize = require('./models/Prize');
require('dotenv').config();

const setupPrizes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing prizes
    await Prize.deleteMany({});
    console.log('🗑️  Cleared existing prizes');

    // Calculate dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(20, 0, 0, 0); // 8 PM draw time

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(20, 0, 0, 0);

    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setHours(20, 0, 0, 0);

    // Daily Prize - £5
    const dailyPrize = new Prize({
      title: '£5 Daily Cash Prize',
      description: 'Win £5 cash every day! Enter now for your chance to win.',
      type: 'cash',
      value: 5,
      imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800',
      entryCost: 5,
      maxEntriesPerUser: 50,
      totalWinners: 1,
      status: 'active',
      featured: true,
      startDate: today,
      endDate: tomorrow,
      drawDate: tomorrow
    });

    // Weekly Prize - £50
    const weeklyPrize = new Prize({
      title: '£50 Weekly Cash Prize',
      description: 'Win £50 every week! More entries = better chances.',
      type: 'cash',
      value: 50,
      imageUrl: 'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=800',
      entryCost: 10,
      maxEntriesPerUser: 200,
      totalWinners: 1,
      status: 'active',
      featured: true,
      startDate: today,
      endDate: nextWeek,
      drawDate: nextWeek
    });

    // Monthly Prize - PS5
    const monthlyPrize = new Prize({
      title: 'PlayStation 5 Console',
      description: 'Win a brand new PS5! The ultimate gaming console with stunning graphics and exclusive games.',
      type: 'physical',
      value: 479,
      imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800',
      entryCost: 25,
      maxEntriesPerUser: 500,
      totalWinners: 1,
      status: 'active',
      featured: true,
      startDate: today,
      endDate: nextMonth,
      drawDate: nextMonth
    });

    await dailyPrize.save();
    await weeklyPrize.save();
    await monthlyPrize.save();

    console.log('✅ Daily Prize created:', dailyPrize.title);
    console.log('✅ Weekly Prize created:', weeklyPrize.title);
    console.log('✅ Monthly Prize created:', monthlyPrize.title);

    // Now update instant win wheel configuration
    const InstantWin = require('./models/InstantWin');
    
    // Clear existing config
    await InstantWin.deleteMany({});

    const wheelConfig = new InstantWin({
      name: 'Daily Spin Wheel',
      type: 'wheel',
      active: true,
      prizes: [
        { name: '£1000 Cash', value: 1000, probability: 0.0005, type: 'cash' }, // 0.05%
        { name: '100 Entries', value: 100, probability: 0.01, type: 'entries' }, // 1%
        { name: '50 Entries', value: 50, probability: 0.05, type: 'entries' }, // 5%
        { name: '25 Entries', value: 25, probability: 0.1, type: 'entries' }, // 10%
        { name: '10 Entries', value: 10, probability: 0.2, type: 'entries' }, // 20%
        { name: '5 Entries', value: 5, probability: 0.3, type: 'entries' }, // 30%
        { name: 'Better Luck Next Time', value: 0, probability: 0.3395, type: 'nothing' } // 33.95%
      ],
      cooldownHours: 24,
      requiresEntries: false
    });

    await wheelConfig.save();
    console.log('✅ Spin Wheel configured with £1000 prize (0.05% odds)');

    console.log('\n🎉 All prizes and wheel configured successfully!');
    console.log('\n📊 Summary:');
    console.log('- Daily: £5 (5 entries to enter, max 50 entries)');
    console.log('- Weekly: £50 (10 entries to enter, max 200 entries)');
    console.log('- Monthly: PS5 (25 entries to enter, max 500 entries)');
    console.log('- Spin Wheel: £1000 grand prize (0.05% chance)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

setupPrizes();
