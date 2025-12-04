const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const prizeDrawScheduler = require('./services/prizeDrawScheduler');

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'https://prize-platform.vercel.app',
  'https://www.totalraffle.co.uk',
  'https://totalraffle.co.uk',
  'http://www.totalraffle.co.uk',
  'http://totalraffle.co.uk',
  'https://totalraffle.murmuder.com',
  'http://totalraffle.murmuder.com',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Allow all Vercel preview deployments
    if (origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // Removed survey provider CORS for pay-to-enter model
    // if (origin && (origin.includes('theoremreach.com') || origin.includes('adgatemedia.com'))) {
    //   return callback(null, true);
    // }
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  exposedHeaders: ['set-cookie']
}));
// Stripe webhook needs raw body
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }), require('./routes/payments'));

app.use(express.json());
app.use(cookieParser());

// Routes
const authRoutes = require('./routes/auth');
const prizeRoutes = require('./routes/prizes');
const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payments');
const dailyBonusRoutes = require('./routes/dailyBonus');
app.use('/api/auth', authRoutes);
app.use('/api/prizes', prizeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/daily-bonus', dailyBonusRoutes);
app.use('/api/winners', require('./routes/winners'));
app.use('/api/entries', require('./routes/entries'));
app.use('/api/admin', require('./routes/admin'));
// Removed survey and offer routes for pay-to-enter model
// app.use('/api/offers', require('./routes/offers'));
// app.use('/api/surveys', require('./routes/surveys'));
app.use('/api/gamification', require('./routes/gamification'));
app.use('/api/instant-win', require('./routes/instantWin'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/paypal', require('./routes/paypal'));
app.use('/api/referral', require('./routes/referral'));
app.use('/api/newsletter', require('./routes/newsletter'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prize-platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB Connected');
  // Start the automated prize draw scheduler
  prizeDrawScheduler.start();
})
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
