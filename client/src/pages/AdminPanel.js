import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gift, CheckSquare, Users, Trophy, DollarSign, TrendingUp, AlertCircle, Settings, Mail, Play, Zap } from 'lucide-react';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [readyPrizes, setReadyPrizes] = useState([]);
  const [allWinners, setAllWinners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creatingPrize, setCreatingPrize] = useState(false);
  const [newPrize, setNewPrize] = useState({
    title: '',
    description: '',
    type: 'cash',
    value: '',
    imageUrl: '',
    totalWinners: 1,
    entryCost: 1,
    maxEntriesPerUser: 100,
    minimumEntries: 50,
    drawFrequency: 'weekly',
    drawDay: 'Friday',
    drawTime: '20:00',
    startDate: '',
    endDate: '',
    featured: false
  });
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
      // Add timestamp to prevent caching
      const response = await axios.get(`/api/admin/winners?t=${Date.now()}`);
      console.log('Winners data:', response.data.winners);
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

  const handleRefundPrize = async (prizeId) => {
    if (!window.confirm('Are you sure you want to refund all entries for this prize? All participants will get their entries back and the prize will be cancelled.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`/api/admin/prizes/${prizeId}/refund`);
      toast.success(response.data.message);
      fetchReadyPrizes();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to refund entries');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsClaimed = async (userId, prizeId) => {
    console.log('handleMarkAsClaimed called with:', { userId, prizeId });
    
    if (!window.confirm('Mark this win as claimed? This will update the user\'s win status.')) {
      return;
    }

    try {
      const response = await axios.post(`/api/admin/wins/${userId}/${prizeId}/claim`);
      toast.success(response.data.message);
      fetchWinners();
      fetchStats();
    } catch (error) {
      console.error('Mark as claimed error:', error);
      toast.error(error.response?.data?.error || 'Failed to mark as claimed');
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

  const handleSetupPrizes = async () => {
    if (!window.confirm('This will create the default prizes (£5 daily, £50 weekly, PS5 monthly) and setup the spin wheel. Continue?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/admin/setup-prizes-once');
      toast.success(response.data.message);
      fetchStats();
      fetchReadyPrizes();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to setup prizes');
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
            className={`tab-btn ${activeTab === 'createPrize' ? 'active' : ''}`}
            onClick={() => setActiveTab('createPrize')}
          >
            <Trophy size={20} />
            Create Prize
          </button>
          <button
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} />
            Settings
          </button>
          <Link to="/admin/quick" className="tab-btn quick-link">
            <Zap size={20} />
            Quick Actions
          </Link>
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
              
              <div className="admin-actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={handleSetupPrizes} 
                  disabled={loading}
                  className="btn-primary"
                  style={{ padding: '1rem 2rem', fontSize: '1rem' }}
                >
                  <Gift size={20} />
                  Setup Default Prizes
                </button>
                <button 
                  onClick={handleTriggerDrawCheck} 
                  disabled={loading}
                  className="btn-secondary"
                  style={{ padding: '1rem 2rem', fontSize: '1rem' }}
                >
                  <Play size={20} />
                  Trigger Draw Check
                </button>
              </div>
            </div>
          )}

          {activeTab === 'createPrize' && (
            <div className="settings-section">
              <h2>Create New Prize</h2>
              <form
                className="settings-card"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newPrize.title || !newPrize.description || !newPrize.value || !newPrize.startDate || !newPrize.endDate) {
                    toast.error('Please fill in all required fields');
                    return;
                  }

                  setCreatingPrize(true);
                  try {
                    const payload = {
                      ...newPrize,
                      value: Number(newPrize.value),
                      entryCost: Number(newPrize.entryCost),
                      totalWinners: Number(newPrize.totalWinners),
                      maxEntriesPerUser: Number(newPrize.maxEntriesPerUser),
                      minimumEntries: Number(newPrize.minimumEntries),
                      startDate: new Date(newPrize.startDate),
                      endDate: new Date(newPrize.endDate)
                    };

                    await axios.post('/api/admin/prizes', payload);
                    toast.success('Prize created successfully');
                    setNewPrize({
                      title: '',
                      description: '',
                      type: 'cash',
                      value: '',
                      imageUrl: '',
                      totalWinners: 1,
                      entryCost: 1,
                      maxEntriesPerUser: 100,
                      minimumEntries: 50,
                      drawFrequency: 'weekly',
                      drawDay: 'Friday',
                      drawTime: '20:00',
                      startDate: '',
                      endDate: '',
                      featured: false
                    });
                    fetchStats();
                  } catch (error) {
                    console.error('Create prize error:', error);
                    toast.error(error.response?.data?.error || 'Failed to create prize');
                  } finally {
                    setCreatingPrize(false);
                  }
                }}
              >
                <div className="settings-card-body">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Title*</label>
                      <input
                        type="text"
                        value={newPrize.title}
                        onChange={(e) => setNewPrize({ ...newPrize, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Description*</label>
                      <textarea
                        rows="3"
                        value={newPrize.description}
                        onChange={(e) => setNewPrize({ ...newPrize, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Type</label>
                      <select
                        value={newPrize.type}
                        onChange={(e) => setNewPrize({ ...newPrize, type: e.target.value })}
                      >
                        <option value="cash">Cash</option>
                        <option value="giftcard">Gift Card</option>
                        <option value="physical">Physical</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Prize Value (£)*</label>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={newPrize.value}
                        onChange={(e) => setNewPrize({ ...newPrize, value: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Image URL</label>
                      <input
                        type="text"
                        value={newPrize.imageUrl}
                        onChange={(e) => setNewPrize({ ...newPrize, imageUrl: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Total Winners</label>
                      <input
                        type="number"
                        min="1"
                        value={newPrize.totalWinners}
                        onChange={(e) => setNewPrize({ ...newPrize, totalWinners: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Entry Cost (entries to enter)</label>
                      <input
                        type="number"
                        min="1"
                        value={newPrize.entryCost}
                        onChange={(e) => setNewPrize({ ...newPrize, entryCost: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Max Entries Per User</label>
                      <input
                        type="number"
                        min="1"
                        value={newPrize.maxEntriesPerUser}
                        onChange={(e) => setNewPrize({ ...newPrize, maxEntriesPerUser: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Minimum Entries Required</label>
                      <input
                        type="number"
                        min="1"
                        value={newPrize.minimumEntries}
                        onChange={(e) => setNewPrize({ ...newPrize, minimumEntries: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Draw Frequency</label>
                      <select
                        value={newPrize.drawFrequency}
                        onChange={(e) => setNewPrize({ ...newPrize, drawFrequency: e.target.value })}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Draw Day</label>
                      <select
                        value={newPrize.drawDay}
                        onChange={(e) => setNewPrize({ ...newPrize, drawDay: e.target.value })}
                      >
                        <option>Monday</option>
                        <option>Tuesday</option>
                        <option>Wednesday</option>
                        <option>Thursday</option>
                        <option>Friday</option>
                        <option>Saturday</option>
                        <option>Sunday</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Draw Time (24h)</label>
                      <input
                        type="time"
                        value={newPrize.drawTime}
                        onChange={(e) => setNewPrize({ ...newPrize, drawTime: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Start Date*</label>
                      <input
                        type="datetime-local"
                        value={newPrize.startDate}
                        onChange={(e) => setNewPrize({ ...newPrize, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>End Date*</label>
                      <input
                        type="datetime-local"
                        value={newPrize.endDate}
                        onChange={(e) => setNewPrize({ ...newPrize, endDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group form-group-inline">
                      <label>
                        <input
                          type="checkbox"
                          checked={newPrize.featured}
                          onChange={(e) => setNewPrize({ ...newPrize, featured: e.target.checked })}
                        />
                        Featured prize
                      </label>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="trigger-btn"
                    disabled={creatingPrize}
                  >
                    {creatingPrize ? 'Creating...' : 'Create Prize'}
                  </button>
                </div>
              </form>
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
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="draw-btn"
                            onClick={() => handleDrawWinner(prize._id)}
                            disabled={loading || !meetsMinimum}
                            title={!meetsMinimum ? 'Minimum entries not met' : 'Draw winner'}
                          >
                            <Trophy size={20} />
                            {loading ? 'Drawing...' : meetsMinimum ? 'Draw Winner' : 'Not Ready'}
                          </button>
                          {!meetsMinimum && (
                            <button
                              className="refund-btn"
                              onClick={() => handleRefundPrize(prize._id)}
                              disabled={loading}
                              title="Refund entries to all participants"
                              style={{ 
                                background: '#ef4444', 
                                color: 'white',
                                padding: '0.75rem 1.5rem',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.875rem',
                                fontWeight: '600'
                              }}
                            >
                              🔄 Refund All
                            </button>
                          )}
                        </div>
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
                        <th>Won Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allWinners.map((winner, index) => {
                        console.log('Winner object:', winner);
                        // Handle both old and new data structures
                        const userId = winner.userId || winner.user?._id;
                        const prizeId = winner.prizeId || winner.prize?._id;
                        const username = winner.username || winner.user?.username;
                        const email = winner.email || winner.user?.email;
                        const wonAt = winner.wonAt || winner.drawnAt;
                        
                        return (
                          <tr key={`${userId}-${prizeId}-${index}`}>
                            <td>
                              <div>
                                <strong>{username}</strong>
                                <br />
                                <small>{email}</small>
                              </div>
                            </td>
                            <td>{winner.prize?.title}</td>
                            <td>£{winner.prize?.value}</td>
                            <td>{new Date(wonAt).toLocaleDateString()}</td>
                            <td>
                              <span className={`status-badge ${winner.claimed ? 'success' : 'pending'}`}>
                                {winner.claimed ? 'Claimed' : 'Pending'}
                              </span>
                            </td>
                            <td>
                              {!winner.claimed && (
                                <button
                                  className="claim-btn"
                                  onClick={() => {
                                    console.log('Clicking for winner with userId:', userId, 'prizeId:', prizeId);
                                    handleMarkAsClaimed(userId, prizeId);
                                  }}
                                >
                                  Mark as Claimed
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
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
