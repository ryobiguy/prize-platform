import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Trophy, Gift, CheckSquare, Award, TrendingUp, Clock } from 'lucide-react';
import StreakDisplay from '../components/StreakDisplay';
import Achievements from '../components/Achievements';
import Leaderboard from '../components/Leaderboard';
import SpinWheel from '../components/SpinWheel';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/users/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (!dashboardData || !dashboardData.stats) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <h2>Unable to load dashboard</h2>
          <p>Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const { stats, recentActivity } = dashboardData;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="container">
          <h1>Welcome back, {user.username}!</h1>
          <p>Track your entries, prizes, and activity</p>
        </div>
      </div>

      <div className="container">
        {/* Streak and Level Display */}
        <StreakDisplay />

        {/* Instant Win Wheel */}
        <SpinWheel onWin={(result) => {
          console.log('Prize won:', result);
          fetchDashboardData(); // Refresh dashboard data
        }} />

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">
              <Trophy size={32} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalEntries}</div>
              <div className="stat-label">Total Entries Earned</div>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">
              <Award size={32} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.availableEntries}</div>
              <div className="stat-label">Available Entries</div>
            </div>
          </div>

          <div className="stat-card secondary">
            <div className="stat-icon">
              <Gift size={32} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.activePrizes}</div>
              <div className="stat-label">Active Prize Entries</div>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">
              <CheckSquare size={32} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.tasksCompleted}</div>
              <div className="stat-label">Tasks Completed</div>
            </div>
          </div>
        </div>

        {/* Wins Section */}
        {stats.totalWins > 0 && user.wins && user.wins.length > 0 && (
          <div className="section">
            <div className="section-header">
              <h2>Your Wins 🎉</h2>
              <Link to="/wins" className="view-all">View All</Link>
            </div>
            <div className="wins-grid">
              {user.wins.slice(0, 3).map((win, index) => (
                <div key={index} className="win-card">
                  <Trophy size={48} className="win-icon" />
                  <h3>{win.prize.title}</h3>
                  <p className="win-value">£{win.prize.value}</p>
                  <span className={`win-status ${win.claimed ? 'claimed' : 'pending'}`}>
                    {win.claimed ? 'Claimed' : 'Pending Claim'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Prize Entries */}
        {user.prizeEntries && user.prizeEntries.length > 0 && (
          <div className="section">
            <div className="section-header">
              <h2>Your Prize Entries</h2>
              <Link to="/entries" className="view-all">View All</Link>
            </div>
            <div className="entries-list">
              {user.prizeEntries.slice(0, 5).map((entry, index) => (
                <Link 
                  to={`/prizes/${entry.prize._id}`} 
                  key={index} 
                  className="entry-item"
                >
                  <div className="entry-info">
                    <Gift size={24} />
                    <div>
                      <h4>{entry.prize.title}</h4>
                      <p>{entry.entriesUsed} entries used</p>
                    </div>
                  </div>
                  <div className="entry-meta">
                    <Clock size={16} />
                    <span>{new Date(entry.prize.endDate).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {recentActivity && recentActivity.length > 0 && (
          <div className="section">
            <div className="section-header">
              <h2>Recent Activity</h2>
            </div>
            <div className="activity-list">
              {recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    <CheckSquare size={20} />
                  </div>
                  <div className="activity-content">
                    <h4>{activity.task.title}</h4>
                    <p>Earned {activity.task.entriesAwarded} entries</p>
                  </div>
                  <div className="activity-time">
                    {new Date(activity.completedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        <Achievements />

        {/* Leaderboard */}
        <Leaderboard />

        {/* Quick Actions */}
        <div className="quick-actions">
          <Link to="/tasks" className="action-card">
            <CheckSquare size={32} />
            <h3>Complete Tasks</h3>
            <p>Earn more entries</p>
          </Link>
          <Link to="/prizes" className="action-card">
            <Gift size={32} />
            <h3>Browse Prizes</h3>
            <p>Enter to win</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
