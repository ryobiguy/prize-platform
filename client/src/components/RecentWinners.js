import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { Trophy, Clock } from 'lucide-react';
import './RecentWinners.css';

const RecentWinners = () => {
  const [recentWinners, setRecentWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentWinners();
    // Refresh every 30 seconds to show new winners
    const interval = setInterval(fetchRecentWinners, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRecentWinners = async () => {
    try {
      const response = await axios.get('/api/prizes/recent-winners');
      setRecentWinners(response.data.winners || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recent winners:', error);
      setLoading(false);
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const winDate = new Date(date);
    const diffInMinutes = Math.floor((now - winDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return winDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const maskUsername = (username) => {
    if (!username || username.length < 3) return username;
    const firstChar = username.charAt(0);
    const lastChar = username.charAt(username.length - 1);
    const masked = '*'.repeat(Math.min(username.length - 2, 4));
    return `${firstChar}${masked}${lastChar}`;
  };

  if (loading) {
    return (
      <div className="recent-winners">
        <div className="container">
          <h2 className="section-title">
            <Trophy size={28} /> Recent Winners
          </h2>
          <div className="winners-loading">Loading recent winners...</div>
        </div>
      </div>
    );
  }

  if (recentWinners.length === 0) {
    return (
      <div className="recent-winners">
        <div className="container">
          <h2 className="section-title">
            <Trophy size={28} /> Recent Winners
          </h2>
          <div className="winners-empty">
            <p>Be the first winner! Complete tasks and enter prize draws now.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-winners">
      <div className="container">
        <h2 className="section-title">
          <Trophy size={28} /> Recent Winners
        </h2>
        <div className="winners-feed">
          {recentWinners.map((winner, index) => (
            <div key={index} className="winner-item">
              <div className="winner-icon">
                <Trophy size={20} />
              </div>
              <div className="winner-info">
                <div className="winner-text">
                  <strong>{maskUsername(winner.username)}</strong> won{' '}
                  <span className="winner-prize">{winner.prizeTitle}</span>
                </div>
                <div className="winner-time">
                  <Clock size={14} />
                  {formatTimeAgo(winner.wonAt)}
                </div>
              </div>
              <div className="winner-value">
                £{winner.prizeValue}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentWinners;
