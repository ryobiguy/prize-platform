import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Gift } from 'lucide-react';
import axios from '../utils/axios';
import './Winners.css';

const Winners = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWinners: 0,
    totalValue: 0,
    activeUsers: 0
  });

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    try {
      const response = await axios.get('/api/prizes/winners/all');
      setWinners(response.data.winners);
      
      // Calculate stats
      setStats({
        totalWinners: response.data.winners.length,
        totalValue: response.data.winners.reduce((sum, w) => sum + w.prizeValue, 0),
        activeUsers: response.data.winners.length // Simplified
      });
    } catch (error) {
      console.error('Error fetching winners:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="winners-page">
      <div className="page-header">
        <div className="container">
          <Trophy size={64} />
          <h1>Recent Winners</h1>
          <p>Congratulations to our lucky winners!</p>
        </div>
      </div>

      <div className="container">
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-number">{stats.totalWinners}</div>
            <div className="stat-label">Total Winners</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">£{stats.totalValue.toLocaleString()}</div>
            <div className="stat-label">Prizes Given</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.activeUsers}+</div>
            <div className="stat-label">Active Users</div>
          </div>
        </div>

        <div className="winners-list">
          <h2>Latest Winners</h2>
          {loading ? (
            <div className="loading-state">
              <p>Loading winners...</p>
            </div>
          ) : winners.length === 0 ? (
            <div className="empty-winners">
              <Trophy size={48} />
              <p>No winners yet</p>
              <small>Be the first to win a prize!</small>
            </div>
          ) : (
            winners.map((winner, index) => (
              <div key={index} className="winner-card">
                <div className="winner-icon">
                  <Trophy size={32} />
                </div>
                <div className="winner-info">
                  <h3>{winner.name}</h3>
                  <div className="winner-prize">
                    <Gift size={16} />
                    <span>{winner.prize}</span>
                  </div>
                  <div className="winner-meta">
                    <div className="meta-item">
                      <Calendar size={14} />
                      <span>{new Date(winner.date).toLocaleDateString()}</span>
                    </div>
                    <span className="meta-divider">•</span>
                    <span>£{winner.prizeValue}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cta-section">
          <h2>You Could Be Next!</h2>
          <p>Start completing tasks and entering prize draws today</p>
          <a href="/register" className="cta-btn">Join Now</a>
        </div>
      </div>
    </div>
  );
};

export default Winners;
