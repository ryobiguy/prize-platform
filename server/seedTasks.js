const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Task = require('./models/Task');

// Sample tasks data
const tasks = [
  {
    title: 'Follow us on Twitter',
    description: 'Follow @TotalRaffle on Twitter to earn 5 entries',
    type: 'twitter_follow',
    platform: 'twitter',
    entriesReward: 5,
    verificationData: {
      accountToFollow: 'TotalRaffle'
    },
    isActive: true,
    isRepeatable: false,
    repeatInterval: 'none'
  },
  {
    title: 'Daily Login Bonus',
    description: 'Login every day to earn 2 free entries',
    type: 'daily_login',
    platform: 'internal',
    entriesReward: 2,
    verificationData: {},
    isActive: true,
    isRepeatable: true,
    repeatInterval: 'daily'
  },
  {
    title: 'Watch a Short Ad',
    description: 'Watch a 30-second advertisement to earn 3 entries',
    type: 'watch_ad',
    platform: 'internal',
    entriesReward: 3,
    verificationData: {
      adProvider: 'google',
      adDuration: 30
    },
    isActive: true,
    isRepeatable: true,
    repeatInterval: 'daily'
  },
  {
    title: 'Retweet Our Latest Post',
    description: 'Retweet our latest announcement to earn 5 entries',
    type: 'twitter_retweet',
    platform: 'twitter',
    entriesReward: 5,
    verificationData: {
      postUrl: 'https://twitter.com/TotalRaffle/status/123456789'
    },
    isActive: true,
    isRepeatable: false,
    repeatInterval: 'none'
  },
  {
    title: 'Like Our Tweet',
    description: 'Like our pinned tweet to earn 3 entries',
    type: 'twitter_like',
    platform: 'twitter',
    entriesReward: 3,
    verificationData: {
      postUrl: 'https://twitter.com/TotalRaffle/status/123456789'
    },
    isActive: true,
    isRepeatable: false,
    repeatInterval: 'none'
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

    // Clear existing tasks (optional - comment out if you want to keep existing data)
    // await Task.deleteMany({});
    // console.log('🗑️  Cleared existing tasks');

    // Insert tasks
    const createdTasks = await Task.insertMany(tasks);
    console.log(`✅ Created ${createdTasks.length} task(s):`);
    createdTasks.forEach(task => {
      console.log(`   - ${task.title} (+${task.entriesReward} entries)`);
    });

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
