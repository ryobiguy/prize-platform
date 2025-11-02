import React, { useState, useEffect } from 'react';
import { Gift, CheckSquare, Users, Trophy, DollarSign, TrendingUp, AlertCircle, Settings, Mail, Play } from 'lucide-react';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [readyPrizes, setReadyPrizes] = useState([]);
  const [allWinners, setAllWinners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [emailSending, setEmailSending] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchReadyPrizes();
    fetchWinners();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchReadyPrizes = async () => {
    try {
      const response = await axios.get('/api/admin/prizes/ready-to-draw');
      setReadyPrizes(response.data.prizes);
    } catch (error) {
      console.error('Error fetching ready prizes:', error);
    }
  };

  const fetchWinners = async () => {
    try {
      const response = await axios.get('/api/admin/winners');
      setAllWinners(response.data.winners);
    } catch (error) {
      console.error('Error fetching winners:', error);
    }
  };

  const handleDrawWinner = async (prizeId, forceOverride = false) => {
    if (!forceOverride && !window.confirm('Are you sure you want to draw winners for this prize? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`/api/admin/prizes/${prizeId}/draw`, { forceOverride });
      toast.success(response.data.message);
      fetchReadyPrizes();
      fetchWinners();
      fetchStats();
    } catch (error) {
      const errorData = error.response?.data;
      
      // Check if it's a draw day mismatch
      if (errorData?.drawDay && errorData?.currentDay) {
        const confirmOverride = window.confirm(
          `${errorData.error}\n\n${errorData.message}\n\nDo you want to force the draw now anyway?`
        );
        
        if (confirmOverride) {
          // Retry with force override
          handleDrawWinner(prizeId, true);
          return;
        }
      } else {
        toast.error(errorData?.error || 'Failed to draw winners');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMarkNotified = async (prizeId, winnerId) => {
    try {
      await axios.put(`/api/admin/winners/${prizeId}/${winnerId}/notify`);
      toast.success('Winner marked as notified');
      fetchWinners();
    } catch (error) {
      toast.error('Failed to mark as notified');
    }
  };

  const handleTestEmail = async (e) => {
    e.preventDefault();
    if (!testEmail) {
      toast.error('Please enter an email address');
      return;
    }

    setEmailSending(true);
    try {
      await axios.post('/api/admin/test-email', { email: testEmail });
      toast.success('Test email sent successfully!');
      setTestEmail('');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send test email');
    } finally {
      setEmailSending(false);
    }
  };

  const handleTriggerDrawCheck = async () => {
    if (!window.confirm('Manually trigger the automated prize draw check?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/admin/trigger-draw-check');
      toast.success(response.data.message);
      fetchReadyPrizes();
      fetchWinners();
      fetchStats();
    } catch (error) {
      toast.error('Failed to trigger draw check');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="container">
          <h1>Admin Panel</h1>
          <p>Manage prizes, draw winners, and view statistics</p>
        </div>
      </div>

      <div className="container">
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <TrendingUp size={20} />
            Dashboard
          </button>
          <button
            className={`tab-btn ${activeTab === 'draw' ? 'active' : ''}`}
            onClick={() => setActiveTab('draw')}
          >
            <Trophy size={20} />
            Draw Winners
          </button>
          <button
            className={`tab-btn ${activeTab === 'winners' ? 'active' : ''}`}
            onClick={() => setActiveTab('winners')}
          >
            <Gift size={20} />
            All Winners
          </button>
          <button
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} />
            Settings
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'dashboard' && stats && (
            <div className="dashboard-section">
              <h2>Platform Statistics</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <Users size={32} />
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.totalUsers}</div>
                    <div className="stat-label">Total Users</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Gift size={32} />
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.totalPrizes}</div>
                    <div className="stat-label">Total Prizes</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Trophy size={32} />
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.drawnPrizes}</div>
                    <div className="stat-label">Prizes Drawn</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <DollarSign size={32} />
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">£{stats.totalPrizeValue}</div>
                    <div className="stat-label">Total Value Given</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <CheckSquare size={32} />
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.totalTasks}</div>
                    <div className="stat-label">Active Tasks</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Gift size={32} />
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.activePrizes}</div>
                    <div className="stat-label">Active Prizes</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'draw' && (
            <div className="draw-section">
              <h2>Prizes Ready to Draw</h2>
              {readyPrizes.length === 0 ? (
                <div className="empty-state">
                  <AlertCircle size={48} />
                  <p>No prizes ready for drawing</p>
                  <small>Prizes will appear here when their end date has passed</small>
                </div>
              ) : (
                <div className="prizes-list">
                  {readyPrizes.map(prize => {
                    const meetsMinimum = prize.totalEntries >= (prize.minimumEntries || 0);
                    const progress = prize.minimumEntries ? Math.min((prize.totalEntries / prize.minimumEntries) * 100, 100) : 100;
                    
                    return (
                      <div key={prize._id} className="prize-draw-card">
                        <div className="prize-draw-info">
                          <h3>{prize.title}</h3>
                          <div className="prize-meta">
                            <span>Value: £{prize.value}</span>
                            <span>•</span>
                            <span>Entries: {prize.totalEntries}</span>
                            <span>•</span>
                            <span>Participants: {prize.participants.length}</span>
                          </div>
                          {prize.minimumEntries && (
                            <div className="minimum-entries">
                              <div className="minimum-label">
                                Minimum Required: {prize.minimumEntries} entries
                                {meetsMinimum ? ' ✅' : ` (${prize.minimumEntries - prize.totalEntries} more needed)`}
                              </div>
                              <div className="progress-bar">
                                <div 
                                  className="progress-fill" 
                                  style={{ width: `${progress}%`, backgroundColor: meetsMinimum ? '#10b981' : '#f59e0b' }}
                                />
                              </div>
                            </div>
                          )}
                          <div className="prize-date">
                            Draw Day: {prize.drawDay || 'Friday'} • Ended: {new Date(prize.endDate).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          className="draw-btn"
                          onClick={() => handleDrawWinner(prize._id)}
                          disabled={loading || !meetsMinimum}
                          title={!meetsMinimum ? 'Minimum entries not met' : 'Draw winner'}
                        >
                          <Trophy size={20} />
                          {loading ? 'Drawing...' : meetsMinimum ? 'Draw Winner' : 'Not Ready'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'winners' && (
            <div className="winners-section">
              <h2>All Winners</h2>
              {allWinners.length === 0 ? (
                <div className="empty-state">
                  <Trophy size={48} />
                  <p>No winners yet</p>
                  <small>Winners will appear here after drawing prizes</small>
                </div>
              ) : (
                <div className="winners-table">
                  <table>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Prize</th>
                        <th>Value</th>
                        <th>Drawn Date</th>
                        <th>Notified</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allWinners.map(winner => (
                        <tr key={winner._id}>
                          <td>
                            <div>
                              <strong>{winner.user.username}</strong>
                              <br />
                              <small>{winner.user.email}</small>
                            </div>
                          </td>
                          <td>{winner.prize.title}</td>
                          <td>£{winner.prize.value}</td>
                          <td>{new Date(winner.drawnAt).toLocaleDateString()}</td>
                          <td>
                            <span className={`status-badge ${winner.notified ? 'success' : 'pending'}`}>
                              {winner.notified ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td>
                            {!winner.notified && (
                              <button
                                className="notify-btn"
                                onClick={() => handleMarkNotified(winner.prize._id, winner.user._id)}
                              >
                                Mark Notified
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <h2>System Settings</h2>
              
              <div className="settings-card">
                <h3><Mail size={20} /> Test Email Service</h3>
                <p>Send a test email to verify your email configuration is working correctly.</p>
                <form onSubmit={handleTestEmail} className="test-email-form">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="email-input"
                    required
                  />
                  <button 
                    type="submit" 
                    className="test-btn"
                    disabled={emailSending}
                  >
                    <Mail size={18} />
                    {emailSending ? 'Sending...' : 'Send Test Email'}
                  </button>
                </form>
                <small className="hint">
                  {process.env.REACT_APP_SENDGRID_API_KEY 
                    ? '✅ SendGrid configured' 
                    : '⚠️ No SendGrid API key - emails will be logged to console'}
                </small>
              </div>

              <div className="settings-card">
                <h3><Play size={20} /> Automated Prize Draws</h3>
                <p>The system automatically checks for prizes ready to draw every hour. You can manually trigger a check now.</p>
                <button 
                  onClick={handleTriggerDrawCheck}
                  className="trigger-btn"
                  disabled={loading}
                >
                  <Play size={18} />
                  {loading ? 'Checking...' : 'Trigger Draw Check Now'}
                </button>
                <small className="hint">
                  ℹ️ This will check all ended prizes and automatically draw winners for those meeting minimum entry requirements.
                </small>
              </div>

              <div className="settings-card">
                <h3><Trophy size={20} /> Scheduler Status</h3>
                <div className="status-info">
                  <div className="status-item">
                    <strong>Hourly Check:</strong>
                    <span className="status-badge success">Active</span>
                  </div>
                  <div className="status-item">
                    <strong>Daily Cleanup:</strong>
                    <span className="status-badge success">Active</span>
                  </div>
                  <div className="status-item">
                    <strong>Email Notifications:</strong>
                    <span className="status-badge success">Enabled</span>
                  </div>
                </div>
                <small className="hint">
                  ℹ️ The scheduler runs automatically in the background. Winners are notified via email immediately after being drawn.
                </small>
              </div>

              <div className="settings-card">
                <h3><AlertCircle size={20} /> Configuration</h3>
                <div className="config-list">
                  <div className="config-item">
                    <strong>MongoDB:</strong>
                    <span className="status-badge success">Connected</span>
                  </div>
                  <div className="config-item">
                    <strong>Email Service:</strong>
                    <span className="status-badge success">Ready</span>
                  </div>
                  <div className="config-item">
                    <strong>Prize Draw Scheduler:</strong>
                    <span className="status-badge success">Running</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
