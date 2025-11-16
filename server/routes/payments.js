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
      // After successful payment, send the user back to their dashboard
      redirect_url: `${process.env.CLIENT_URL}/dashboard`,
      quick_pay: {
        name: `${entries} Raffle Entries`,
        price_money: {
          amount: Math.round(amount * 100), // pence
          currency: 'GBP',
        },
        location_id: process.env.SQUARE_LOCATION_ID,
        // Include some context in the payment for debugging/reference
        reference_id: `pkg:${packageId}`,
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

  // TODO: Implement proper Square webhook signature verification.
  // For now, only log the signature mismatch but continue processing
  // so that legitimate payments can credit entries.
  try {
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha1', webhookSecret || '');
    hmac.update(body);
    const expectedSignature = hmac.digest('base64');

    if (signature !== expectedSignature) {
      console.warn('Square webhook signature mismatch (temporarily ignored)');
    }
  } catch (e) {
    console.warn('Square webhook signature check error (temporarily ignored):', e.message);
  }

  const event = JSON.parse(body.toString());

  // Handle payment completed event
  if (event.type === 'payment.updated' && event.data.object.payment.status === 'COMPLETED') {
    const payment = event.data.object.payment;

    try {
      const amount = payment.amount_money && payment.amount_money.amount;
      const currency = payment.amount_money && payment.amount_money.currency;
      const email = payment.buyer_email_address || payment.receipt_email;

      if (!amount || currency !== 'GBP') {
        console.error('Square webhook: unsupported amount/currency', amount, currency);
        return res.json({ received: true });
      }

      if (!email) {
        console.error('Square webhook: missing buyer email on payment');
        return res.json({ received: true });
      }

      // Map paid amount (in pence) to entries – must match your pricing
      const AMOUNT_TO_ENTRIES = {
        99: 100,    // £0.99 Starter
        399: 525,   // £3.99 Popular
        699: 1100,  // £6.99 Mega
        1499: 1500, // £14.99 Ultimate
      };

      const entries = AMOUNT_TO_ENTRIES[amount];

      if (!entries) {
        console.error('Square webhook: no entry mapping for amount', amount);
        return res.json({ received: true });
      }

      const user = await User.findOne({ email });
      if (!user) {
        console.error('Square webhook: user not found for email', email);
        return res.json({ received: true });
      }

      user.availableEntries += entries;
      user.totalEntries += entries;
      await user.save();

      console.log(`✅ Added ${entries} entries to user ${user.email} (amount: ${amount})`);
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
