import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import { Gift, AlertCircle } from 'lucide-react';
import './Admin.css';

const Admin = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

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
          <button 
            onClick={createDailyMystery}
            disabled={loading}
            className="admin-btn"
          >
            <Gift size={20} />
            {loading ? 'Creating...' : 'Create Daily Mystery Prize'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
