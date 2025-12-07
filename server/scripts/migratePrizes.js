// Migration script to update prizes from entryCost to entryPrice
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Prize = require('../models/Prize');

async function migratePrizes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all prizes that have entryCost but no entryPrice
    const prizes = await Prize.find({});
    
    console.log(`Found ${prizes.length} prizes to check`);

    for (const prize of prizes) {
      // If prize has entryCost but no entryPrice, convert it
      if (prize.entryCost && !prize.entryPrice) {
        // For mystery prize (entryCost was 10 entries), set to £1.00
        // For others, you'll need to set manually based on your pricing
        if (prize.title.includes('Mystery')) {
          prize.entryPrice = 1.00;
        } else if (prize.title.includes('PS5') || prize.title.includes('iPhone')) {
          prize.entryPrice = 2.00;
        } else {
          // Default to £1.00 for others
          prize.entryPrice = 1.00;
        }
        
        await prize.save();
        console.log(`✅ Updated ${prize.title}: entryPrice set to £${prize.entryPrice}`);
      } else if (prize.entryPrice) {
        console.log(`✓ ${prize.title}: already has entryPrice £${prize.entryPrice}`);
      }
    }

    console.log('\n✅ Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

migratePrizes();
