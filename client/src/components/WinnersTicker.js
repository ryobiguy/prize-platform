import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy } from 'lucide-react';
import './WinnersTicker.css';

const WinnersTicker = () => {
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    const fetchRecentWinners = async () => {
      try {
        const response = await axios.get('/api/winners/recent?limit=10');
        setWinners(response.data.winners || []);
      } catch (error) {
        console.error('Error fetching recent winners:', error);
      }
    };

    fetchRecentWinners();
    // Refresh every 30 seconds
    const interval = setInterval(fetchRecentWinners, 30000);
    return () => clearInterval(interval);
  }, []);

  if (winners.length === 0) return null;

  return (
    <div className="winners-ticker">
      <div className="ticker-header">
        <Trophy size={20} />
        <span>Recent Winners</span>
      </div>
      <div className="ticker-content">
        <div className="ticker-scroll">
          {[...winners, ...winners].map((winner, index) => (
            <div key={index} className="ticker-item">
              <span className="winner-name">{winner.username}</span>
              <span className="winner-separator">won</span>
              <span className="winner-prize">{winner.prize?.title || 'a prize'}</span>
              <span className="winner-dot">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WinnersTicker;
