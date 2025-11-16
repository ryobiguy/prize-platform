const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Basic Square config check
const hasSquareConfig = !!process.env.SQUARE_ACCESS_TOKEN && !!process.env.SQUARE_LOCATION_ID;
if (!hasSquareConfig) {
  console.warn('⚠️  Square API config incomplete. Payment features will be disabled.');
} else {
  console.log('✅ Square payments configured (REST API mode)');
}

// Create Square payment link
router.post('/create-checkout', auth, async (req, res) => {
  try {
    if (!hasSquareConfig) {
      return res.status(503).json({ error: 'Payment system not configured' });
    }

    const { packageId, entries, amount } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const crypto = require('crypto');
    const idempotencyKey = crypto.randomUUID();

    // Use Square Checkout API: create-payment-link (quick pay)
    const squareBaseUrl = process.env.SQUARE_API_BASE_URL || 'https://connect.squareupsandbox.com';

    const requestBody = {
      idempotency_key: idempotencyKey,
      quick_pay: {
        name: `${entries} Raffle Entries`,
        price_money: {
          amount: Math.round(amount * 100), // pence
          currency: 'GBP',
        },
        location_id: process.env.SQUARE_LOCATION_ID,
        // After successful payment, send the user back to their dashboard
        redirect_url: `${process.env.CLIENT_URL}/dashboard`,
        note: `Package ${packageId} for user ${user._id.toString()}`,
      },
    };

    const response = await axios.post(
      `${squareBaseUrl}/v2/online-checkout/payment-links`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
          'Square-Version': '2024-09-18',
        },
      }
    );

    const link = response.data && response.data.payment_link;
    if (link && link.url) {
      return res.json({ url: link.url });
    }

    console.error('Create checkout error: Unexpected Square response', response.data);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  } catch (error) {
    console.error('Create checkout error:', error.response?.data || error.message || error);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Square webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!hasSquareConfig) {
    return res.status(503).json({ error: 'Payment system not configured' });
  }

  const signature = req.headers['x-square-signature'];
  const webhookSecret = process.env.SQUARE_WEBHOOK_SECRET;
  const body = req.body;

  // Verify Square webhook signature
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha1', webhookSecret);
  hmac.update(body);
  const expectedSignature = hmac.digest('base64');

  if (signature !== expectedSignature) {
    console.error('Square webhook signature verification failed');
    return res.status(400).send('Invalid signature');
  }

  const event = JSON.parse(body.toString());

  // Handle payment completed event
  if (event.type === 'payment.updated' && event.data.object.payment.status === 'COMPLETED') {
    const payment = event.data.object.payment;

    try {
      // We stored context in the quick_pay note: "Package <packageId> for user <userId>"
      const note = payment.note || '';

      const packageMatch = note.match(/Package\s+(\w+)/i);
      const userMatch = note.match(/user\s+([0-9a-fA-F]{24})/i);

      if (!packageMatch || !userMatch) {
        console.error('Square webhook: could not parse note for user/package', note);
      } else {
        const packageId = packageMatch[1];
        const userId = userMatch[1];

        // Map packageId to entries (must match frontend pricing)
        const PACKAGE_ENTRIES = {
          starter: 100,
          popular: 525,
          mega: 1100,
          ultimate: 1500,
        };

        const entries = PACKAGE_ENTRIES[packageId];

        if (!entries) {
          console.error('Square webhook: unknown packageId in note', packageId);
        } else {
          const user = await User.findById(userId);
          if (user) {
            user.availableEntries += entries;
            user.totalEntries += entries;
            await user.save();

            console.log(`✅ Added ${entries} entries to user ${user.email} (package: ${packageId})`);
          } else {
            console.error('Square webhook: user not found for id', userId);
          }
        }
      }
    } catch (error) {
      console.error('Error processing Square payment:', error);
    }
  }

  res.json({ received: true });
});

// Verify payment success
router.get('/verify-payment/:paymentId', auth, async (req, res) => {
  try {
    if (!hasSquareConfig) {
      return res.status(503).json({ error: 'Payment system not configured' });
    }

    // For quick_pay links we generally rely on webhooks instead of verify API.
    // This endpoint is kept for compatibility and currently returns success=false.
    return res.json({ success: false });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

module.exports = router;
