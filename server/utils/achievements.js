// Achievement definitions and logic

const ACHIEVEMENTS = {
  // First Steps
  FIRST_LOGIN: {
    id: 'first_login',
    name: 'Welcome Aboard!',
    description: 'Complete your first login',
    icon: '👋',
    reward: 50
  },
  FIRST_TASK: {
    id: 'first_task',
    name: 'Task Master',
    description: 'Complete your first task',
    icon: '✅',
    reward: 25
  },
  FIRST_ENTRY: {
    id: 'first_entry',
    name: 'In It To Win It',
    description: 'Enter your first prize draw',
    icon: '🎫',
    reward: 50
  },
  
  // Streak Achievements
  STREAK_3: {
    id: 'streak_3',
    name: 'Getting Started',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    reward: 100
  },
  STREAK_7: {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥🔥',
    reward: 250
  },
  STREAK_14: {
    id: 'streak_14',
    name: 'Fortnight Fighter',
    description: 'Maintain a 14-day streak',
    icon: '🔥🔥🔥',
    reward: 500
  },
  STREAK_30: {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '🔥🔥🔥🔥',
    reward: 1000
  },
  
  // Ad Watching
  ADS_10: {
    id: 'ads_10',
    name: 'Ad Viewer',
    description: 'Watch 10 ads',
    icon: '📺',
    reward: 50
  },
  ADS_50: {
    id: 'ads_50',
    name: 'Ad Enthusiast',
    description: 'Watch 50 ads',
    icon: '📺📺',
    reward: 150
  },
  ADS_100: {
    id: 'ads_100',
    name: 'Ad Master',
    description: 'Watch 100 ads',
    icon: '📺📺📺',
    reward: 300
  },
  ADS_500: {
    id: 'ads_500',
    name: 'Ad Legend',
    description: 'Watch 500 ads',
    icon: '👑',
    reward: 1000
  },
  
  // Surveys
  SURVEYS_5: {
    id: 'surveys_5',
    name: 'Survey Starter',
    description: 'Complete 5 surveys',
    icon: '📋',
    reward: 100
  },
  SURVEYS_10: {
    id: 'surveys_10',
    name: 'Survey Champion',
    description: 'Complete 10 surveys',
    icon: '📋📋',
    reward: 250
  },
  
  // Referrals
  REFERRAL_1: {
    id: 'referral_1',
    name: 'Friendly Invite',
    description: 'Refer your first friend',
    icon: '👥',
    reward: 100
  },
  REFERRAL_5: {
    id: 'referral_5',
    name: 'Social Butterfly',
    description: 'Refer 5 friends',
    icon: '👥👥',
    reward: 500
  },
  REFERRAL_10: {
    id: 'referral_10',
    name: 'Influencer',
    description: 'Refer 10 friends',
    icon: '⭐',
    reward: 1000
  },
  
  // Winning
  FIRST_WIN: {
    id: 'first_win',
    name: 'Lucky Winner!',
    description: 'Win your first prize',
    icon: '🏆',
    reward: 200
  },
  WIN_3: {
    id: 'win_3',
    name: 'Triple Threat',
    description: 'Win 3 prizes',
    icon: '🏆🏆🏆',
    reward: 500
  },
  
  // Entries
  ENTRIES_1000: {
    id: 'entries_1000',
    name: 'Entry Collector',
    description: 'Earn 1,000 total entries',
    icon: '💎',
    reward: 200
  },
  ENTRIES_5000: {
    id: 'entries_5000',
    name: 'Entry Hoarder',
    description: 'Earn 5,000 total entries',
    icon: '💎💎',
    reward: 500
  },
  ENTRIES_10000: {
    id: 'entries_10000',
    name: 'Entry Legend',
    description: 'Earn 10,000 total entries',
    icon: '💎💎💎',
    reward: 1000
  },
  
  // Level Achievements
  LEVEL_5: {
    id: 'level_5',
    name: 'Rising Star',
    description: 'Reach level 5',
    icon: '⭐',
    reward: 250
  },
  LEVEL_10: {
    id: 'level_10',
    name: 'Experienced Player',
    description: 'Reach level 10',
    icon: '⭐⭐',
    reward: 500
  },
  LEVEL_25: {
    id: 'level_25',
    name: 'Elite Member',
    description: 'Reach level 25',
    icon: '⭐⭐⭐',
    reward: 1000
  }
};

