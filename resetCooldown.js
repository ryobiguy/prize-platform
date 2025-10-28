const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./server/models/User');

async function resetCooldown() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prize-platform');
    console.log('✅ Connected to MongoDB\n');

    // Find your user
    const user = await User.findOne().sort({ createdAt: -1 });
    
    if (!user) {
      console.log('❌ No users found.');
      process.exit(1);
    }

    console.log(`🔓 Resetting cooldown for: ${user.username}\n`);

    // Reset the last spin time to allow immediate spinning
    user.lastWheelSpin = new Date(Date.now() - (2 * 60 * 60 * 1000)); // 2 hours ago
    await user.save();

    console.log('✅ Cooldown reset!');
    console.log('🎰 You can now spin the wheel immediately!\n');
    console.log('💡 Steps:');
    console.log('   1. Refresh your browser');
    console.log('   2. Go to Dashboard');
    console.log('   3. Scroll to Instant Win Wheel');
    console.log('   4. Click "SPIN NOW!" button\n');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

resetCooldown();
