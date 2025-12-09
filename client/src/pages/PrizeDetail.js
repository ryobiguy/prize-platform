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
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    fetchPrize();
  }, [id]);

  // Countdown timer for upcoming prizes
  useEffect(() => {
    if (!prize || prize.status !== 'upcoming') return;

    const updateCountdown = () => {
      const now = new Date();
      const start = new Date(prize.startDate);
      const diff = start - now;

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [prize]);

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

    if (entries < 1) {
      toast.error('Please select at least 1 entry');
      return;
    }

    try {
      const loadingToast = toast.loading('Processing entry...');
      
      // Create Square payment link (or process free entry)
      const response = await axios.post(`/api/prizes/${id}/create-payment`, {
        numberOfEntries: entries
      });

      toast.dismiss(loadingToast);

      if (response.data.freeEntry) {
        // Entry was free (covered by cash balance)
        toast.success('🎉 ' + response.data.message);
        fetchPrize(); // Refresh prize data
        updateUser(); // Refresh user data to show updated balance
      } else if (response.data.url) {
        // Redirect to Square payment page
        window.location.href = response.data.url;
      } else {
        toast.error('Failed to create payment link');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.error || 'Failed to create payment. Please try again.');
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
              <>
                <div className="prize-icons-grid">
                  <img src="/prizes/amazongf.jpg" alt="Amazon Gift Card" className="prize-icon-item" />
                  <img src="/prizes/jegf.jpg" alt="Just Eat Voucher" className="prize-icon-item" />
                  <img src="/prizes/ubereatsgf.jpg" alt="Uber Eats Voucher" className="prize-icon-item" />
                  <img src="/prizes/steamgf.jpg" alt="Steam Gift Card" className="prize-icon-item" />
                  <img src="/prizes/netflixgf.jpg" alt="Netflix Gift Card" className="prize-icon-item" />
                  <img src="/prizes/cashgiftcard.jpg" alt="Cash Prize" className="prize-icon-item" />
                  <img src="/prizes/headphones.jpg" alt="Sony Headphones" className="prize-icon-item" />
                </div>
                
                {/* Prize Pool List - Below Gift Cards */}
                {prize.prizePool && prize.prizePool.length > 0 && (
                  <div className="prize-pool-section-left">
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
              </>
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

              {/* Countdown for upcoming prizes */}
              {prize.status === 'upcoming' && (
                <div className="upcoming-countdown">
                  <h3>Prize Starts In:</h3>
                  <div className="countdown-display">
                    <div className="countdown-unit">
                      <span className="countdown-value">{countdown.days}</span>
                      <span className="countdown-label">Days</span>
                    </div>
                    <div className="countdown-separator">:</div>
                    <div className="countdown-unit">
                      <span className="countdown-value">{countdown.hours}</span>
                      <span className="countdown-label">Hours</span>
                    </div>
                    <div className="countdown-separator">:</div>
                    <div className="countdown-unit">
                      <span className="countdown-value">{countdown.minutes}</span>
                      <span className="countdown-label">Minutes</span>
                    </div>
                    <div className="countdown-separator">:</div>
                    <div className="countdown-unit">
                      <span className="countdown-value">{countdown.seconds}</span>
                      <span className="countdown-label">Seconds</span>
                    </div>
                  </div>
                  <p className="start-date-text">
                    Starts on {new Date(prize.startDate).toLocaleDateString('en-GB', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}

              {prize.status === 'active' && user && (() => {
                const totalCost = entries * (prize.entryPrice || 1);
                const cashBalance = user.cashBalance || 0;
                const discount = Math.min(cashBalance, totalCost);
                const finalCost = Math.max(0, totalCost - discount);
                
                return (
                  <div className="entry-controls">
                    <label>Number of entries:</label>
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
                        min={1}
                        max={prize.maxEntriesPerUser - userEntries}
                      />
                      <button 
                        onClick={() => setEntries(Math.min(prize.maxEntriesPerUser - userEntries, entries + 1))}
                        className="entry-btn"
                      >
                        +
                      </button>
                    </div>
                    <div className="entry-info-text">
                      <p className="available-text">Price per entry: £{prize.entryPrice?.toFixed(2) || '1.00'}</p>
                      <p className="minimum-text">Total cost: £{totalCost.toFixed(2)}</p>
                      {discount > 0 && (
                        <>
                          <p className="discount-text" style={{color: '#10b981', fontWeight: '600'}}>Credit applied: -£{discount.toFixed(2)}</p>
                          <p className="final-cost-text" style={{fontSize: '1.1rem', fontWeight: '700'}}>Final cost: £{finalCost.toFixed(2)}</p>
                        </>
                      )}
                    </div>
                    
                    <button 
                      className="enter-btn"
                      onClick={handleEnter}
                      disabled={entries < 1}
                    >
                      {finalCost === 0 ? 'Enter FREE!' : `Pay £${finalCost.toFixed(2)} & Enter`}
                    </button>
                  </div>
                );
              })()}

              {!user && (
                <button 
                  className="enter-btn"
                  onClick={() => navigate('/login')}
                >
                  Login to Enter
                </button>
              )}

              {/* How It Works Section */}
              <div className="how-it-works">
                <h3 className="how-it-works-heading">How It Works</h3>
                <div className="how-it-works-steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h4>Enter the Draw</h4>
                      <p>Use your entries to enter this prize draw</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h4>Wait for Draw</h4>
                      <p>{prize.isInstantWin ? 'Instant win - find out immediately!' : 'Winners announced on draw date'}</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h4>Claim Your Prize</h4>
                      <p>Winners notified via email and dashboard</p>
                    </div>
                  </div>
                </div>
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
