import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { Trophy, Calendar, Gift, CheckCircle, Clock } from 'lucide-react';
import './Wins.css';

const Wins = () => {
  const [wins, setWins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWins();
  }, []);

  const fetchWins = async () => {
    try {
      const response = await axios.get('/api/users/wins');
      setWins(response.data.wins || []);
    } catch (error) {
      console.error('Error fetching wins:', error);
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
            {wins.map((win, index) => (
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
                  <h3>{win.prize.title}</h3>
                  <p className="win-type">{win.prize.type}</p>
                  <div className="win-value">
                    <span className="value-label">Prize Value</span>
                    <span className="value-amount">£{win.prize.value}</span>
                  </div>

                  <div className="win-meta">
                    <div className="meta-item">
                      <Calendar size={14} />
                      <span>Won on {new Date(win.wonAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {!win.claimed && (
                    <div className="win-instructions">
                      <h4>Next Steps:</h4>
                      <ol>
                        <li>We'll contact you within 48 hours</li>
                        <li>Provide your delivery/contact details</li>
                        <li>Receive your prize!</li>
                      </ol>
                    </div>
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
