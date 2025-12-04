import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Gift, Clock, Users, TrendingUp, Trophy, ArrowLeft } from 'lucide-react';
import { mockPrizes } from '../mockData';
import './PrizeDetail.css';

const PrizeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [prize, setPrize] = useState(null);
  const [entries, setEntries] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrize();
  }, [id]);

  const fetchPrize = async () => {
    try {
      const response = await axios.get(`/api/prizes/${id}`);
      setPrize(response.data.prize);
      
      // Set default entries to entryCost if it's an instant win prize
      if (response.data.prize.isInstantWin && response.data.prize.entryCost) {
        setEntries(response.data.prize.entryCost);
      }
    } catch (error) {
      console.error('Error fetching prize:', error);
      // Use mock data if API fails
      const mockPrize = mockPrizes.find(p => p._id === id);
      if (mockPrize) {
        setPrize(mockPrize);
      } else {
        toast.error('Prize not found');
        navigate('/prizes');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = async () => {
    if (!user) {
      toast.error('Please login to enter');
      navigate('/login');
      return;
    }

    if (user.availableEntries < entries) {
      toast.error('Insufficient entries');
      return;
    }

    try {
      const response = await axios.post(`/api/prizes/${id}/enter`, { entries });
      
      // Check if instant win
      if (response.data.won !== undefined) {
        if (response.data.won) {
          toast.success(response.data.message, {
            duration: 5000,
            icon: '🎉',
            style: {
              background: '#4CAF50',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold'
            }
          });
        } else {
          toast(response.data.message, {
            duration: 3000,
            icon: '😔'
          });
        }
      } else {
        toast.success(`Entered with ${entries} entries!`);
      }
      
      updateUser({ availableEntries: response.data.remainingEntries });
      fetchPrize();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to enter');
    }
  };

  const getTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (loading) {
    return <div className="loading">Loading prize...</div>;
  }

  if (!prize) {
    return <div className="loading">Prize not found</div>;
  }

  const userEntry = prize.participants?.find(p => p.user === user?.id);
  const userEntries = userEntry?.entries || 0;

  return (
    <div className="prize-detail-page">
      <div className="container">
        {/* Two Column Layout */}
        <div className="prize-layout">
          {/* Left Column - Prize Display */}
          <div className="prize-section">
            <h2 className="section-heading">PRIZE</h2>
            <div className="prize-display">
              {prize.imageUrl ? (
                <img src={prize.imageUrl} alt={prize.title} />
              ) : (
                <div className="prize-placeholder">
                  <Gift size={80} />
                </div>
              )}
            </div>
            <div className="prize-info">
              <h1 className="prize-name">{prize.title}</h1>
              <p className="prize-value-large">£{prize.value}</p>
            </div>
          </div>

          {/* Right Column - Entry Controls */}
          <div className="tasks-section">
            <h2 className="section-heading">ENTER PRIZE DRAW</h2>
            <div className="tasks-list">
              {userEntries > 0 && (
                <div className="task-completed">
                  <Trophy size={20} />
                  <span>You have {userEntries} entries in this draw</span>
                </div>
              )}

              {prize.status === 'active' && user && (
                <div className="entry-controls">
                  <label>Enter with entries:</label>
                  <div className="entry-input-group">
                    <button 
                      onClick={() => setEntries(Math.max(1, entries - 1))}
                      className="entry-btn"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      value={entries}
                      onChange={(e) => setEntries(Math.max(1, Math.min(prize.maxEntriesPerUser - userEntries, parseInt(e.target.value) || 1)))}
                      min="1"
                      max={prize.maxEntriesPerUser - userEntries}
                    />
                    <button 
                      onClick={() => setEntries(Math.min(prize.maxEntriesPerUser - userEntries, user.availableEntries, entries + 1))}
                      className="entry-btn"
                    >
                      +
                    </button>
                  </div>
                  <p className="available-text">Available: {user.availableEntries} entries</p>
                  
                  <button 
                    className="enter-btn"
                    onClick={handleEnter}
                    disabled={entries < 1 || user.availableEntries < entries}
                  >
                    Enter Prize Draw
                  </button>
                </div>
              )}

              {!user && (
                <button 
                  className="enter-btn"
                  onClick={() => navigate('/login')}
                >
                  Login to Enter
                </button>
              )}

              <div className="task-info">
                <p>Need more entries?</p>
                <button className="view-tasks-btn" onClick={() => navigate('/buy-entries')}>
                  Buy Entries
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Information */}
        <div className="information-section">
          <h2 className="section-heading">INFORMATION ON PRIZE</h2>
          <div className="info-content">
            <p className="prize-description">{prize.description}</p>
            
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Type:</span>
                <span className="info-value">{prize.type}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Total Entries:</span>
                <span className="info-value">{prize.totalEntries}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Winners:</span>
                <span className="info-value">{prize.totalWinners}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Entry Cost:</span>
                <span className="info-value">{prize.entryCost} entries</span>
              </div>
              <div className="info-item">
                <span className="info-label">Time Remaining:</span>
                <span className="info-value">{getTimeRemaining(prize.endDate)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">End Date:</span>
                <span className="info-value">{new Date(prize.endDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizeDetail;
