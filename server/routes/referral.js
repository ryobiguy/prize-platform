const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const crypto = require('crypto');

// Generate unique referral code
const generateReferralCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

// Get user's referral info
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('referrals.user', 'username createdAt')
      .select('referralCode referrals referralStats');

    // Generate referral code if user doesn't have one
    if (!user.referralCode) {
      let code = generateReferralCode();
      let exists = await User.findOne({ referralCode: code });
      
      // Keep generating until we get a unique code
      while (exists) {
        code = generateReferralCode();
        exists = await User.findOne({ referralCode: code });
      }
      
      user.referralCode = code;
      await user.save();
    }

    const referralLink = `${process.env.CLIENT_URL || 'https://www.totalraffle.co.uk'}/register?ref=${user.referralCode}`;

    res.json({
      referralCode: user.referralCode,
      referralLink,
      referrals: user.referrals || [],
      stats: user.referralStats || { totalReferrals: 0, totalEntriesEarned: 0 }
    });
  } catch (error) {
    console.error('Get referral info error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Validate referral code
router.get('/validate/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const user = await User.findOne({ referralCode: code.toUpperCase() }).select('username referralCode');

    if (!user) {
      return res.status(404).json({ valid: false, error: 'Invalid referral code' });
    }

    res.json({
      valid: true,
      referrerUsername: user.username,
      code: user.referralCode
    });
  } catch (error) {
    console.error('Validate referral code error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Process referral (called during registration)
router.post('/process', auth, async (req, res) => {
  try {
    const { referralCode } = req.body;
    const newUser = await User.findById(req.user.userId);

    if (!referralCode) {
      return res.status(400).json({ error: 'Referral code required' });
    }

    if (newUser.referredBy) {
      return res.status(400).json({ error: 'User already has a referrer' });
    }

    const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });

    if (!referrer) {
      return res.status(404).json({ error: 'Invalid referral code' });
    }

    if (referrer._id.toString() === newUser._id.toString()) {
      return res.status(400).json({ error: 'Cannot refer yourself' });
    }

    // Reward amounts
    const REFERRER_REWARD = 50; // Entries for referrer
    const REFEREE_REWARD = 25;  // Entries for new user

    // Update new user
    newUser.referredBy = referrer._id;
    newUser.availableEntries += REFEREE_REWARD;
    newUser.totalEntries += REFEREE_REWARD;
    await newUser.save();

    // Update referrer
    referrer.referrals.push({
      user: newUser._id,
      entriesEarned: REFERRER_REWARD,
      rewardClaimed: true
    });
    referrer.referralStats.totalReferrals += 1;
    referrer.referralStats.totalEntriesEarned += REFERRER_REWARD;
    referrer.availableEntries += REFERRER_REWARD;
    referrer.totalEntries += REFERRER_REWARD;
    await referrer.save();

    res.json({
      message: `Referral successful! You received ${REFEREE_REWARD} bonus entries!`,
      entriesEarned: REFEREE_REWARD,
      referrerReward: REFERRER_REWARD
    });
  } catch (error) {
    console.error('Process referral error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const topReferrers = await User.find({ 'referralStats.totalReferrals': { $gt: 0 } })
      .select('username referralStats')
      .sort({ 'referralStats.totalReferrals': -1 })
      .limit(10);

    res.json({ leaderboard: topReferrers });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
