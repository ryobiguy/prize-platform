require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('./models/Task');

const monetizableTasks = [
  // HIGH REVENUE - Video Ads (Daily repeatable)
  {
    title: 'Watch Video Ad',
    description: 'Watch a short video advertisement to earn entries. Can be done multiple times per day!',
    type: 'watch_rewarded_ad',
    platform: 'admob',
    entriesReward: 10,
    verificationData: {
      adProvider: 'admob',
      adDuration: 30,
      rewardAmount: 10
    },
    isActive: true,
    isRepeatable: true,
    repeatInterval: 'daily',
    maxCompletions: null, // Unlimited
    estimatedRevenue: 0.05, // $0.05 per ad view
    priority: 100 // Highest priority - most profitable
  },
  {
    title: 'Watch 5 Video Ads',
    description: 'Watch 5 video ads in a row for bonus entries!',
    type: 'watch_rewarded_ad',
    platform: 'admob',
    entriesReward: 60,
    verificationData: {
      adProvider: 'admob',
      adDuration: 150,
      rewardAmount: 60
    },
    isActive: true,
    isRepeatable: true,
    repeatInterval: 'daily',
    maxCompletions: 3, // Max 3 times per day
    estimatedRevenue: 0.25, // $0.25 per completion
    priority: 95
  },

  // HIGH REVENUE - Surveys
  {
    title: 'Quick Survey (2 minutes)',
    description: 'Complete a short survey about your preferences and earn entries!',
    type: 'complete_survey',
    platform: 'survey',
    entriesReward: 50,
    verificationData: {
      surveyProvider: 'pollfish',
      estimatedMinutes: 2
    },
    isActive: true,
    isRepeatable: true,
    repeatInterval: 'daily',
    estimatedRevenue: 0.50,
    priority: 90
  },
  {
    title: 'Standard Survey (5 minutes)',
    description: 'Share your opinions in this survey and earn big entries!',
    type: 'complete_survey',
    platform: 'survey',
    entriesReward: 150,
    verificationData: {
      surveyProvider: 'pollfish',
      estimatedMinutes: 5
    },
    isActive: true,
    isRepeatable: true,
    repeatInterval: 'daily',
    estimatedRevenue: 1.50,
    priority: 85
  },
  {
    title: 'Extended Survey (10 minutes)',
    description: 'Complete a detailed survey for maximum entries!',
    type: 'complete_survey',
    platform: 'survey',
    entriesReward: 300,
    verificationData: {
      surveyProvider: 'pollfish',
      estimatedMinutes: 10
    },
    isActive: true,
    isRepeatable: true,
    repeatInterval: 'weekly',
    estimatedRevenue: 3.00,
    priority: 80
  },

  // MEDIUM REVENUE - App Installs
  {
    title: 'Try Popular Game',
    description: 'Download and try this popular mobile game. Reach level 5 to earn entries!',
    type: 'app_trial',
    platform: 'affiliate',
    entriesReward: 200,
    verificationData: {
      requiredAction: 'reach_level_5',
      estimatedMinutes: 15
    },
    isActive: true,
    isRepeatable: false,
    estimatedRevenue: 2.00,
    priority: 75
  },
  {
    title: 'Install Shopping App',
    description: 'Install this shopping app and browse for 2 minutes to earn entries!',
    type: 'app_install',
    platform: 'affiliate',
    entriesReward: 100,
    verificationData: {
      requiredAction: 'install',
      estimatedMinutes: 2
    },
    isActive: true,
    isRepeatable: false,
    estimatedRevenue: 1.00,
    priority: 70
  },

  // MEDIUM REVENUE - Email Signups
  {
    title: 'Subscribe to Partner Newsletter',
    description: 'Subscribe to our partner\'s newsletter for exclusive deals and earn entries!',
    type: 'email_signup',
    platform: 'affiliate',
    entriesReward: 75,
    verificationData: {
      partnerName: 'Partner Deals',
      estimatedMinutes: 1
    },
    isActive: true,
    isRepeatable: false,
    estimatedRevenue: 1.50,
    priority: 65
  },

  // SOCIAL MEDIA TASKS (Low revenue but builds audience)
  {
    title: 'Follow Us on Twitter',
    description: 'Follow our Twitter account for updates on new prizes and tasks!',
    type: 'twitter_follow',
    platform: 'twitter',
    entriesReward: 25,
    verificationData: {
      accountToFollow: 'YourPrizePlatform'
    },
    isActive: true,
    isRepeatable: false,
    estimatedRevenue: 0,
    priority: 50
  },
  {
    title: 'Retweet Our Latest Post',
    description: 'Retweet our latest announcement to spread the word!',
    type: 'twitter_retweet',
    platform: 'twitter',
    entriesReward: 20,
    verificationData: {
      accountToFollow: 'YourPrizePlatform'
    },
    isActive: true,
    isRepeatable: true,
    repeatInterval: 'daily',
    estimatedRevenue: 0,
    priority: 45
  },
  {
    title: 'Follow Us on Instagram',
    description: 'Follow our Instagram for behind-the-scenes content and winner announcements!',
    type: 'instagram_follow',
    platform: 'instagram',
    entriesReward: 25,
    verificationData: {
      accountToFollow: 'yourprizeplatform'
    },
    isActive: true,
    isRepeatable: false,
    estimatedRevenue: 0,
    priority: 50
  },
  {
    title: 'Subscribe to Our YouTube',
    description: 'Subscribe to our YouTube channel for prize unboxings and winner reveals!',
    type: 'youtube_subscribe',
    platform: 'youtube',
    entriesReward: 30,
    verificationData: {
      channelId: 'your-channel-id'
    },
    isActive: true,
    isRepeatable: false,
    estimatedRevenue: 0,
    priority: 50
  },

  // INTERNAL TASKS (Retention & Growth)
  {
    title: 'Daily Login Bonus',
    description: 'Log in every day to earn free entries! Streak bonuses available.',
    type: 'daily_login',
    platform: 'internal',
    entriesReward: 5,
    verificationData: {},
    isActive: true,
    isRepeatable: true,
    repeatInterval: 'daily',
    estimatedRevenue: 0.01, // Small ad on login
    priority: 60
  },
  {
    title: 'Refer a Friend',
    description: 'Invite friends to join! You both get bonus entries when they sign up.',
    type: 'referral',
    platform: 'internal',
    entriesReward: 100,
    verificationData: {
      referralBonus: 50 // Referred friend also gets 50
    },
    isActive: true,
    isRepeatable: true,
    repeatInterval: 'none',
    maxCompletions: null,
    estimatedRevenue: 0.50, // Value of new user
    priority: 70
  },
  {
    title: 'Share on Social Media',
    description: 'Share our platform on your social media and earn entries!',
    type: 'share_social',
    platform: 'internal',
    entriesReward: 15,
    verificationData: {},
    isActive: true,
    isRepeatable: true,
    repeatInterval: 'daily',
    estimatedRevenue: 0,
    priority: 40
  }
];

