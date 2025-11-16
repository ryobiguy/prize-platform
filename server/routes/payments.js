const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Square integration temporarily disabled - will fix SDK issues
let squareClient = null;
console.warn('⚠️  Square integration temporarily disabled. Working on SDK compatibility.');

// Create Square payment link
router.post('/create-checkout', auth, async (req, res) => {
  try {
    if (!squareClient) {
      return res.status(503).json({ error: 'Payment system not configured' });
    }

    const { packageId, entries, amount } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { checkoutApi } = squareClient;
    const crypto = require('crypto');
    const idempotencyKey = crypto.randomUUID();

    // Create Square checkout
    const requestBody = {
      idempotencyKey: idempotencyKey,
      order: {
        locationId: process.env.SQUARE_LOCATION_ID,
        lineItems: [
          {
            name: `${entries} Raffle Entries`,
            quantity: '1',
            basePriceMoney: {
              amount: Math.round(amount * 100), // Convert to pence
              currency: 'GBP'
            }
          }
        ]
      },
      checkoutOptions: {
        redirectUrl: `${process.env.CLIENT_URL}/payment/success`,
        askForShippingAddress: false
      },
      prePopulatedData: {
        buyerEmail: user.email
      },
      metadata: {
        userId: user._id.toString(),
        entries: entries.toString(),
        packageId: packageId
      }
    };

    const response = await checkoutApi.createPaymentLink(requestBody);
    
    if (response.result.paymentLink) {
      res.json({ url: response.result.paymentLink.url });
    } else {
      throw new Error('Failed to create payment link');
    }
  } catch (error) {
    console.error('Create checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Square webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!squareClient) {
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
      // Get metadata from the order
      const { ordersApi } = squareClient;
      const orderResponse = await ordersApi.retrieveOrder(payment.orderId);
      const order = orderResponse.result.order;
      
      if (order.metadata) {
        const userId = order.metadata.userId;
        const entries = parseInt(order.metadata.entries);

        const user = await User.findById(userId);
        if (user) {
          user.availableEntries += entries;
          user.totalEntries += entries;
          await user.save();

          console.log(`✅ Added ${entries} entries to user ${user.email}`);
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
    if (!squareClient) {
      return res.status(503).json({ error: 'Payment system not configured' });
    }

    const { paymentsApi } = squareClient;
    const response = await paymentsApi.getPayment(req.params.paymentId);
    const payment = response.result.payment;
    
    if (payment.status === 'COMPLETED') {
      res.json({
        success: true,
        amount: payment.totalMoney.amount / 100
      });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

module.exports = router;
