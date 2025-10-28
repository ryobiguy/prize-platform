// Instant Win Wheel Logic

// Prize configuration (optimized for profit)
const WHEEL_PRIZES = [
  { id: 'entries_10', name: '10 Entries', type: 'entries', value: 10, probability: 0.75, color: '#667eea' },
  { id: 'entries_50', name: '50 Entries', type: 'entries', value: 50, probability: 0.20, color: '#4facfe' },
  { id: 'cash_1', name: '£1 Cash', type: 'cash', value: 1, probability: 0.04, color: '#ffd700' },
  { id: 'cash_5', name: '£5 Cash', type: 'cash', value: 5, probability: 0.01, color: '#ff6b35' }
];

// Calculate cumulative probabilities for weighted random selection
function buildProbabilityRanges() {
  let cumulative = 0;
  return WHEEL_PRIZES.map(prize => {
    const range = {
      ...prize,
      min: cumulative,
      max: cumulative + prize.probability
    };
    cumulative += prize.probability;
    return range;
  });
}

const PROBABILITY_RANGES = buildProbabilityRanges();

// Spin the wheel and determine prize
function spinWheel() {
  const random = Math.random();
  
  for (const range of PROBABILITY_RANGES) {
    if (random >= range.min && random < range.max) {
      return {
        prizeId: range.id,
        name: range.name,
        type: range.type,
        value: range.value,
        color: range.color
      };
    }
  }
  
  // Fallback (should never happen)
  return PROBABILITY_RANGES[0];
}

// Award prize to user
async function awardPrize(user, prize) {
  if (prize.type === 'entries') {
    user.availableEntries += prize.value;
    user.totalEntries += prize.value;
    user.stats.totalEntriesEarned += prize.value;
  } else if (prize.type === 'cash') {
    // Add to user's cash balance
    if (!user.cashBalance) {
      user.cashBalance = 0;
    }
    user.cashBalance += prize.value;
    
    // Track instant wins
    if (!user.stats.instantWins) {
      user.stats.instantWins = 0;
    }
    user.stats.instantWins += 1;
    
    if (!user.stats.totalCashWon) {
      user.stats.totalCashWon = 0;
    }
    user.stats.totalCashWon += prize.value;
  }
  
  // Track spin
  if (!user.stats.wheelSpins) {
    user.stats.wheelSpins = 0;
  }
  user.stats.wheelSpins += 1;
  
  // Add experience
  user.experience += 10;
  
  await user.save();
  
  return {
    success: true,
    prize,
    newBalance: {
      entries: user.availableEntries,
      cash: user.cashBalance || 0
    }
  };
}

// Check if user can spin (must have watched ads)
function canSpin(user) {
  // Check if user has completed required ads
  const lastSpinTime = user.lastWheelSpin || new Date(0);
  const now = new Date();
  const hoursSinceLastSpin = (now - lastSpinTime) / (1000 * 60 * 60);
  
  // Can spin once per 5 ads watched (roughly once per hour)
  return hoursSinceLastSpin >= 1;
}

// Get wheel statistics
function getWheelStats() {
  return {
    prizes: WHEEL_PRIZES.map(p => ({
      name: p.name,
      type: p.type,
      value: p.value,
      probability: `${(p.probability * 100).toFixed(1)}%`,
      color: p.color
    })),
    totalPrizes: WHEEL_PRIZES.length,
    averageValue: calculateAverageValue()
  };
}

// Calculate expected value
function calculateAverageValue() {
  let totalValue = 0;
  WHEEL_PRIZES.forEach(prize => {
    if (prize.type === 'entries') {
      totalValue += prize.value * prize.probability * 0.01; // Convert entries to £ value
    } else {
      totalValue += prize.value * prize.probability;
    }
  });
  return totalValue.toFixed(2);
}

module.exports = {
  WHEEL_PRIZES,
  spinWheel,
  awardPrize,
  canSpin,
  getWheelStats
};
