import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { Gift, Clock, Users, TrendingUp } from 'lucide-react';
import { mockPrizes } from '../mockData';
import { useAuth } from '../context/AuthContext';
import EntryProgress from '../components/EntryProgress';
import './Prizes.css';

const Prizes = () => {
  const { user } = useAuth();
  const [prizes, setPrizes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [userPrizeEntries, setUserPrizeEntries] = useState({});

  useEffect(() => {
    fetchPrizes();
    if (user) {
      fetchUserEntries();
    }
  }, [user]);

  const fetchPrizes = async () => {
    try {
      const response = await axios.get('/api/prizes');
      setPrizes(response.data.prizes);
    } catch (error) {
      console.error('Error fetching prizes:', error);
      // Use mock data if API fails
      setPrizes(mockPrizes);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserEntries = async () => {
    try {
      const response = await axios.get('/api/users/dashboard');
      if (response.data.prizeEntries) {
        // Create a map of prizeId -> entriesUsed
        const entriesMap = {};
        response.data.prizeEntries.forEach(entry => {
          if (entry.prize && entry.prize._id) {
            entriesMap[entry.prize._id] = entry.entriesUsed;
          }
        });
        setUserPrizeEntries(entriesMap);
      }
    } catch (error) {
      console.error('Error fetching user entries:', error);
    }
  };

  const filteredPrizes = prizes.filter(prize => {
    if (filter === 'all') return true;
    return prize.type === filter;
  });

  const getTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  if (loading) {
    return (
      <div className="prizes-page">
        <div className="loading">Loading prizes...</div>
      </div>
    );
  }

  return (
    <div className="prizes-page">
      <div className="prizes-header">
        <div className="container">
          <h1>Active Prizes</h1>
          <p>Browse all available prizes and enter to win</p>
        </div>
      </div>

      <div className="container">
        <div className="prizes-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Prizes
          </button>
          <button 
            className={`filter-btn ${filter === 'physical' ? 'active' : ''}`}
            onClick={() => setFilter('physical')}
          >
            Physical Items
          </button>
          <button 
            className={`filter-btn ${filter === 'giftcard' ? 'active' : ''}`}
            onClick={() => setFilter('giftcard')}
          >
            Gift Cards
          </button>
          <button 
            className={`filter-btn ${filter === 'cash' ? 'active' : ''}`}
            onClick={() => setFilter('cash')}
          >
            Cash
          </button>
        </div>

        {filteredPrizes.length === 0 ? (
          <div className="no-prizes">
            <Gift size={64} />
            <h2>No prizes available</h2>
            <p>Check back soon for new prizes!</p>
          </div>
        ) : (
          <div className="prizes-grid">
            {filteredPrizes.map(prize => (
              <Link to={`/prizes/${prize._id}`} key={prize._id} className="prize-card">
                <div className="prize-image">
                  {prize.imageUrl ? (
                    <img src={prize.imageUrl} alt={prize.title} />
                  ) : (
                    <div className="prize-placeholder">
                      <Gift size={64} />
                    </div>
                  )}
                  {prize.featured && <span className="featured-badge">Featured</span>}
                </div>
                
                <div className="prize-content">
                  <div className="prize-header">
                    <span className="prize-type">{prize.type}</span>
                    {prize.drawFrequency && (
                      <span className={`draw-frequency ${prize.drawFrequency}`}>
                        {prize.drawFrequency.toUpperCase()} DRAW
                      </span>
                    )}
                    <span className="prize-status">{prize.status}</span>
                  </div>
                  
                  <h3 className="prize-title">{prize.title}</h3>
                  <p className="prize-description">{prize.description}</p>
                  
                  <div className="prize-value">
                    <span className="value-label">Prize Value</span>
                    <span className="value-amount">£{prize.value}</span>
                  </div>
                  
                  <div className="prize-stats">
                    <div className="stat">
                      <Users size={16} />
                      <span>{prize.totalEntries} entries</span>
                    </div>
                    <div className="stat">
                      <Clock size={16} />
                      <span>{getTimeRemaining(prize.endDate)}</span>
                    </div>
                    <div className="stat">
                      <TrendingUp size={16} />
                      <span>{prize.entryCost} entry cost</span>
                    </div>
                  </div>

                  {user && (
                    <EntryProgress 
                      userEntries={userPrizeEntries[prize._id] || 0}
                      totalEntries={prize.totalEntries || 1}
                      prizeName={prize.title}
                    />
                  )}
                  
                  <button className="enter-btn">View Details</button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Prizes;
