import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
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
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const response = await axios.get('/api/users/dashboard');
      console.log('Dashboard data received:', response.data);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setError(error.message);
      // Set empty data to prevent crashes
      setDashboardData({
        stats: {
          totalEntries: 0,
          availableEntries: 0,
          activePrizes: 0,
          totalWins: 0
        },
        recentActivity: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <h2>Loading user data...</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="container" style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Loading dashboard...</h2>
          <p>Please wait...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="container" style={{ padding: '40px' }}>
          <h2>Error Loading Dashboard</h2>
          <p>Error: {error}</p>
          <button onClick={fetchDashboardData} style={{ padding: '10px 20px', marginTop: '20px' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData || !dashboardData.stats) {
    return (
      <div className="dashboard-page">
        <div className="container" style={{ padding: '40px' }}>
          <h2>Unable to load dashboard</h2>
          <p>Dashboard data is missing.</p>
          <button onClick={fetchDashboardData} style={{ padding: '10px 20px', marginTop: '20px' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { user: dashboardUser = {}, stats, recentActivity, purchases = [] } = dashboardData;

  const prizeEntries = (dashboardUser.prizeEntries || []).filter(entry => entry.prize);
  const totalTrackedEntries = prizeEntries.reduce((sum, entry) => sum + (entry.entriesUsed || 0), 0);
  const wins = dashboardUser.wins || [];
  const unclaimedWins = wins.filter(win => !win.claimed);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="container">
          <h1>Welcome back, {user.username}!</h1>
          <p>Track your entries, prizes, and activity</p>
        </div>
      </div>

      <div className="container">
        {unclaimedWins.length > 0 && (
          <div className="win-notification">
            <div className="win-notification-icon">🎉</div>
            <div className="win-notification-content">
              <h2>You've won a prize!</h2>
              <p>
                You have {unclaimedWins.length} unclaimed win{unclaimedWins.length > 1 ? 's' : ''}. Visit your{' '}
                <Link to="/wins">Wins page</Link> to view details and claim.
              </p>
            </div>
          </div>
        )}

        {/* Streak and Level Display */}
        {/* <StreakDisplay /> */}

        {/* Instant Win Wheel */}
        {/* <SpinWheel onWin={(result) => {
          console.log('Prize won:', result);
          fetchDashboardData(); // Refresh dashboard data
        }} /> */}

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">
              <Trophy size={32} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalEntries}</div>
              <div className="stat-label">Total Entries Purchased</div>
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
              <div className="stat-value">{totalTrackedEntries}</div>
              <div className="stat-label">Entries Spent</div>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">
              <TrendingUp size={32} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalWins || 0}</div>
              <div className="stat-label">Total Wins</div>
            </div>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="dashboard-two-column">
          {/* Left Column */}
          <div className="dashboard-column-left">
            {/* Entries Tracker */}
            <div className="section">
              <div className="section-header">
                <h2>Where You've Spent Your Entries</h2>
                <div className="entries-summary">
                  <span className="summary-badge">{prizeEntries.length} prizes entered</span>
                  <span className="summary-badge primary">{totalTrackedEntries} entries spent</span>
                </div>
              </div>
              {prizeEntries && prizeEntries.length > 0 ? (
                <div className="entries-table">
                  <div className="entries-table-header">
                    <div>Prize</div>
                    <div>Entries Used</div>
                    <div>Draw Date</div>
                  </div>
                  {prizeEntries.map((entry, index) => (
                    <Link
                      to={`/prizes/${entry.prize._id}`}
                      key={index}
                      className="entries-table-row"
                    >
                      <div className="entries-table-prize">
                        <Gift size={20} />
                        <span>{entry.prize.title}</span>
                      </div>
                      <div className="entries-table-entries">
                        <span className="entries-badge">{entry.entriesUsed}</span>
                      </div>
                      <div className="entries-table-date">
                        <Clock size={14} />
                        <span>{new Date(entry.prize.endDate).toLocaleDateString()}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Gift size={48} />
                  <p>No entries spent yet</p>
                  <Link to="/prizes" className="btn-primary">Browse Prizes</Link>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="section">
              <div className="section-header">
                <h2>Quick Actions</h2>
              </div>
              <div className="quick-actions-column">
                <Link to="/buy-entries" className="action-card">
                  <Trophy size={32} />
                  <h3>Buy Entries</h3>
                  <p>Purchase entry packages</p>
                </Link>
                <Link to="/prizes" className="action-card">
                  <Gift size={32} />
                  <h3>Browse Prizes</h3>
                  <p>Enter to win amazing prizes</p>
                </Link>
                <Link to="/wins" className="action-card">
                  <TrendingUp size={32} />
                  <h3>My Wins</h3>
                  <p>View your prizes</p>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="dashboard-column-right">
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

            {/* Purchase History */}
            {purchases && purchases.length > 0 && (
              <div className="section">
                <div className="section-header">
                  <h2>Purchase History</h2>
                </div>
                <div className="activity-list">
                  {purchases.slice(0, 5).map((purchase, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">
                        <Trophy size={20} />
                      </div>
                      <div className="activity-content">
                        <h4>
                          £{(purchase.amountPence / 100).toFixed(2)} for {purchase.entries} entries
                        </h4>
                        <p>Processed via {purchase.provider || 'Square'}</p>
                      </div>
                      <div className="activity-time">
                        {new Date(purchase.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
