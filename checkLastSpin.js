const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./server/models/User');

async function checkLastSpin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prize-platform');
    console.log('✅ Connected to MongoDB\n');

    const user = await User.findOne().sort({ createdAt: -1 });
    
    if (!user) {
      console.log('❌ No users found.');
      process.exit(1);
    }

    console.log(`👤 User: ${user.username}\n`);
    console.log('💰 Current Balances:');
    console.log(`   Available Entries: ${user.availableEntries}`);
    console.log(`   Cash Balance: £${user.cashBalance || 0}\n`);
    
    console.log('🎰 Wheel Statistics:');
    console.log(`   Total Spins: ${user.stats.wheelSpins || 0}`);
    console.log(`   Instant Wins: ${user.stats.instantWins || 0}`);
    console.log(`   Total Cash Won: £${user.stats.totalCashWon || 0}\n`);
    
    console.log('📊 Analysis:');
    if (user.stats.instantWins > 0) {
      console.log('   ✅ You HAVE won cash prizes!');
      console.log(`   💰 Total: £${user.stats.totalCashWon}`);
    } else {
      console.log('   ℹ️  No cash prizes won yet (only entries)');
    }

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

checkLastSpin();
