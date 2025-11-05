const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const crypto = require('crypto');

// TheoremReach postback endpoint (called when user completes survey)
// Accept both GET and POST requests
const handleTheoremReachPostback = async (req, res) => {
  try {
    console.log('=== TheoremReach postback received ===');
    console.log('Method:', req.method);
    console.log('Query params:', JSON.stringify(req.query, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('Headers:', JSON.stringify(req.headers, null, 2));

    // TheoremReach sends data in body.data for POST requests
    let user_id, reward_amount_in_dollars, transaction_id, signature;
    
    if (req.body && req.body.data) {
      // POST request with data in body
      user_id = req.body.data.user_id;
      transaction_id = req.body.data.tx_id || req.body.data.external_transaction_id;
      reward_amount_in_dollars = req.body.data.reward_amount_in_dollars;
      signature = req.body.data.signature;
    } else {
      // GET request with query params
      user_id = req.query.user_id;
      reward_amount_in_dollars = req.query.reward_amount_in_dollars;
      transaction_id = req.query.tx_id || req.query.external_transaction_id;
      signature = req.query.signature;
    }

    // Handle test/ping requests from TheoremReach (user_id '123' is their test)
    if (!user_id || !transaction_id || !reward_amount_in_dollars || user_id === '123') {
      console.log('TheoremReach test/ping request - returning success');
      return res.status(200).send('1');
    }

    // Verify the postback is from TheoremReach (security)
    const apiKey = process.env.THEOREMREACH_API_KEY;
    const expectedSignature = crypto
      .createHash('sha1')
      .update(user_id + transaction_id + reward_amount_in_dollars + apiKey)
      .digest('hex');

    if (signature && signature !== expectedSignature) {
      console.log('Invalid TheoremReach postback signature');
      return res.status(400).send('Invalid signature');
    }

    // Find user and award entries
    const user = await User.findById(user_id);
    
    if (!user) {
      console.log('User not found:', user_id);
      return res.status(404).send('User not found');
    }

    // Convert reward dollars to entries
    // Example: $1.00 = 200 entries
    const rewardDollars = parseFloat(reward_amount_in_dollars);
    const entries = Math.floor(rewardDollars * 200); // Adjust multiplier as needed
    
    user.availableEntries += entries;
    user.totalEntries += entries;
    
    // Track the survey completion
    if (!user.completedSurveys) {
      user.completedSurveys = [];
    }
    
    user.completedSurveys.push({
      provider: 'theoremreach',
      transactionId: transaction_id,
      rewardDollars: rewardDollars,
      entries: entries,
      completedAt: new Date()
    });

    await user.save();

    console.log(`✅ TheoremReach survey completed: User ${user_id} earned ${entries} entries`);
    
    // TheoremReach expects a 1 response for success
    res.send('1');
  } catch (error) {
    console.error('=== TheoremReach postback error ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Request query:', req.query);
    console.error('Request body:', req.body);
    res.status(500).send('Error');
  }
};

// Register the handler for both GET and POST
router.get('/theoremreach/postback', handleTheoremReachPostback);
router.post('/theoremreach/postback', handleTheoremReachPostback);

// Manual survey completion (for SDK callback)
router.post('/complete', auth, async (req, res) => {
  try {
    const { rewardAmount, provider } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Convert reward to entries (adjust multiplier as needed)
    const entries = Math.floor(rewardAmount * 200);
    
    user.availableEntries += entries;
    user.totalEntries += entries;
    
    if (!user.completedSurveys) {
      user.completedSurveys = [];
    }
    
    user.completedSurveys.push({
      provider: provider || 'theoremreach',
      rewardAmount: rewardAmount,
      entries: entries,
      completedAt: new Date()
    });

    await user.save();

    res.json({ 
      success: true, 
      entries,
      message: `You earned ${entries} entries!`
    });
  } catch (error) {
    console.error('Survey completion error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's survey stats
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.json({ 
        stats: {
          completedSurveys: 0,
          totalEarned: 0
        }
      });
    }
    
    const stats = {
      completedSurveys: user.completedSurveys ? user.completedSurveys.length : 0,
      totalEarned: user.totalEntries || 0
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get survey stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's survey history
router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    const history = user.completedSurveys || [];
    
    res.json({ history });
  } catch (error) {
    console.error('Get survey history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