async function seedMonetizableTasks() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing tasks
    await Task.deleteMany({});
    console.log('Cleared existing tasks');

    // Insert new tasks
    const tasks = await Task.insertMany(monetizableTasks);
    console.log(`✅ Successfully seeded ${tasks.length} monetizable tasks!`);

    // Show revenue summary
    const totalEstimatedRevenue = tasks.reduce((sum, task) => {
      if (task.isRepeatable && task.repeatInterval === 'daily') {
        return sum + (task.estimatedRevenue * 30); // Monthly estimate
      }
      return sum + task.estimatedRevenue;
    }, 0);

    console.log('\n📊 Revenue Potential Summary:');
    console.log('================================');
    tasks.forEach(task => {
      if (task.estimatedRevenue > 0) {
        const monthly = task.isRepeatable && task.repeatInterval === 'daily' 
          ? task.estimatedRevenue * 30 
          : task.estimatedRevenue;
        console.log(`${task.title}: $${monthly.toFixed(2)}/user/month`);
      }
    });
    console.log(`\nTotal estimated revenue per active user: $${totalEstimatedRevenue.toFixed(2)}/month`);
    console.log('With 100 users: $' + (totalEstimatedRevenue * 100).toFixed(2) + '/month');
    console.log('With 1000 users: $' + (totalEstimatedRevenue * 1000).toFixed(2) + '/month');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding tasks:', error);
    process.exit(1);
  }
}

seedMonetizableTasks();
