import React, { useState, useEffect } from 'react';
import { Gift, ExternalLink, TrendingUp, DollarSign } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './OfferWall.css';

const OfferWall = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    completedOffers: 0,
    totalEarned: 0
  });

  const publisherId = process.env.REACT_APP_ADGATE_PUBLISHER_ID;
  const offerWallUrl = `https://wall.adgaterewards.com/${publisherId}/${userId}`;

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await axios.get('/api/offers/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching offer stats:', error);
    }
  };

  return (
    <div className="offer-wall-container">
      <div className="offer-wall-header">
        <div className="header-content">
          <div className="header-icon">
            <Gift size={32} />
          </div>
          <div className="header-text">
            <h2>Complete Offers & Earn Entries</h2>
            <p>Watch videos, complete surveys, and try apps to earn free entries</p>
          </div>
        </div>

        <div className="offer-stats">
          <div className="stat-item">
            <TrendingUp size={20} />
            <div>
              <div className="stat-value">{stats.completedOffers}</div>
              <div className="stat-label">Offers Completed</div>
            </div>
          </div>
          <div className="stat-item">
            <DollarSign size={20} />
            <div>
              <div className="stat-value">{stats.totalEarned}</div>
              <div className="stat-label">Total Entries Earned</div>
            </div>
          </div>
        </div>
      </div>

      <div className="offer-wall-info">
        <div className="info-card">
          <h3>How It Works</h3>
          <ol>
            <li>Browse available offers below</li>
            <li>Complete the offer requirements</li>
            <li>Earn entries automatically</li>
            <li>Use entries to enter prize draws</li>
          </ol>
        </div>

        <div className="info-card highlight">
          <h3>💡 Pro Tips</h3>
          <ul>
            <li>Video ads are the quickest (30 seconds)</li>
            <li>Surveys pay the most entries</li>
            <li>App installs give bonus entries</li>
            <li>Check back daily for new offers</li>
          </ul>
        </div>
      </div>

      <div className="offer-wall-frame">
        {publisherId ? (
          <iframe
            src={offerWallUrl}
            width="100%"
            height="800px"
            frameBorder="0"
            title="AdGate Offer Wall"
            className="offer-iframe"
          />
        ) : (
          <div className="offer-wall-placeholder">
            <Gift size={64} />
            <h3>Offer Wall Not Configured</h3>
            <p>Please add your AdGate Publisher ID to the .env file</p>
            <code>REACT_APP_ADGATE_PUBLISHER_ID=your_id_here</code>
          </div>
        )}
      </div>

      <div className="offer-wall-footer">
        <p>
          <strong>Note:</strong> Entries are credited automatically after offer completion. 
          If you don't receive entries within 24 hours, please contact support.
        </p>
      </div>
    </div>
  );
};

export default OfferWall;
