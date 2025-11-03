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
  'https://totalraffle-axpmte1h-ryans-projects-2726563d.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
// Stripe webhook needs raw body
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }), require('./routes/payments'));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/prizes', require('./routes/prizes'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));
app.use('/api/entries', require('./routes/entries'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/surveys', require('./routes/surveys'));
app.use('/api/gamification', require('./routes/gamification'));
app.use('/api/instant-win', require('./routes/instantWin'));
app.use('/api/payments', require('./routes/payments'));

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
