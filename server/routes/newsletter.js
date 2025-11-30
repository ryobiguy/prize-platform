const express = require('express');
const router = express.Router();
const User = require('../models/User');
const emailService = require('../services/emailService');

// Newsletter subscriber model (simple for now)
const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    default: true
  },
  source: {
    type: String,
    default: 'footer'
  }
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.active) {
        return res.status(400).json({ error: 'Already subscribed!' });
      } else {
        // Reactivate subscription
        existing.active = true;
        await existing.save();
        return res.json({ message: 'Subscription reactivated!' });
      }
    }

    // Create new subscriber
    const subscriber = new Newsletter({
      email: email.toLowerCase(),
      source: 'footer'
    });

    await subscriber.save();

    // Check if user exists and give them 10 free entries
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      user.availableEntries += 10;
      user.totalEntries += 10;
      await user.save();

      // Send welcome email with entries
      try {
        await emailService.sendNewsletterWelcome(user, 10);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }
    } else {
      // Send welcome email without entries (they need to register)
      try {
        await emailService.sendNewsletterWelcomeGuest(email);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }
    }

    console.log(`✅ New newsletter subscriber: ${email}`);
    res.json({ message: 'Successfully subscribed!' });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;

    const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });
    if (!subscriber) {
      return res.status(404).json({ error: 'Email not found' });
    }

    subscriber.active = false;
    await subscriber.save();

    res.json({ message: 'Successfully unsubscribed' });
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

// Get all subscribers (admin only)
router.get('/subscribers', async (req, res) => {
  try {
    const subscribers = await Newsletter.find({ active: true })
      .select('email subscribedAt')
      .sort({ subscribedAt: -1 });

    res.json({
      total: subscribers.length,
      subscribers
    });
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({ error: 'Failed to get subscribers' });
  }
});

module.exports = router;
