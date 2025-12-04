import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Trophy } from 'lucide-react';
import './WinnerFeed.css';

const WinnerFeed = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWinners();
    // Refresh every 30 seconds
    const interval = setInterval(fetchWinners, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchWinners = async () => {
    try {
      const response = await axios.get('/api/winners/recent?limit=20');
      setWinners(response.data.winners);
    } catch (error) {
      console.error('Error fetching winners:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (loading || winners.length === 0) return null;

  return (
    <div className="winner-feed">
      <div className="winner-feed-header">
        <Trophy size={20} />
        <h3>Recent Winners</h3>
      </div>
      <div className="winner-feed-scroll">
        <div className="winner-feed-content">
          {winners.concat(winners).map((winner, index) => (
            <div key={index} className="winner-item">
              <div className="winner-icon">🎉</div>
              <div className="winner-details">
                <span className="winner-name">{winner.username}</span>
                <span className="winner-text">won</span>
                <span className="winner-prize">{winner.prizeName}</span>
                <span className="winner-value">£{winner.prizeValue}</span>
              </div>
              <span className="winner-time">{getTimeAgo(winner.wonAt)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WinnerFeed;
