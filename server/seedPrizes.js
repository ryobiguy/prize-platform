const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Prize = require('./models/Prize');

// Sample prizes data
const prizes = [
  {
    title: '£500 Cash Prize',
    description: 'Win £500 in cash! Complete simple tasks to earn entries and increase your chances of winning this amazing cash prize. Winner will be contacted via email. Draw date: Friday, 17th October 2025.',
    type: 'cash',
    value: 500,
    currency: 'GBP',
    imageUrl: '',
    totalWinners: 1,
    entryCost: 1,
    maxEntriesPerUser: 100,
    startDate: new Date(),
    endDate: new Date('2025-10-17T23:59:59'), // Friday, 17th October 2025
    status: 'active',
    featured: true,
    totalEntries: 0,
    participants: [],
    winners: []
  }
];

// Connect to MongoDB and seed data
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prize-platform', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing prizes (optional - comment out if you want to keep existing data)
    // await Prize.deleteMany({});
    // console.log('🗑️  Cleared existing prizes');

    // Insert prizes
    const createdPrizes = await Prize.insertMany(prizes);
    console.log(`✅ Created ${createdPrizes.length} prize(s):`);
    createdPrizes.forEach(prize => {
      console.log(`   - ${prize.title} (£${prize.value})`);
    });

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
