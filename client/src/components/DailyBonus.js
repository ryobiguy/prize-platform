import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import { Gift, Clock, Check } from 'lucide-react';
import './DailyBonus.css';

const DailyBonus = ({ user, onClaim }) => {
  const [bonusStatus, setBonusStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBonusStatus();
    }
  }, [user]);

  const fetchBonusStatus = async () => {
    try {
      const response = await axios.get('/api/daily-bonus/status');
      setBonusStatus(response.data);
    } catch (error) {
      console.error('Error fetching bonus status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const response = await axios.post('/api/daily-bonus/claim');
      toast.success(`🎉 You received £${response.data.bonusAmount.toFixed(2)} bonus credit!`);
      setBonusStatus({
        canClaim: false,
        hoursRemaining: 24,
        nextClaimTime: response.data.nextClaimTime,
        bonusAmount: response.data.bonusAmount
      });
      if (onClaim) {
        onClaim(response.data.newBalance);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to claim bonus');
    } finally {
      setClaiming(false);
    }
  };

  if (!user || loading) return null;

  if (!bonusStatus) return null;

  return (
    <div className={`daily-bonus-card ${bonusStatus.canClaim ? 'available' : 'claimed'}`}>
      <div className="bonus-icon">
        {bonusStatus.canClaim ? <Gift size={32} /> : <Check size={32} />}
      </div>
      
      <div className="bonus-content">
        <h3>Daily Login Bonus</h3>
        {bonusStatus.canClaim ? (
          <>
            <p className="bonus-amount">£{bonusStatus.bonusAmount.toFixed(2)} Free Credit!</p>
            <button 
              onClick={handleClaim} 
              disabled={claiming}
              className="claim-btn"
            >
              {claiming ? 'Claiming...' : 'Claim Now'}
            </button>
          </>
        ) : (
          <>
            <p className="bonus-claimed">Already claimed today</p>
            <div className="next-claim">
              <Clock size={16} />
              <span>Next bonus in {bonusStatus.hoursRemaining}h</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DailyBonus;
