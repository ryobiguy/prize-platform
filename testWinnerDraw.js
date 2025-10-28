const mongoose = require('mongoose');
const Prize = require('./server/models/Prize');
const User = require('./server/models/User');
require('dotenv').config();

async function testWinnerDraw() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB Connected\n');

    // Get all active prizes with participants
    const prizes = await Prize.find({ 
      status: 'active',
      'participants.0': { $exists: true } // Has at least one participant
    }).populate('participants.user', 'email username');

    if (prizes.length === 0) {
      console.log('❌ No active prizes with participants found');
      process.exit(0);
    }

    console.log(`📊 Found ${prizes.length} prize(s) with participants:\n`);

    prizes.forEach((prize, index) => {
      console.log(`${index + 1}. ${prize.title}`);
      console.log(`   Value: £${prize.value}`);
      console.log(`   Participants: ${prize.participants.length}`);
      console.log(`   Total Entries: ${prize.totalEntries}`);
      console.log(`   Winners to draw: ${prize.totalWinners}`);
      console.log('');
    });

    // Select first prize for testing
    const testPrize = prizes[0];
    console.log(`🎯 Testing winner draw for: ${testPrize.title}\n`);

    // Draw winners
    const winners = [];
    const allEntries = [];

    // Create array of all entries
    testPrize.participants.forEach(participant => {
      for (let i = 0; i < participant.entries; i++) {
        allEntries.push(participant.user._id);
      }
    });

    console.log(`📝 Total entries in draw: ${allEntries.length}\n`);

    // Draw winners (without replacement)
    const drawnUserIds = new Set();
    
    for (let i = 0; i < testPrize.totalWinners && allEntries.length > 0; i++) {
      let attempts = 0;
      let winnerUserId;
      
      // Keep drawing until we get a unique winner
      do {
        const randomIndex = Math.floor(Math.random() * allEntries.length);
        winnerUserId = allEntries[randomIndex];
        attempts++;
      } while (drawnUserIds.has(winnerUserId.toString()) && attempts < 100);
      
      if (!drawnUserIds.has(winnerUserId.toString())) {
        drawnUserIds.add(winnerUserId.toString());
        winners.push({
          user: winnerUserId,
          drawnAt: new Date(),
          notified: false
        });
      }
    }

    console.log(`🎉 Winners drawn: ${winners.length}\n`);

    // Display winners
    for (let i = 0; i < winners.length; i++) {
      const winner = winners[i];
      const user = await User.findById(winner.user);
      const participant = testPrize.participants.find(p => p.user._id.toString() === winner.user.toString());
      
      console.log(`🏆 Winner ${i + 1}:`);
      console.log(`   User: ${user.username || user.email}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Entries: ${participant.entries}`);
      console.log(`   Win Chance: ${((participant.entries / allEntries.length) * 100).toFixed(2)}%`);
      console.log('');
    }

    // Save winners to database
    testPrize.winners = winners;
    testPrize.status = 'drawn';
    await testPrize.save();

    console.log('✅ Winners saved to database!');
    console.log('📧 Email notifications would be sent here (if SendGrid is configured)\n');

    console.log('🎯 Test Summary:');
    console.log(`   Prize: ${testPrize.title}`);
    console.log(`   Value: £${testPrize.value}`);
    console.log(`   Participants: ${testPrize.participants.length}`);
    console.log(`   Winners: ${winners.length}`);
    console.log(`   Status: ${testPrize.status}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testWinnerDraw();
