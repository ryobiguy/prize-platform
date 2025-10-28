const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Prize = require('./models/Prize');

// Calculate dates for draws
const getNextFriday = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7; // Next Friday
  const nextFriday = new Date(today);
  nextFriday.setDate(today.getDate() + daysUntilFriday);
  nextFriday.setHours(23, 59, 59, 999);
  return nextFriday;
};

const getNextSaturday = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7; // Next Saturday
  const nextSaturday = new Date(today);
  nextSaturday.setDate(today.getDate() + daysUntilSaturday);
  nextSaturday.setHours(23, 59, 59, 999);
  return nextSaturday;
};

const getNextSunday = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilSunday = (7 - dayOfWeek) % 7 || 7; // Next Sunday
  const nextSunday = new Date(today);
  nextSunday.setDate(today.getDate() + daysUntilSunday);
  nextSunday.setHours(23, 59, 59, 999);
  return nextSunday;
};

// Gaming console prizes
const gamingPrizes = [
  {
    title: 'PlayStation 5 Console',
    description: 'Win a brand new PlayStation 5 console! Experience next-gen gaming with stunning graphics, ultra-fast loading, and the innovative DualSense controller. Includes the disc version with 825GB SSD storage. Complete tasks to earn entries and increase your chances of winning this incredible prize!',
    type: 'physical',
    value: 479.99,
    currency: 'GBP',
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80',
    totalWinners: 1,
    entryCost: 1,
    maxEntriesPerUser: 500,
    minimumEntries: 100,
    drawDay: 'Friday',
    startDate: new Date(),
    endDate: getNextFriday(),
    status: 'active',
    featured: true,
    totalEntries: 0,
    participants: [],
    winners: []
  },
  {
    title: 'Xbox Series X Console',
    description: 'Win the powerful Xbox Series X! The fastest, most powerful Xbox ever with 12 teraflops of processing power, 1TB SSD, and support for 4K gaming at 120fps. Includes wireless controller. Enter now for your chance to win this amazing next-gen console!',
    type: 'physical',
    value: 479.99,
    currency: 'GBP',
    imageUrl: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80',
    totalWinners: 1,
    entryCost: 1,
    maxEntriesPerUser: 500,
    minimumEntries: 100,
    drawDay: 'Saturday',
    startDate: new Date(),
    endDate: getNextSaturday(),
    status: 'active',
    featured: true,
    totalEntries: 0,
    participants: [],
    winners: []
  },
  {
    title: 'Nintendo Switch 2',
    description: 'Win the highly anticipated Nintendo Switch 2! The next generation of portable gaming with enhanced graphics, improved performance, and all your favorite Nintendo franchises. Experience gaming at home or on the go. Complete tasks to earn entries and win this exclusive prize!',
    type: 'physical',
    value: 349.99,
    currency: 'GBP',
    imageUrl: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80',
    totalWinners: 1,
    entryCost: 1,
    maxEntriesPerUser: 500,
    minimumEntries: 100,
    drawDay: 'Sunday',
    startDate: new Date(),
    endDate: getNextSunday(),
    status: 'active',
    featured: true,
    totalEntries: 0,
    participants: [],
    winners: []
  }
];

// Connect to MongoDB and seed data
const seedGamingPrizes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prize-platform');

    console.log('✅ Connected to MongoDB');
    console.log('🎮 Adding gaming console prizes...\n');

    // Insert prizes
    const createdPrizes = await Prize.insertMany(gamingPrizes);
    console.log(`✅ Successfully created ${createdPrizes.length} gaming prize(s):\n`);
    
    createdPrizes.forEach(prize => {
      console.log(`   🎁 ${prize.title}`);
      console.log(`      Value: £${prize.value}`);
      console.log(`      Draw Day: ${prize.drawDay}`);
      console.log(`      End Date: ${prize.endDate.toLocaleDateString('en-GB')}`);
      console.log(`      Status: ${prize.status}`);
      console.log('');
    });

    console.log('🎉 Gaming prizes added successfully!');
    console.log('💡 Refresh your browser to see the new prizes');
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding gaming prizes:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedGamingPrizes();
