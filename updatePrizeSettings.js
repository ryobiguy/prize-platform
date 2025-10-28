require('dotenv').config();
const mongoose = require('mongoose');
const Prize = require('./server/models/Prize');

// Helper function to get next Friday
function getNextFriday() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 5 = Friday
  const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7; // If today is Friday, get next Friday
  
  const nextFriday = new Date(today);
  nextFriday.setDate(today.getDate() + daysUntilFriday);
  nextFriday.setHours(20, 0, 0, 0); // Set to 8 PM on Friday
  
  return nextFriday;
}

async function updatePrizeSettings() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Update all existing prizes
    const prizes = await Prize.find({});
    
    if (prizes.length === 0) {
      console.log('❌ No prizes found in database');
      process.exit(1);
    }

    console.log(`\nFound ${prizes.length} prize(s). Updating...`);

    for (const prize of prizes) {
      // Set draw day to Friday
      prize.drawDay = 'Friday';
      
      // Set minimum entries (default 50, adjust based on prize value)
      if (!prize.minimumEntries) {
        // Higher value prizes need more entries for profitability
        if (prize.value >= 500) {
          prize.minimumEntries = 100;
        } else if (prize.value >= 100) {
          prize.minimumEntries = 50;
        } else {
          prize.minimumEntries = 30;
        }
      }
      
      // Set end date to next Friday if not already set or if in the past
      const now = new Date();
      if (!prize.endDate || prize.endDate < now) {
        prize.endDate = getNextFriday();
      }
      
      // Set start date to now if not set
      if (!prize.startDate) {
        prize.startDate = now;
      }
      
      await prize.save();
      
      console.log(`\n✅ Updated: ${prize.title}`);
      console.log(`   Value: £${prize.value}`);
      console.log(`   Minimum Entries: ${prize.minimumEntries}`);
      console.log(`   Draw Day: ${prize.drawDay}`);
      console.log(`   End Date: ${prize.endDate.toLocaleString()}`);
    }

    console.log('\n🎉 All prizes updated successfully!');
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updatePrizeSettings();
