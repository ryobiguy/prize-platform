const mongoose = require('mongoose');
const Prize = require('./server/models/Prize');
require('dotenv').config();

async function resetWinners() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB Connected\n');

    // Reset all prizes with winners
    const result = await Prize.updateMany(
      { 'winners.0': { $exists: true } }, // Has at least one winner
      { 
        $set: { 
          winners: [],
          status: 'active'
        }
      }
    );

    console.log(`🔄 Reset ${result.modifiedCount} prize(s)`);
    console.log('✅ All winners cleared and prizes set back to active!\n');

    // Show current prizes
    const prizes = await Prize.find({});
    console.log('📊 Current Prizes:');
    prizes.forEach(prize => {
      console.log(`   - ${prize.title}: ${prize.status} (${prize.winners.length} winners)`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetWinners();
