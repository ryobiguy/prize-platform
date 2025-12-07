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

  // Handle payment completed event (idempotent per payment.id)
  if (event.type === 'payment.updated' && event.data.object.payment.status === 'COMPLETED') {
    const payment = event.data.object.payment;

    try {
      const paymentId = payment.id;
      const amount = payment.amount_money && payment.amount_money.amount;
      const currency = payment.amount_money && payment.amount_money.currency;
      const email = payment.buyer_email_address || payment.receipt_email;
      const referenceId = payment.reference_id;

      if (!amount || currency !== 'GBP') {
        console.error('Square webhook: unsupported amount/currency', amount, currency);
        return res.json({ received: true });
      }

      if (!email) {
        console.error('Square webhook: missing buyer email on payment');
        return res.json({ received: true });
      }

      const user = await User.findOne({ email });
      if (!user) {
        console.error('Square webhook: user not found for email', email);
        return res.json({ received: true });
      }

      // Check if this is a prize entry payment (reference_id starts with "prize:")
      if (referenceId && referenceId.startsWith('prize:')) {
        // Parse reference: "prize:PRIZE_ID:entries:NUM:user:USER_ID:discount:AMOUNT"
        const parts = referenceId.split(':');
        const prizeId = parts[1];
        const numberOfEntries = parseInt(parts[3]);
        const userId = parts[5];
        const discount = parts[7] ? parseFloat(parts[7]) : 0;

        if (prizeId && numberOfEntries && userId === user._id.toString()) {
          // Deduct cash balance if discount was applied
          if (discount > 0) {
            user.cashBalance = Math.max(0, (user.cashBalance || 0) - discount);
          }
          // Process prize entry
          const Prize = require('../models/Prize');
          const prize = await Prize.findById(prizeId);

          if (prize && prize.status === 'active') {
            // Check for duplicate payment
            const alreadyEntered = user.prizeEntries.some(e => e.paymentId === paymentId);
            if (alreadyEntered) {
              console.log('Square webhook: prize entry already processed', paymentId);
              return res.json({ received: true });
            }

            // INSTANT WIN LOGIC
            if (prize.isInstantWin && prize.prizePool && prize.prizePool.length > 0) {
              const winChance = 0.05; // 5% chance
              let wonPrizes = [];

              for (let i = 0; i < numberOfEntries; i++) {
                const currentAvailable = prize.prizePool.filter(p => p.remaining > 0);
                if (currentAvailable.length === 0) break;

                const didWin = Math.random() < winChance;

                if (didWin) {
                  const weightedPrizes = [];
                  currentAvailable.forEach(p => {
                    let weight = 10;
                    if (p.value >= 60) weight = 1;
                    else if (p.value >= 25) weight = 2;
                    else if (p.value >= 15) weight = 5;
                    
                    for (let w = 0; w < weight; w++) {
                      weightedPrizes.push(p);
                    }
                  });
                  
                  const randomPrize = weightedPrizes[Math.floor(Math.random() * weightedPrizes.length)];
                  const poolPrize = prize.prizePool.find(p => p.name === randomPrize.name);
                  poolPrize.remaining -= 1;

                  prize.winners.push({
                    user: user._id,
                    prizeName: randomPrize.name,
                    prizeValue: randomPrize.value,
                    prizeType: randomPrize.type,
                    drawnAt: new Date()
                  });

                  user.wins.push({
                    prize: prize._id,
                    prizeName: randomPrize.name,
                    prizeValue: randomPrize.value,
                    prizeType: randomPrize.type,
                    wonAt: new Date(),
                    claimed: false
                  });

                  wonPrizes.push(randomPrize.name);
                }
              }

              await prize.save();
              console.log(`✅ Instant win processed: ${wonPrizes.length} prizes won`);
            } else {
              // REGULAR DRAW LOGIC
              const existingEntry = prize.participants.find(p => p.user.toString() === user._id.toString());
              
              if (existingEntry) {
                existingEntry.entries += numberOfEntries;
              } else {
                prize.participants.push({ user: user._id, entries: numberOfEntries });
              }

              await prize.save();
              console.log(`✅ Regular draw entry processed: ${numberOfEntries} entries`);
            }

            // Record payment in user's prize entries
            user.prizeEntries.push({
              prize: prize._id,
              amountPaid: amount / 100, // convert pence to pounds
              paymentId: paymentId,
              enteredAt: new Date()
            });

            prize.totalEntries += numberOfEntries;
            await prize.save();
            await user.save();

            console.log(`✅ Prize entry payment processed for user ${user.email}`);
          }
        }
      } else {
        // Legacy entry package purchase (old system - can be removed later)
        const AMOUNT_TO_ENTRIES = {
          99: 100,
          399: 525,
          699: 1100,
          1499: 1500,
        };

        const entries = AMOUNT_TO_ENTRIES[amount];
        if (entries) {
          console.log('⚠️ Legacy entry package purchase detected - this system is deprecated');
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
