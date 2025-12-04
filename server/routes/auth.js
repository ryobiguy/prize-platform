const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const emailService = require('../services/emailService');

// Check signup bonus status
router.get('/signup-bonus-status', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const active = totalUsers < 100;
    const spotsLeft = Math.max(0, 100 - totalUsers);
    
    res.json({ active, spotsLeft, totalUsers });
  } catch (error) {
    console.error('Error checking bonus status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Register
router.post('/register', [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, referralCode } = req.body;

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ error: 'Password must contain at least one capital letter' });
    }

    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ error: 'Password must contain at least one number' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // SIGNUP BONUS: Check if user is in first 100 signups for bonus
    const userCount = await User.countDocuments();
    const isEarlySignup = userCount < 100;
    
    // Base entries: 5 for everyone, 25 for first 100 (10p per entry pricing)
    let baseEntries = isEarlySignup ? 25 : 5;
    let referrer = null;

    // Check if referral code is valid
    if (referralCode) {
      referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
      if (referrer) {
        baseEntries += 5; // Bonus for using referral code (50p value)
      }
    }

    // Generate unique referral code for new user
    const generateReferralCode = () => {
      return crypto.randomBytes(4).toString('hex').toUpperCase();
    };

    let newUserReferralCode = generateReferralCode();
    let codeExists = await User.findOne({ referralCode: newUserReferralCode });
    
    // Keep generating until we get a unique code
    while (codeExists) {
      newUserReferralCode = generateReferralCode();
      codeExists = await User.findOne({ referralCode: newUserReferralCode });
    }

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      totalEntries: baseEntries,
      availableEntries: baseEntries,
      emailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
      referredBy: referrer ? referrer._id : null,
      referralCode: newUserReferralCode
    });

    await user.save();

    // If referred, update referrer's stats
    if (referrer) {
      const REFERRER_REWARD = 50;
      referrer.referrals.push({
        user: user._id,
        entriesEarned: REFERRER_REWARD,
        rewardClaimed: true
      });
      referrer.referralStats.totalReferrals += 1;
      referrer.referralStats.totalEntriesEarned += REFERRER_REWARD;
      referrer.availableEntries += REFERRER_REWARD;
      referrer.totalEntries += REFERRER_REWARD;
      await referrer.save();
    }

    // Send verification email
    await emailService.sendVerificationEmail(user, verificationToken);

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully. Please check your email to verify your account.',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        totalEntries: user.totalEntries,
        availableEntries: user.availableEntries,
        emailVerified: user.emailVerified
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        totalEntries: user.totalEntries,
        availableEntries: user.availableEntries,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Google OAuth Login/Register
router.post('/google', async (req, res) => {
  try {
    const { credential, email, name, picture } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with Google account
      const username = name.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000);
      user = new User({
        username,
        email,
        password: Math.random().toString(36).slice(-8), // Random password (won't be used)
        totalEntries: 10,
        availableEntries: 10,
        authProvider: 'google',
        profilePicture: picture
      });
      await user.save();
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        totalEntries: user.totalEntries,
        availableEntries: user.availableEntries,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Apple OAuth Login/Register
router.post('/apple', async (req, res) => {
  try {
    const { identityToken, email, fullName } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with Apple account
      const username = (fullName?.givenName || 'user') + Math.floor(Math.random() * 10000);
      user = new User({
        username,
        email,
        password: Math.random().toString(36).slice(-8), // Random password (won't be used)
        totalEntries: 10,
        availableEntries: 10,
        authProvider: 'apple'
      });
      await user.save();
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        totalEntries: user.totalEntries,
        availableEntries: user.availableEntries,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Apple auth error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Temporary endpoint to make user admin (remove after use)
router.post('/make-admin-secret-endpoint-12345', async (req, res) => {
  try {
    const { email, secret } = req.body;
    
    // Simple secret check
    if (secret !== 'totalraffle2024admin') {
      return res.status(403).json({ error: 'Invalid secret' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isAdmin = true;
    await user.save();

    res.json({ 
      success: true, 
      message: `${email} is now an admin`,
      user: {
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Make admin error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify email
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    res.json({ 
      success: true, 
      message: 'Email verified successfully!',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Resend verification email
router.post('/resend-verification', auth, async (req, res) => {
  try {
    // req.user is already the full user object from auth middleware
    const user = req.user;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    // Send verification email
    await emailService.sendVerificationEmail(user, verificationToken);

    res.json({ 
      success: true, 
      message: 'Verification email sent. Please check your inbox.'
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ message: 'If that email exists, a reset link has been sent' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Send reset email
    await emailService.sendPasswordResetEmail(user, resetToken);

    res.json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ error: 'Password must contain at least one capital letter' });
    }

    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ error: 'Password must contain at least one number' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
