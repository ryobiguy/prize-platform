const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const crypto = require('crypto');

// AdGate postback endpoint (called when user completes offer)
router.get('/adgate/postback', async (req, res) => {
  try {
    const { user_id, points, offer_id, ip, hash } = req.query;

    // Verify the postback is from AdGate (security)
    const secretKey = process.env.ADGATE_SECRET_KEY;
    const expectedHash = crypto
      .createHash('sha256')
      .update(user_id + offer_id + points + secretKey)
      .digest('hex');

    if (hash !== expectedHash) {
      console.log('Invalid AdGate postback hash');
      return res.status(400).send('Invalid hash');
    }

    // Find user and award entries
    const user = await User.findById(user_id);
    
    if (!user) {
      console.log('User not found:', user_id);
      return res.status(404).send('User not found');
    }

    // Convert points to entries (1 point = 1 entry, adjust as needed)
    const entries = parseInt(points);
    
    user.availableEntries += entries;
    user.totalEntries += entries;
    
    // Track the offer completion
    if (!user.completedOffers) {
      user.completedOffers = [];
    }
    
    user.completedOffers.push({
      offerId: offer_id,
      entries: entries,
      completedAt: new Date(),
      ip: ip
    });

    await user.save();

    console.log(`✅ AdGate offer completed: User ${user_id} earned ${entries} entries`);
    
    // AdGate expects a 1 response for success
    res.send('1');
  } catch (error) {
    console.error('AdGate postback error:', error);
    res.status(500).send('Error');
  }
});

// Get user's offer stats
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    const stats = {
      completedOffers: user.completedOffers ? user.completedOffers.length : 0,
      totalEarned: user.totalEntries || 0
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get offer stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's offer history
router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    const history = user.completedOffers || [];
    
    res.json({ history });
  } catch (error) {
    console.error('Get offer history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
