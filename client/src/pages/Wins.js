import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { Trophy, Calendar, Gift, CheckCircle, Clock, Mail } from 'lucide-react';
import './Wins.css';

const Wins = () => {
  const [wins, setWins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
                  <h3>{win.prize?.title || 'Prize'}</h3>
                  <p className="win-type">{win.prize?.type || 'N/A'}</p>
                  <div className="win-value">
                    <span className="value-label">Prize Value</span>
                    <span className="value-amount">£{win.prize?.value || 0}</span>
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
                          <li>Contact us to claim your prize</li>
                          <li>Provide your delivery/contact details</li>
                          <li>Receive your prize!</li>
                        </ol>
                      </div>
                      <a 
                        href={`mailto:totalraffle@mail.com?subject=Prize Claim - ${win.prize.title}&body=Hi Total Raffle Team,%0D%0A%0D%0AI am writing to claim my prize: ${win.prize.title}%0D%0A%0D%0AMy account details:%0D%0AUsername: [Your username]%0D%0AEmail: [Your email]%0D%0A%0D%0APlease let me know the next steps to receive my prize.%0D%0A%0D%0AThank you!`}
                        className="contact-claim-btn"
                      >
                        <Mail size={18} />
                        Contact Us to Claim Prize
                      </a>
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
    </div>
  );
};

export default Wins;
