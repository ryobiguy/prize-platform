import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Sparkles, Gift, TrendingUp, Clock } from 'lucide-react';
import './SpinWheel.css';

const SpinWheel = ({ onWin }) => {
  const [canSpin, setCanSpin] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [wheelConfig, setWheelConfig] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    fetchWheelConfig();
    checkCanSpin();
  }, []);

  const fetchWheelConfig = async () => {
    try {
      const response = await axios.get('/api/instant-win/config');
      setWheelConfig(response.data);
    } catch (error) {
      console.error('Error fetching wheel config:', error);
    }
  };

  const checkCanSpin = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('/api/instant-win/can-spin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCanSpin(response.data.canSpin);
      setUserStats(response.data);
    } catch (error) {
      console.error('Error checking can spin:', error);
    }
  };

  const handleSpin = async () => {
    if (!canSpin || spinning) return;

    setSpinning(true);
    setResult(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/instant-win/spin', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Calculate rotation based on prize
      // Segments are at: 0° (top-right), 90° (bottom-right), 180° (bottom-left), 270° (top-left)
      // Pointer is at TOP CENTER (between 270° and 0°)
      // Each segment center is at: 45°, 135°, 225°, 315°
      
      const prizeIndex = getPrizeIndex(response.data.prize.prizeId);
      const segmentAngle = 360 / 4; // 90° per segment
      
      // Center of each segment (offset by 45°)
      const segmentCenter = (prizeIndex * segmentAngle) + 45;
      
      // To bring segment center to pointer position (top = 0°/360°)
      // We rotate the wheel so that segment center aligns with 0°
      const rotationNeeded = 360 - segmentCenter;
      const targetRotation = (360 * 5) + rotationNeeded; // 5 full spins + final position
      
      setRotation(targetRotation);

      // Wait for animation to complete
      setTimeout(() => {
        setResult(response.data);
        setSpinning(false);
        setCanSpin(false);
        
        if (onWin) {
          onWin(response.data);
        }

        // Show achievement notifications
        if (response.data.newAchievements && response.data.newAchievements.length > 0) {
          response.data.newAchievements.forEach(achievement => {
            console.log('🎉 Achievement Unlocked:', achievement.name);
          });
        }
      }, 4000);

    } catch (error) {
      console.error('Error spinning wheel:', error);
      setSpinning(false);
      alert(error.response?.data?.error || 'Error spinning wheel');
    }
  };

  const getPrizeIndex = (prizeId) => {
    // Visual positions (looking at the wheel):
    // segment-1 (purple) at 0° = TOP-RIGHT quadrant = 10 Entries
    // segment-2 (blue) at 90° = BOTTOM-RIGHT quadrant = 50 Entries  
    // segment-3 (gold) at 180° = BOTTOM-LEFT quadrant = £1 Cash
    // segment-4 (orange) at 270° = TOP-LEFT quadrant = £5 Cash
    
    // When pointer is at TOP (between segment-4 and segment-1)
    // We need to map prizes to their actual visual positions
    const prizeMap = {
      'entries_10': 0,   // segment-1 (purple/blue) - top-right
      'entries_50': 1,   // segment-2 (blue) - bottom-right
      'cash_1': 2,       // segment-3 (gold) - bottom-left
      'cash_5': 3        // segment-4 (orange) - top-left
    };
    return prizeMap[prizeId] || 0;
  };

  const getPrizeColor = (prizeId) => {
    const colorMap = {
      'entries_10': '#667eea',
      'entries_50': '#4facfe',
      'cash_1': '#ffd700',
      'cash_5': '#ff6b35'
    };
    return colorMap[prizeId] || '#667eea';
  };

  return (
    <div className="spin-wheel-container">
      <div className="wheel-header">
        <h2>
          <Sparkles size={28} /> Instant Win Wheel
        </h2>
        {userStats && (
          <div className="wheel-stats">
            <span>🎰 {userStats.totalSpins} spins</span>
            <span>💰 £{userStats.totalCashWon || 0} won</span>
          </div>
        )}
      </div>

      <div className="wheel-wrapper">
        <div className="wheel-pointer">▼</div>
        <div 
          className={`wheel ${spinning ? 'spinning' : ''}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="wheel-segment segment-1">
            <span>10<br/>Entries</span>
          </div>
          <div className="wheel-segment segment-2">
            <span>50<br/>Entries</span>
          </div>
          <div className="wheel-segment segment-3">
            <span>£1<br/>Cash</span>
          </div>
          <div className="wheel-segment segment-4">
            <span>£5<br/>Cash</span>
          </div>
          <div className="wheel-center">
            <Gift size={32} />
          </div>
        </div>
      </div>

      <div className="wheel-actions">
        <button 
          className={`spin-button ${!canSpin || spinning ? 'disabled' : ''}`}
          onClick={handleSpin}
          disabled={!canSpin || spinning}
        >
          {spinning ? (
            <>
              <TrendingUp size={20} className="spin-icon" />
              Spinning...
            </>
          ) : canSpin ? (
            <>
              <Sparkles size={20} />
              SPIN NOW!
            </>
          ) : (
            <>
              <Clock size={20} />
              Watch 5 Ads to Spin
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="result-popup">
          <div className="result-content">
            <div className="result-icon" style={{ background: getPrizeColor(result.prize.prizeId) }}>
              {result.prize.type === 'cash' ? '💰' : '🎫'}
            </div>
            <h3>You Won!</h3>
            <div className="result-prize">{result.prize.name}</div>
            <div className="result-balance">
              {result.prize.type === 'cash' ? (
                <p>Cash Balance: £{result.newBalance.cash}</p>
              ) : (
                <p>Available Entries: {result.newBalance.entries}</p>
              )}
            </div>
            <button 
              className="result-close"
              onClick={() => {
                setResult(null);
                checkCanSpin();
              }}
            >
              Awesome!
            </button>
          </div>
        </div>
      )}

      {wheelConfig && (
        <div className="wheel-odds">
          <h4>Prize Odds:</h4>
          <div className="odds-list">
            {wheelConfig.prizes.map((prize, index) => (
              <div key={index} className="odds-item">
                <span className="odds-name">{prize.name}</span>
                <span className="odds-probability">{prize.probability}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpinWheel;