// Check and award achievements
async function checkAchievements(user) {
  const newAchievements = [];
  const existingIds = user.achievements.map(a => a.id);
  
  // Check streak achievements
  if (user.streak.current >= 3 && !existingIds.includes('streak_3')) {
    newAchievements.push(ACHIEVEMENTS.STREAK_3);
  }
  if (user.streak.current >= 7 && !existingIds.includes('streak_7')) {
    newAchievements.push(ACHIEVEMENTS.STREAK_7);
  }
  if (user.streak.current >= 14 && !existingIds.includes('streak_14')) {
    newAchievements.push(ACHIEVEMENTS.STREAK_14);
  }
  if (user.streak.current >= 30 && !existingIds.includes('streak_30')) {
    newAchievements.push(ACHIEVEMENTS.STREAK_30);
  }
  
  // Check ad watching achievements
  if (user.stats.adsWatched >= 10 && !existingIds.includes('ads_10')) {
    newAchievements.push(ACHIEVEMENTS.ADS_10);
  }
  if (user.stats.adsWatched >= 50 && !existingIds.includes('ads_50')) {
    newAchievements.push(ACHIEVEMENTS.ADS_50);
  }
  if (user.stats.adsWatched >= 100 && !existingIds.includes('ads_100')) {
    newAchievements.push(ACHIEVEMENTS.ADS_100);
  }
  if (user.stats.adsWatched >= 500 && !existingIds.includes('ads_500')) {
    newAchievements.push(ACHIEVEMENTS.ADS_500);
  }
  
  // Check survey achievements
  if (user.stats.surveysCompleted >= 5 && !existingIds.includes('surveys_5')) {
    newAchievements.push(ACHIEVEMENTS.SURVEYS_5);
  }
  if (user.stats.surveysCompleted >= 10 && !existingIds.includes('surveys_10')) {
    newAchievements.push(ACHIEVEMENTS.SURVEYS_10);
  }
  
  // Check referral achievements
  if (user.stats.referralsMade >= 1 && !existingIds.includes('referral_1')) {
    newAchievements.push(ACHIEVEMENTS.REFERRAL_1);
  }
  if (user.stats.referralsMade >= 5 && !existingIds.includes('referral_5')) {
    newAchievements.push(ACHIEVEMENTS.REFERRAL_5);
  }
  if (user.stats.referralsMade >= 10 && !existingIds.includes('referral_10')) {
    newAchievements.push(ACHIEVEMENTS.REFERRAL_10);
  }
  
  // Check winning achievements
  if (user.stats.prizesWon >= 1 && !existingIds.includes('first_win')) {
    newAchievements.push(ACHIEVEMENTS.FIRST_WIN);
  }
  if (user.stats.prizesWon >= 3 && !existingIds.includes('win_3')) {
    newAchievements.push(ACHIEVEMENTS.WIN_3);
  }
  
  // Check entry achievements
  if (user.stats.totalEntriesEarned >= 1000 && !existingIds.includes('entries_1000')) {
    newAchievements.push(ACHIEVEMENTS.ENTRIES_1000);
  }
  if (user.stats.totalEntriesEarned >= 5000 && !existingIds.includes('entries_5000')) {
    newAchievements.push(ACHIEVEMENTS.ENTRIES_5000);
  }
  if (user.stats.totalEntriesEarned >= 10000 && !existingIds.includes('entries_10000')) {
    newAchievements.push(ACHIEVEMENTS.ENTRIES_10000);
  }
  
  // Check level achievements
  if (user.level >= 5 && !existingIds.includes('level_5')) {
    newAchievements.push(ACHIEVEMENTS.LEVEL_5);
  }
  if (user.level >= 10 && !existingIds.includes('level_10')) {
    newAchievements.push(ACHIEVEMENTS.LEVEL_10);
  }
  if (user.level >= 25 && !existingIds.includes('level_25')) {
    newAchievements.push(ACHIEVEMENTS.LEVEL_25);
  }
  
  // Award new achievements
  if (newAchievements.length > 0) {
    for (const achievement of newAchievements) {
      user.achievements.push({
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        reward: achievement.reward,
        unlockedAt: new Date()
      });
      
      // Award entries
      user.availableEntries += achievement.reward;
      user.totalEntries += achievement.reward;
      user.stats.totalEntriesEarned += achievement.reward;
    }
    
    await user.save();
  }
  
  return newAchievements;
}

// Calculate level from experience
function calculateLevel(experience) {
  // Level formula: level = floor(sqrt(experience / 100))
  return Math.floor(Math.sqrt(experience / 100)) + 1;
}

// Calculate experience needed for next level
function experienceForNextLevel(level) {
  return (level * level) * 100;
}

// Add experience and check for level up
async function addExperience(user, amount) {
  user.experience += amount;
  const newLevel = calculateLevel(user.experience);
  
  const leveledUp = newLevel > user.level;
  if (leveledUp) {
    user.level = newLevel;
    // Award bonus entries for leveling up
    const bonusEntries = newLevel * 50;
    user.availableEntries += bonusEntries;
    user.totalEntries += bonusEntries;
    user.stats.totalEntriesEarned += bonusEntries;
  }
  
  await user.save();
  
  return { leveledUp, newLevel, bonusEntries: leveledUp ? newLevel * 50 : 0 };
}

module.exports = {
  ACHIEVEMENTS,
  checkAchievements,
  calculateLevel,
  experienceForNextLevel,
  addExperience
};
