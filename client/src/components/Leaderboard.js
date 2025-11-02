import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import './Leaderboard.css';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [period, setPeriod] = useState('weekly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
    fetchUserPosition();
  }, [period]);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`/api/gamification/leaderboard?period=${period}`);
      setLeaderboard(response.data.leaderboard);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    }
  };

  const fetchUserPosition = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('/api/gamification/leaderboard/position', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserPosition(response.data);
    } catch (error) {
      console.error('Error fetching user position:', error);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy size={24} className="rank-icon gold" />;
    if (rank === 2) return <Medal size={24} className="rank-icon silver" />;
    if (rank === 3) return <Medal size={24} className="rank-icon bronze" />;
    return <span className="rank-number">#{rank}</span>;
  };

  const getReward = (rank) => {
    const rewards = {
      1: '£20',
      2: '£15',
      3: '£10',
      4: '£5',
      5: '£5',
      6: '£5',
      7: '£5',
      8: '£5',
      9: '£5',
      10: '£5'
    };
    return rewards[rank] || null;
  };

  if (loading) {
    return (
      <div className="leaderboard-section">
        <h2>🏆 Leaderboard</h2>
        <div className="loading">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="leaderboard-section">
      <div className="leaderboard-header">
        <h2>
          <Trophy size={28} /> Leaderboard
        </h2>
        <div className="period-selector">
          <button 
            className={period === 'weekly' ? 'active' : ''}
            onClick={() => setPeriod('weekly')}
          >
            Weekly
          </button>
          <button 
            className={period === 'monthly' ? 'active' : ''}
            onClick={() => setPeriod('monthly')}
          >
            Monthly
          </button>
          <button 
            className={period === 'alltime' ? 'active' : ''}
            onClick={() => setPeriod('alltime')}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="leaderboard-prizes">
        <div className="prize-info">
          <Award size={20} />
          <span>Weekly Top 10 Win Prizes!</span>
        </div>
        <div className="prize-breakdown">
          1st: £20 • 2nd: £15 • 3rd: £10 • 4th-10th: £5 each
        </div>
      </div>

      {userPosition && (
        <div className="user-position-card">
          <div className="position-label">Your Position</div>
          <div className="position-details">
            <div className="position-rank">#{userPosition.position}</div>
            <div className="position-stats">
              <div className="stat-item">
                <span className="stat-label">Total Entries</span>
                <span className="stat-value">{userPosition.totalEntries.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Level</span>
                <span className="stat-value">{userPosition.level}</span>
              </div>
            </div>
          </div>
          {userPosition.position <= 10 && (
            <div className="position-reward">
              🎉 You're in the prize zone! Win {getReward(userPosition.position)}
            </div>
          )}
        </div>
      )}

      <div className="leaderboard-table">
        {leaderboard.slice(0, 100).map((user, index) => {
          const reward = getReward(user.rank);
          const isTopTen = user.rank <= 10;

          return (
            <div 
              key={index} 
              className={`leaderboard-row ${isTopTen ? 'top-ten' : ''}`}
            >
              <div className="rank-cell">
                {getRankIcon(user.rank)}
              </div>
              <div className="user-cell">
                <div className="username">{user.username}</div>
                <div className="user-meta">
                  Level {user.level} • {user.streak}🔥 • {user.achievementCount}🏆
                </div>
              </div>
              <div className="entries-cell">
                <TrendingUp size={16} />
                <span>{user.totalEntries.toLocaleString()} entries</span>
              </div>
              {reward && (
                <div className="reward-cell">
                  {reward}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {leaderboard.length === 0 && (
        <div className="no-data">
          <Trophy size={64} />
          <p>No leaderboard data yet. Be the first to compete!</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
