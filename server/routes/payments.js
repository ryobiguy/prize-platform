const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Create Stripe checkout session
router.post('/create-checkout', auth, async (req, res) => {
  try {
    const { packageId, entries, amount } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `${entries} Raffle Entries`,
              description: `Purchase ${entries} entries for Total Raffle`,
              images: ['https://www.totalraffle.co.uk/logo.png'],
            },
            unit_amount: Math.round(amount * 100), // Convert to pence
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/buy-entries`,
      client_reference_id: user._id.toString(),
      metadata: {
        userId: user._id.toString(),
        entries: entries.toString(),
        packageId: packageId
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Create checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      // Get user and add entries
      const userId = session.metadata.userId;
      const entries = parseInt(session.metadata.entries);

      const user = await User.findById(userId);
      if (user) {
        user.availableEntries += entries;
        user.totalEntries += entries;
        await user.save();

        console.log(`✅ Added ${entries} entries to user ${user.email}`);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  }

  res.json({ received: true });
});

// Verify payment success
router.get('/verify-session/:sessionId', auth, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    
    if (session.payment_status === 'paid') {
      res.json({
        success: true,
        entries: parseInt(session.metadata.entries),
        amount: session.amount_total / 100
      });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error('Verify session error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

module.exports = router;
