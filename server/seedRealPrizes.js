const mongoose = require('mongoose');
const Prize = require('./models/Prize');
require('dotenv').config();

const realPrizes = [
  {
    title: '£100 Amazon Gift Card',
    description: 'A £100 Amazon.co.uk gift card that can be used for anything on Amazon. Perfect for shopping, entertainment, or gifts! Winner will receive the gift card code via email within 48 hours of the draw.',
    type: 'giftcard',
    value: 100,
    currency: 'GBP',
    imageUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800',
    totalWinners: 1,
    entryCost: 1,
    maxEntriesPerUser: 100,
    minimumEntries: 50,
    drawFrequency: 'weekly',
    drawDay: 'Friday',
    drawTime: '20:00',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    status: 'active',
    featured: true
  },
  {
    title: '£50 PayPal Cash',
    description: 'Instant £50 cash sent directly to your PayPal account. Use it however you want - complete freedom! Winner must have a valid PayPal account. Payment sent within 24 hours of draw.',
    type: 'cash',
    value: 50,
    currency: 'GBP',
    imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800',
    totalWinners: 2,
    entryCost: 1,
    maxEntriesPerUser: 100,
    minimumEntries: 30,
    drawFrequency: 'weekly',
    drawDay: 'Wednesday',
    drawTime: '18:00',
    startDate: new Date(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    status: 'active',
    featured: true
  },
  {
    title: 'Apple AirPods Pro (2nd Generation)',
    description: 'Brand new Apple AirPods Pro with active noise cancellation, transparency mode, and adaptive audio. Worth £229! Brand new, sealed in box. Shipped within 5 business days of draw. UK delivery only.',
    type: 'physical',
    value: 229,
    currency: 'GBP',
    imageUrl: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800',
    totalWinners: 1,
    entryCost: 1,
    maxEntriesPerUser: 100,
    minimumEntries: 100,
    drawFrequency: 'weekly',
    drawDay: 'Sunday',
    drawTime: '20:00',
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    status: 'active',
    featured: true
  },
  {
    title: '£25 Tesco Vouchers',
    description: 'Perfect for your weekly shop! £25 in Tesco vouchers to spend on groceries, clothing, or anything in-store. Physical vouchers sent by post within 7 days. UK addresses only.',
    type: 'giftcard',
    value: 25,
    currency: 'GBP',
    imageUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800',
    totalWinners: 5,
    entryCost: 1,
    maxEntriesPerUser: 50,
    minimumEntries: 20,
    drawFrequency: 'weekly',
    drawDay: 'Monday',
    drawTime: '19:00',
    startDate: new Date(),
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    status: 'active',
    featured: false
  },
  {
    title: 'PlayStation 5 Console',
    description: 'The ultimate gaming prize! Brand new PS5 console with controller. Experience next-gen gaming at its finest. Brand new, sealed console. Shipped within 7 business days. UK delivery only.',
    type: 'physical',
    value: 479,
    currency: 'GBP',
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800',
    totalWinners: 1,
    entryCost: 1,
    maxEntriesPerUser: 200,
    minimumEntries: 200,
    drawFrequency: 'monthly',
    drawDay: 'Friday',
    drawTime: '21:00',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: 'active',
    featured: true
  }
];

async function seedRealPrizes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB Connected');

    // Clear existing prizes (optional - comment out if you want to keep old ones)
    await Prize.deleteMany({});
    console.log('🗑️  Cleared existing prizes');

    // Insert real prizes
    const createdPrizes = await Prize.insertMany(realPrizes);
    console.log(`✅ Added ${createdPrizes.length} real prizes:`);
    
    createdPrizes.forEach(prize => {
      console.log(`   - ${prize.title} (£${prize.value}) - Draw: ${prize.endDate.toLocaleDateString()}`);
    });

    console.log('\n🎉 Real prizes seeded successfully!');
    console.log('\n📊 Prize Summary:');
    console.log(`   Total Value: £${realPrizes.reduce((sum, p) => sum + p.value, 0)}`);
    console.log(`   Total Winners: ${realPrizes.reduce((sum, p) => sum + p.totalWinners, 0)}`);
    console.log(`   Featured Prizes: ${realPrizes.filter(p => p.featured).length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding prizes:', error);
    process.exit(1);
  }
}

seedRealPrizes();
