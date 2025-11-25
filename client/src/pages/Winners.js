import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Gift, Star, Sparkles } from 'lucide-react';
import axios from '../utils/axios';
import './Winners.css';

const Winners = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, recent, high-value
  const [stats, setStats] = useState({
    totalWinners: 0,
    totalValue: 0,
    activeUsers: 0,
    thisMonth: 0
  });

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    try {
      const response = await axios.get('/api/prizes/winners/all');
      const winnersData = response.data.winners || [];
      setWinners(winnersData);
      
      // Calculate stats
      const now = new Date();
      const thisMonthWinners = winnersData.filter(w => {
        const winDate = new Date(w.date);
        return winDate.getMonth() === now.getMonth() && winDate.getFullYear() === now.getFullYear();
      });

      setStats({
        totalWinners: winnersData.length,
        totalValue: winnersData.reduce((sum, w) => sum + (w.prizeValue || 0), 0),
        activeUsers: winnersData.length,
        thisMonth: thisMonthWinners.length
      });
    } catch (error) {
      console.error('Error fetching winners:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredWinners = () => {
    let filtered = [...winners];
    
    if (filter === 'recent') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(w => new Date(w.date) >= weekAgo);
    } else if (filter === 'high-value') {
      filtered = filtered.filter(w => w.prizeValue >= 100);
      filtered.sort((a, b) => b.prizeValue - a.prizeValue);
    }
    
    return filtered;
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
          <div className="stat-card highlight">
            <Sparkles size={24} className="stat-icon" />
            <div className="stat-number">{stats.totalWinners}</div>
            <div className="stat-label">Total Winners</div>
          </div>
          <div className="stat-card">
            <Gift size={24} className="stat-icon" />
            <div className="stat-number">£{stats.totalValue.toLocaleString()}</div>
            <div className="stat-label">Prizes Given</div>
          </div>
          <div className="stat-card">
            <Trophy size={24} className="stat-icon" />
            <div className="stat-number">{stats.thisMonth}</div>
            <div className="stat-label">Winners This Month</div>
          </div>
        </div>

        <div className="filter-section">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Winners
          </button>
          <button 
            className={`filter-btn ${filter === 'recent' ? 'active' : ''}`}
            onClick={() => setFilter('recent')}
          >
            Last 7 Days
          </button>
          <button 
            className={`filter-btn ${filter === 'high-value' ? 'active' : ''}`}
            onClick={() => setFilter('high-value')}
          >
            High Value (£100+)
          </button>
        </div>

        <div className="winners-list">
          {loading ? (
            <div className="loading-state">
              <p>Loading winners...</p>
            </div>
          ) : getFilteredWinners().length === 0 ? (
            <div className="empty-winners">
              <Trophy size={48} />
              <p>No winners yet</p>
              <small>Be the first to win a prize!</small>
            </div>
          ) : (
            <div className="winners-grid">
              {getFilteredWinners().map((winner, index) => (
                <div key={index} className={`winner-card ${winner.prizeValue >= 200 ? 'high-value' : ''}`}>
                  {winner.prizeValue >= 200 && (
                    <div className="high-value-badge">
                      <Star size={16} />
                      High Value
                    </div>
                  )}
                  <div className="winner-icon">
                    <Trophy size={32} />
                  </div>
                  <div className="winner-info">
                    <h3>{winner.name}</h3>
                    <div className="winner-prize">
                      <Gift size={16} />
                      <span>{winner.prize}</span>
                    </div>
                    <div className="winner-value">£{winner.prizeValue}</div>
                    <div className="winner-meta">
                      <Calendar size={14} />
                      <span>{new Date(winner.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cta-section">
          <h2>🎉 You Could Be Next!</h2>
          <p>Join thousands of users winning amazing prizes every week</p>
          <a href="/prizes" className="cta-btn">Browse Prizes</a>
        </div>
      </div>
    </div>
  );
};

export default Winners;
