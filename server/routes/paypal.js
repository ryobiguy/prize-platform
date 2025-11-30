const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// PayPal configuration
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API_BASE = process.env.PAYPAL_MODE === 'live' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

const hasPayPalConfig = !!PAYPAL_CLIENT_ID && !!PAYPAL_CLIENT_SECRET;

if (!hasPayPalConfig) {
  console.warn('⚠️  PayPal API config incomplete. PayPal payments will be disabled.');
} else {
  console.log('✅ PayPal payments configured');
}

// Get PayPal access token
async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await axios.post(
    `${PAYPAL_API_BASE}/v1/oauth2/token`,
    'grant_type=client_credentials',
    {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  
  return response.data.access_token;
}

// Create PayPal order
router.post('/create-order', auth, async (req, res) => {
  try {
    if (!hasPayPalConfig) {
      return res.status(503).json({ error: 'PayPal not configured' });
    }

    const { packageId, entries, amount } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const accessToken = await getPayPalAccessToken();

    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: `${user._id}_${packageId}_${Date.now()}`,
        description: `${entries} Raffle Entries`,
        custom_id: JSON.stringify({
          userId: user._id.toString(),
          packageId,
          entries
        }),
        amount: {
          currency_code: 'GBP',
          value: amount.toFixed(2)
        }
      }],
      application_context: {
        brand_name: 'Total Raffle',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.CLIENT_URL}/dashboard?payment=success`,
        cancel_url: `${process.env.CLIENT_URL}/buy-entries?payment=cancelled`
      }
    };

    const response = await axios.post(
      `${PAYPAL_API_BASE}/v2/checkout/orders`,
      orderData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    res.json({
      orderId: response.data.id,
      approvalUrl: response.data.links.find(link => link.rel === 'approve')?.href
    });
  } catch (error) {
    console.error('PayPal create order error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create PayPal order' });
  }
});

// Capture PayPal order (after user approves)
router.post('/capture-order', auth, async (req, res) => {
  try {
    if (!hasPayPalConfig) {
      return res.status(503).json({ error: 'PayPal not configured' });
    }

    const { orderId } = req.body;
    const accessToken = await getPayPalAccessToken();

    const response = await axios.post(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    const captureData = response.data;

    if (captureData.status === 'COMPLETED') {
      // Extract custom data
      const customData = JSON.parse(captureData.purchase_units[0].custom_id);
      const { userId, entries } = customData;

      // Add entries to user
      const user = await User.findById(userId);
      if (user) {
        user.availableEntries += parseInt(entries);
        user.totalEntries += parseInt(entries);
        
        // Record purchase
        user.purchases.push({
          paymentId: captureData.id,
          entries: parseInt(entries),
          amountPence: Math.round(parseFloat(captureData.purchase_units[0].amount.value) * 100),
          provider: 'paypal',
          createdAt: new Date()
        });

        await user.save();

        console.log(`✅ PayPal payment successful: ${entries} entries added to user ${user.username}`);

        return res.json({
          success: true,
          message: `Successfully added ${entries} entries!`,
          newBalance: user.availableEntries
        });
      }
    }

    res.status(400).json({ error: 'Payment not completed' });
  } catch (error) {
    console.error('PayPal capture order error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to capture PayPal payment' });
  }
});

// PayPal webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    if (!hasPayPalConfig) {
      return res.status(503).json({ error: 'PayPal not configured' });
    }

    // PayPal webhook verification would go here
    // For now, just acknowledge receipt
    console.log('PayPal webhook received:', req.body);
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('PayPal webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;
