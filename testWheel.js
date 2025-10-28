const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./server/models/User');
const { spinWheel, awardPrize } = require('./server/utils/instantWin');

async function testWheel() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prize-platform');
    console.log('✅ Connected to MongoDB\n');

    // Find a user (you can replace with your username)
    const user = await User.findOne().sort({ createdAt: -1 });
    
    if (!user) {
      console.log('❌ No users found. Please create an account first.');
      process.exit(1);
    }

    console.log(`🎰 Testing Instant Win Wheel for: ${user.username}\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Simulate 10 spins to show prize distribution
    console.log('🎲 Simulating 10 spins to show prize distribution:\n');
    
    const results = {
      'entries_10': 0,
      'entries_50': 0,
      'cash_1': 0,
      'cash_5': 0
    };

    for (let i = 1; i <= 10; i++) {
      const prize = spinWheel();
      results[prize.prizeId]++;
      
      const icon = prize.type === 'cash' ? '💰' : '🎫';
      console.log(`   Spin ${i}: ${icon} ${prize.name}`);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📊 Prize Distribution (10 spins):');
    console.log(`   10 Entries: ${results.entries_10} times (${results.entries_10 * 10}%)`);
    console.log(`   50 Entries: ${results.entries_50} times (${results.entries_50 * 10}%)`);
    console.log(`   £1 Cash: ${results.cash_1} times (${results.cash_1 * 10}%)`);
    console.log(`   £5 Cash: ${results.cash_5} times (${results.cash_5 * 10}%)`);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Give user a real spin
    console.log('🎁 Awarding you a FREE test spin!\n');
    
    const testPrize = spinWheel();
    const result = await awardPrize(user, testPrize);
    
    user.lastWheelSpin = new Date();
    await user.save();

    console.log('🎉 YOU WON:', testPrize.name);
    console.log('\n📊 Your Updated Balance:');
    console.log(`   Available Entries: ${result.newBalance.entries}`);
    console.log(`   Cash Balance: £${result.newBalance.cash}`);
    console.log(`   Total Spins: ${user.stats.wheelSpins}`);
    
    if (testPrize.type === 'cash') {
      console.log('\n💰 Congratulations! You won real cash!');
      console.log(`   Total Cash Won: £${user.stats.totalCashWon}`);
      console.log(`   Instant Wins: ${user.stats.instantWins}`);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ Test Complete!');
    console.log('\n💡 Next Steps:');
    console.log('   1. Refresh your browser (http://localhost:3000)');
    console.log('   2. Login to your account');
    console.log('   3. Go to Dashboard');
    console.log('   4. Scroll down to see the Instant Win Wheel');
    console.log('   5. Your balance has been updated!');
    console.log('\n🎰 The wheel is ready to spin!\n');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

testWheel();
