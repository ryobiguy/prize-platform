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
  const [recentEntries, setRecentEntries] = useState(0);

  useEffect(() => {
    fetchPrize();
  }, [id]);

  const fetchPrize = async () => {
    try {
      const response = await axios.get(`/api/prizes/${id}`);
      setPrize(response.data.prize);
      setRecentEntries(response.data.recentEntries || 0);
      
      // Set default entries to entryCost (minimum required)
      if (response.data.prize.entryCost) {
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

    if (entries < prize.entryCost) {
      toast.error(`Minimum ${prize.entryCost} entries required`);
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
            <h2 className="section-heading">{prize.isInstantWin ? 'INSTANT WIN PRIZE' : 'PRIZE'}</h2>
            <div className="prize-display">
              {prize.imageUrl ? (
                <img src={prize.imageUrl} alt={prize.title} />
              ) : (
                <div className="prize-placeholder">
                  <Gift size={80} />
                </div>
              )}
            </div>
            
            {/* Gift Card Icons Grid - Below Mystery Prize Image */}
            {prize.isInstantWin && (
              <div className="prize-icons-grid">
                <img src="/prizes/amazongf.jpg" alt="Amazon Gift Card" className="prize-icon-item" />
                <img src="/prizes/jegf.jpg" alt="Just Eat Voucher" className="prize-icon-item" />
                <img src="/prizes/ubereatsgf.jpg" alt="Uber Eats Voucher" className="prize-icon-item" />
                <img src="/prizes/steamgf.jpg" alt="Steam Gift Card" className="prize-icon-item" />
                <img src="/prizes/netflixgf.jpg" alt="Netflix Gift Card" className="prize-icon-item" />
              </div>
            )}
            
            {!prize.isInstantWin && (
              <div className="prize-info">
                <h1 className="prize-name">{prize.title}</h1>
                <p className="prize-value-large">£{prize.value}</p>
              </div>
            )}
          </div>

          {/* Right Column - Entry Controls */}
          <div className="tasks-section">
            <h2 className="section-heading">ENTER PRIZE DRAW</h2>
            <div className="tasks-list">
              {/* Social Proof & Urgency Indicators */}
              <div className="urgency-indicators">
                {recentEntries > 0 && (
                  <div className="urgency-badge hot">
                    <TrendingUp size={16} />
                    <span>{recentEntries} {recentEntries === 1 ? 'person' : 'people'} entered in the last hour</span>
                  </div>
                )}
                
                {prize.isInstantWin && prize.prizePool && (
                  (() => {
                    const totalRemaining = prize.prizePool.reduce((sum, p) => sum + p.remaining, 0);
                    if (totalRemaining > 0 && totalRemaining <= 20) {
                      return (
                        <div className="urgency-badge warning">
                          <Gift size={16} />
                          <span>Only {totalRemaining} prize{totalRemaining !== 1 ? 's' : ''} left!</span>
                        </div>
                      );
                    }
                    return null;
                  })()
                )}
              </div>

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
                      onClick={() => setEntries(Math.max(prize.entryCost, entries - 1))}
                      className="entry-btn"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      value={entries}
                      onChange={(e) => setEntries(Math.max(prize.entryCost, Math.min(prize.maxEntriesPerUser - userEntries, parseInt(e.target.value) || prize.entryCost)))}
                      min={prize.entryCost}
                      max={prize.maxEntriesPerUser - userEntries}
                    />
                    <button 
                      onClick={() => setEntries(Math.min(prize.maxEntriesPerUser - userEntries, user.availableEntries, entries + 1))}
                      className="entry-btn"
                    >
                      +
                    </button>
                  </div>
                  <div className="entry-info-text">
                    <p className="available-text">Available: {user.availableEntries} entries</p>
                    <p className="minimum-text">Minimum: {prize.entryCost} entries</p>
                  </div>
                  
                  <button 
                    className="enter-btn"
                    onClick={handleEnter}
                    disabled={entries < prize.entryCost || user.availableEntries < entries}
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

              {/* Prize Pool List - Below Buy Entries */}
              {prize.isInstantWin && prize.prizePool && prize.prizePool.length > 0 && (
                <div className="prize-pool-section">
                  <h3 className="prize-pool-heading">Potential Prizes</h3>
                  <ul className="prize-pool-items-compact">
                    {prize.prizePool.map((item, index) => (
                      <li key={index}>
                        <span className="pool-item-name">{item.name}</span>
                        <span className="pool-item-value">£{item.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
