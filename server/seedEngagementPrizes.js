const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Prize = require('./models/Prize');

// Helper functions for dates
const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(20, 0, 0, 0); // 8 PM
  return tomorrow;
};

const getNextWeek = () => {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(20, 0, 0, 0); // 8 PM Friday
  return nextWeek;
};

const getNextMonth = () => {
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  nextMonth.setHours(20, 0, 0, 0); // 8 PM
  return nextMonth;
};

// Engagement-focused prize structure
const engagementPrizes = [
  // DAILY PRIZE - £5 Amazon Voucher (High Frequency, Small Reward)
  {
    title: '£5 Amazon Gift Card - Daily Draw',
    description: 'Win a £5 Amazon gift card every single day! Complete tasks to earn entries and increase your chances. Winner announced daily at 8 PM. Perfect for building your wishlist or treating yourself to something small. New draw every 24 hours!',
    type: 'giftcard',
    value: 5,
    currency: 'GBP',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    totalWinners: 1,
    entryCost: 1,
    maxEntriesPerUser: 100,
    minimumEntries: 10, // Low barrier to entry
    drawFrequency: 'daily',
    drawDay: 'Monday', // Not used for daily draws, but required by schema
    drawTime: '20:00',
    startDate: new Date(),
    endDate: getTomorrow(),
    status: 'active',
    featured: false,
    totalEntries: 0,
    participants: [],
    winners: []
  },

  // WEEKLY PRIZE - £50 Gift Card (Medium Frequency, Medium Reward)
  {
    title: '£50 Amazon Gift Card - Weekly Draw',
    description: 'Win a £50 Amazon gift card every Friday at 8 PM! A significant prize that can get you something special. Complete tasks throughout the week to maximize your entries. The more you participate, the better your chances!',
    type: 'giftcard',
    value: 50,
    currency: 'GBP',
    imageUrl: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&q=80',
    totalWinners: 1,
    entryCost: 1,
    maxEntriesPerUser: 500,
    minimumEntries: 50,
    drawFrequency: 'weekly',
    drawDay: 'Friday',
    drawTime: '20:00',
    startDate: new Date(),
    endDate: getNextWeek(),
    status: 'active',
    featured: true,
    totalEntries: 0,
    participants: [],
    winners: []
  },

  // MONTHLY GRAND PRIZE - PlayStation 5 (Low Frequency, High Reward)
  {
    title: 'PlayStation 5 Console - Monthly Grand Prize',
    description: 'Win a brand new PlayStation 5 console! The ultimate gaming experience with stunning graphics, ultra-fast loading, and the innovative DualSense controller. Includes the disc version with 825GB SSD storage. This is the big one - complete tasks all month long to maximize your chances of winning this incredible prize. Draw held on the last Friday of every month at 8 PM!',
    type: 'physical',
    value: 479.99,
    currency: 'GBP',
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80',
    totalWinners: 1,
    entryCost: 1,
    maxEntriesPerUser: 2000,
    minimumEntries: 200,
    drawFrequency: 'monthly',
    drawDay: 'Friday',
    drawTime: '20:00',
    startDate: new Date(),
    endDate: getNextMonth(),
    status: 'active',
    featured: true,
    totalEntries: 0,
    participants: [],
    winners: []
  },

  // BONUS: Second Weekly Prize - £50 Gaming Gift Card
  {
    title: '£50 Gaming Gift Card - Weekly Draw',
    description: 'Win a £50 gift card for your favorite gaming platform (PlayStation Store, Xbox, Nintendo eShop, or Steam)! Perfect for buying new games, DLC, or in-game content. Winner announced every Sunday at 8 PM. Choose your platform when you win!',
    type: 'giftcard',
    value: 50,
    currency: 'GBP',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    totalWinners: 1,
    entryCost: 1,
    maxEntriesPerUser: 500,
    minimumEntries: 50,
    drawFrequency: 'weekly',
    drawDay: 'Sunday',
    drawTime: '20:00',
    startDate: new Date(),
    endDate: getNextWeek(),
    status: 'active',
    featured: true,
    totalEntries: 0,
    participants: [],
    winners: []
  }
];

// Connect to MongoDB and seed data
const seedEngagementPrizes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prize-platform');

    console.log('✅ Connected to MongoDB');
    console.log('🎯 Setting up engagement-focused prize structure...\n');

    // Clear existing prizes (optional - comment out if you want to keep old prizes)
    console.log('🗑️  Clearing old prizes...');
    await Prize.deleteMany({});
    console.log('✅ Old prizes cleared\n');

    // Insert new prizes
    const createdPrizes = await Prize.insertMany(engagementPrizes);
    console.log(`✅ Successfully created ${createdPrizes.length} engagement prize(s):\n`);
    
    createdPrizes.forEach(prize => {
      console.log(`   🎁 ${prize.title}`);
      console.log(`      Value: £${prize.value}`);
      console.log(`      Frequency: ${prize.drawFrequency.toUpperCase()}`);
      console.log(`      Draw Time: ${prize.drawTime}`);
      console.log(`      Min Entries: ${prize.minimumEntries}`);
      console.log(`      Status: ${prize.status}`);
      console.log('');
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 ENGAGEMENT PRIZE STRUCTURE COMPLETE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📊 Prize Schedule:');
    console.log('   • DAILY: £5 Amazon voucher (every day at 8 PM)');
    console.log('   • WEEKLY: £50 gift cards (Friday & Sunday at 8 PM)');
    console.log('   • MONTHLY: PS5 console (last Friday at 8 PM)\n');
    
    console.log('💰 Monthly Prize Budget:');
    console.log('   • Daily prizes: £5 × 30 days = £150');
    console.log('   • Weekly prizes: £50 × 8 draws = £400');
    console.log('   • Monthly prize: £480 × 1 = £480');
    console.log('   • TOTAL: £1,030/month\n');
    
    console.log('🎯 Engagement Strategy:');
    console.log('   ✅ Daily wins keep users coming back');
    console.log('   ✅ Weekly prizes provide regular excitement');
    console.log('   ✅ Monthly grand prize is the dream goal');
    console.log('   ✅ Low entry barriers encourage participation\n');
    
    console.log('💡 Next Steps:');
    console.log('   1. Refresh your browser to see new prizes');
    console.log('   2. Test entering each prize type');
    console.log('   3. Check admin panel for draw management');
    console.log('   4. Winner selection runs automatically!\n');
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding engagement prizes:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedEngagementPrizes();
