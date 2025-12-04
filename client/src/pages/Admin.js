import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import { Gift, AlertCircle } from 'lucide-react';
import './Admin.css';

const Admin = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [clearing, setClearing] = useState(false);

  const clearWinners = async () => {
    if (!window.confirm('⚠️ This will clear ALL test winners from the database. Are you sure?')) {
      return;
    }
    
    setClearing(true);
    try {
      const response = await axios.delete('/api/admin/clear-winners');
      toast.success(`✅ ${response.data.message}\n${response.data.winnersCleared} winners cleared`);
    } catch (error) {
      console.error('Clear winners error:', error);
      toast.error(error.response?.data?.error || 'Failed to clear winners');
    } finally {
      setClearing(false);
    }
  };

  const createDailyMystery = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/prizes/admin/create-daily-mystery');
      toast.success(response.data.message);
      console.log('Prize created:', response.data.prize);
    } catch (error) {
      console.error('Create prize error:', error);
      const errorMsg = error.response?.data?.details || error.response?.data?.error || 'Failed to create prize';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const deleteDailyMystery = async () => {
    if (!window.confirm('Are you sure you want to delete the Daily Mystery Prize?')) {
      return;
    }
    
    setDeleting(true);
    try {
      const response = await axios.delete('/api/prizes/admin/delete-daily-mystery');
      toast.success(response.data.message);
    } catch (error) {
      console.error('Delete prize error:', error);
      const errorMsg = error.response?.data?.details || error.response?.data?.error || 'Failed to delete prize';
      toast.error(errorMsg);
    } finally {
      setDeleting(false);
    }
  };

  if (!user || !user.isAdmin) {
    return (
      <div className="admin-page">
        <div className="container" style={{ padding: '40px', textAlign: 'center' }}>
          <AlertCircle size={64} color="#ef4444" />
          <h2>Access Denied</h2>
          <p>You must be an admin to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container">
          <h1>Admin Panel</h1>
          <p>Manage prizes and platform settings</p>
        </div>
      </div>

      <div className="container">
        <div className="admin-section">
          <h2>Daily Mystery Prize Pool</h2>
          <p>Create the instant win daily mystery prize with 30 prizes</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={createDailyMystery}
              disabled={loading}
              className="admin-btn"
            >
              <Gift size={20} />
              {loading ? 'Creating...' : 'Create Daily Mystery Prize'}
            </button>
            <button 
              onClick={deleteDailyMystery}
              disabled={deleting}
              className="admin-btn danger"
            >
              {deleting ? 'Deleting...' : 'Delete Daily Mystery Prize'}
            </button>
          </div>
        </div>

        <div className="admin-section" style={{ marginTop: '2rem' }}>
          <h2>🧹 Clear Test Data</h2>
          <p>Remove all test winners before launch (irreversible!)</p>
          <button 
            onClick={clearWinners}
            disabled={clearing}
            className="admin-btn danger"
            style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' }}
          >
            <AlertCircle size={20} />
            {clearing ? 'Clearing...' : 'Clear All Test Winners'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
