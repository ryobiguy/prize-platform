const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: [
      // Social Media
      'twitter_follow', 'twitter_retweet', 'twitter_like',
      'instagram_follow', 'instagram_like',
      'youtube_subscribe', 'youtube_like',
      'tiktok_follow', 'tiktok_like',
      // Monetizable
      'watch_video_ad', 'watch_rewarded_ad',
      'complete_survey',
      'app_install', 'app_trial',
      'affiliate_click', 'affiliate_purchase',
      'email_signup',
      'game_trial',
      // Internal
      'daily_login', 'referral', 'share_social'
    ],
    required: true
  },
  platform: {
    type: String,
    enum: ['twitter', 'instagram', 'youtube', 'tiktok', 'admob', 'survey', 'affiliate', 'internal', 'other'],
    required: true
  },
  entriesReward: {
    type: Number,
    required: true,
    min: 1
  },
  verificationData: {
    // For social media tasks
    accountToFollow: String,
    postUrl: String,
    channelId: String,
    tiktokUsername: String,
    
    // For video ad tasks
    adProvider: String, // 'admob', 'unity', 'applovin'
    adUnitId: String,
    adDuration: Number, // seconds
    rewardAmount: Number, // entries to give
    
    // For surveys
    surveyProvider: String, // 'pollfish', 'tapjoy', 'offertoro'
    surveyUrl: String,
    surveyId: String,
    estimatedMinutes: Number,
    
    // For app installs
    appStoreUrl: String,
    playStoreUrl: String,
    appPackageName: String,
    requiredAction: String, // 'install', 'reach_level_5', 'make_purchase'
    
    // For affiliate tasks
    affiliateUrl: String,
    affiliateNetwork: String, // 'amazon', 'shareasale', 'cj'
    commissionRate: Number,
    productName: String,
    
    // For email signups
    signupUrl: String,
    partnerName: String,
    
    // For referrals
    referralCode: String,
    referralBonus: Number
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isRepeatable: {
    type: Boolean,
    default: false
  },
  repeatInterval: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'none'],
    default: 'none'
  },
  completionCount: {
    type: Number,
    default: 0
  },
  maxCompletions: {
    type: Number,
    default: null // null means unlimited
  },
  expiresAt: {
    type: Date,
    default: null
  },
  // Revenue tracking
  estimatedRevenue: {
    type: Number,
    default: 0, // Expected revenue per completion
    min: 0
  },
  totalRevenue: {
    type: Number,
    default: 0, // Actual revenue generated
    min: 0
  },
  // Priority for display (higher = shown first)
  priority: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Task', taskSchema);
