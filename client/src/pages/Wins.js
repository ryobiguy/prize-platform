import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { Trophy, Calendar, Gift, CheckCircle, Clock, Mail, X } from 'lucide-react';
import toast from 'react-hot-toast';
import './Wins.css';

const Wins = () => {
  const [wins, setWins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claimingWin, setClaimingWin] = useState(null);
  const [claimMessage, setClaimMessage] = useState('');

  useEffect(() => {
    fetchWins();
  }, []);

  const fetchWins = async () => {
    try {
      const response = await axios.get('/api/users/wins');
      console.log('Wins response:', response.data);
      setWins(response.data.wins || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching wins:', error);
      setError(error.response?.data?.error || 'Failed to load wins');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimClick = (win) => {
    setClaimingWin(win);
    setClaimMessage('');
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    
    if (!claimMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      await axios.post('/api/users/claim-prize', {
        winId: claimingWin._id,
        prizeTitle: claimingWin.prize.title,
        message: claimMessage
      });
      
      toast.success('Claim request sent! We\'ll contact you soon.');
      setClaimingWin(null);
      setClaimMessage('');
      fetchWins();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send claim request');
    }
  };

  if (loading) {
    return (
      <div className="wins-page">
        <div className="container" style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Loading your wins...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wins-page">
        <div className="container" style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Error Loading Wins</h2>
          <p>{error}</p>
          <button onClick={fetchWins} style={{ marginTop: '20px', padding: '10px 20px' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wins-page">
      <div className="wins-header">
        <div className="container">
          <Trophy size={48} />
          <h1>Your Wins</h1>
          <p>Congratulations on your prizes!</p>
        </div>
      </div>

      <div className="container">
        {wins.length === 0 ? (
          <div className="no-wins">
            <Gift size={64} />
            <h2>No wins yet</h2>
            <p>Keep entering prize draws for your chance to win!</p>
            <Link to="/prizes" className="browse-btn">Browse Prizes</Link>
          </div>
        ) : (
          <div className="wins-grid">
            {wins.filter(win => win.prize).map((win, index) => (
              <div key={index} className={`win-card ${win.claimed ? 'claimed' : 'unclaimed'}`}>
                <div className="win-card-header">
                  <Trophy size={32} className="win-trophy" />
                  {win.claimed ? (
                    <span className="win-badge claimed-badge">
                      <CheckCircle size={16} />
                      Claimed
                    </span>
                  ) : (
                    <span className="win-badge unclaimed-badge">
                      <Clock size={16} />
                      Pending
                    </span>
                  )}
                </div>

                <div className="win-card-content">
                  <h3>{win.prizeName || win.prize?.title || 'Prize'}</h3>
                  <p className="win-type">{win.prizeType || win.prize?.type || 'N/A'}</p>
                  <div className="win-value">
                    <span className="value-label">Prize Value</span>
                    <span className="value-amount">£{win.prizeValue || win.prize?.value || 0}</span>
                  </div>

                  <div className="win-meta">
                    <div className="meta-item">
                      <Calendar size={14} />
                      <span>Won on {new Date(win.wonAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {!win.claimed && win.prize && (
                    <>
                      <div className="win-instructions">
                        <h4>Next Steps:</h4>
                        <ol>
                          <li>Click below to claim your prize</li>
                          <li>Provide your delivery/contact details</li>
                          <li>We'll process and send your prize!</li>
                        </ol>
                      </div>
                      <button 
                        onClick={() => handleClaimClick(win)}
                        className="contact-claim-btn"
                      >
                        <Mail size={18} />
                        Claim Prize
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {wins.length > 0 && (
          <div className="wins-footer">
            <p>
              If you have any questions about claiming your prize, please{' '}
              <Link to="/contact">contact us</Link>.
            </p>
          </div>
        )}
      </div>

      {/* Claim Modal */}
      {claimingWin && (
        <div className="claim-modal-overlay" onClick={() => setClaimingWin(null)}>
          <div className="claim-modal" onClick={(e) => e.stopPropagation()}>
            <div className="claim-modal-header">
              <h2>Claim Your Prize</h2>
              <button onClick={() => setClaimingWin(null)} className="close-btn">
                <X size={24} />
              </button>
            </div>
            
            <div className="claim-modal-content">
              <div className="prize-info">
                <Trophy size={32} color="#ff8c00" />
                <div>
                  <h3>{claimingWin.prizeName || claimingWin.prize?.title}</h3>
                  <p>Value: £{claimingWin.prizeValue || claimingWin.prize?.value}</p>
                </div>
              </div>

              <form onSubmit={handleClaimSubmit}>
                <div className="form-group">
                  <label htmlFor="claimMessage">
                    Please provide your contact details and delivery address:
                  </label>
                  <textarea
                    id="claimMessage"
                    value={claimMessage}
                    onChange={(e) => setClaimMessage(e.target.value)}
                    placeholder="Full Name:&#10;Email:&#10;Phone Number:&#10;Delivery Address:&#10;&#10;Any additional notes..."
                    rows="8"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="button" onClick={() => setClaimingWin(null)} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    <Mail size={18} />
                    Submit Claim
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wins;
