// Streak tracking and rewards

// Streak bonus entries by day
const STREAK_BONUSES = {
  1: 50,
  2: 60,
  3: 70,
  4: 80,
  5: 90,
  6: 100,
  7: 150,  // Week bonus
  14: 300, // Two weeks
  21: 500, // Three weeks
  30: 1000 // Month bonus
};

// Check if user should get streak today
function shouldUpdateStreak(lastLoginDate) {
  if (!lastLoginDate) return true;
  
  const now = new Date();
  const lastLogin = new Date(lastLoginDate);
  
  // Reset time to midnight for comparison
  now.setHours(0, 0, 0, 0);
  lastLogin.setHours(0, 0, 0, 0);
  
  const diffTime = now - lastLogin;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays >= 1;
}

// Check if streak should be broken
function shouldBreakStreak(lastLoginDate) {
  if (!lastLoginDate) return false;
  
  const now = new Date();
  const lastLogin = new Date(lastLoginDate);
  
  // Reset time to midnight for comparison
  now.setHours(0, 0, 0, 0);
  lastLogin.setHours(0, 0, 0, 0);
  
  const diffTime = now - lastLogin;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Break streak if more than 1 day has passed
  return diffDays > 1;
}

// Update user streak
async function updateStreak(user) {
  const now = new Date();
  
  // Check if we should update streak
  if (!shouldUpdateStreak(user.streak.lastLoginDate)) {
    return {
      updated: false,
      current: user.streak.current,
      bonus: 0,
      message: 'Streak already updated today'
    };
  }
  
  // Check if streak should be broken
  if (shouldBreakStreak(user.streak.lastLoginDate)) {
    user.streak.current = 1;
  } else {
    user.streak.current += 1;
  }
  
  // Update longest streak
  if (user.streak.current > user.streak.longest) {
    user.streak.longest = user.streak.current;
  }
  
  // Update last login date
  user.streak.lastLoginDate = now;
  
  // Calculate bonus entries
  const bonus = STREAK_BONUSES[user.streak.current] || 50;
  user.availableEntries += bonus;
  user.totalEntries += bonus;
  user.stats.totalEntriesEarned += bonus;
  
  await user.save();
  
  return {
    updated: true,
    current: user.streak.current,
    longest: user.streak.longest,
    bonus: bonus,
    message: `${user.streak.current} day streak! +${bonus} entries`
  };
}

// Get streak info without updating
function getStreakInfo(user) {
  const current = user.streak.current || 0;
  const longest = user.streak.longest || 0;
  const nextBonus = STREAK_BONUSES[current + 1] || 50;
  
  // Calculate next milestone
  let nextMilestone = null;
  const milestones = [3, 7, 14, 21, 30];
  for (const milestone of milestones) {
    if (current < milestone) {
      nextMilestone = milestone;
      break;
    }
  }
  
  return {
    current,
    longest,
    nextBonus,
    nextMilestone,
    daysUntilMilestone: nextMilestone ? nextMilestone - current : null
  };
}

module.exports = {
  STREAK_BONUSES,
  shouldUpdateStreak,
  shouldBreakStreak,
  updateStreak,
  getStreakInfo
};
