const mongoose = require('mongoose');
const crypto = require('crypto');
require('dotenv').config();

const User = require('../models/User');

const generateReferralCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

async function generateReferralCodesForExistingUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prize-platform', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');

    // Find all users without a referral code
    const usersWithoutCode = await User.find({ 
      $or: [
        { referralCode: { $exists: false } },
        { referralCode: null },
        { referralCode: '' }
      ]
    });

    console.log(`Found ${usersWithoutCode.length} users without referral codes`);

    for (const user of usersWithoutCode) {
      let code = generateReferralCode();
      let exists = await User.findOne({ referralCode: code });

      // Keep generating until unique
      while (exists) {
        code = generateReferralCode();
        exists = await User.findOne({ referralCode: code });
      }

      user.referralCode = code;
      
      // Initialize referral stats if they don't exist
      if (!user.referralStats) {
        user.referralStats = {
          totalReferrals: 0,
          totalEntriesEarned: 0
        };
      }

      await user.save();
      console.log(`✅ Generated code ${code} for user ${user.username}`);
    }

    console.log('✅ All users now have referral codes!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

generateReferralCodesForExistingUsers();
