import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { Gift, Clock, Users, TrendingUp } from 'lucide-react';
import { mockPrizes } from '../mockData';
import { useAuth } from '../context/AuthContext';
import EntryProgress from '../components/EntryProgress';
import PrizeCountdown from '../components/PrizeCountdown';
import './Prizes.css';

const Prizes = () => {
  const { user } = useAuth();
  const [prizes, setPrizes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
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
      // Try to get user's prize entries from the me endpoint
      const response = await axios.get('/api/auth/me');
      console.log('User data:', response.data);
      
      if (response.data.user && response.data.user.prizeEntries) {
        // Create a map of prizeId -> total entriesUsed (sum all entries for same prize)
        const entriesMap = {};
        response.data.user.prizeEntries.forEach(entry => {
          console.log('Entry structure:', entry);
          // Try different possible field names for the prize ID
          const prizeId = entry.prize?._id || entry.prize || entry.prizeId;
          if (prizeId) {
            const entryAmount = entry.entriesUsed || entry.entries || 0;
            // Sum up entries if user entered multiple times
            entriesMap[prizeId] = (entriesMap[prizeId] || 0) + entryAmount;
          }
        });
        console.log('User entries map:', entriesMap);
        setUserPrizeEntries(entriesMap);
      }
    } catch (error) {
      console.error('Error fetching user entries:', error);
    }
  };

  const filteredPrizes = prizes
    .filter(prize => {
      const typeMatch = filter === 'all' || prize.type === filter;
      const categoryMatch = categoryFilter === 'all' || prize.category === categoryFilter;
      return typeMatch && categoryMatch;
    })
    .sort((a, b) => {
      // Sort upcoming prizes to the bottom
      if (a.status === 'upcoming' && b.status !== 'upcoming') return 1;
      if (a.status !== 'upcoming' && b.status === 'upcoming') return -1;
      return 0;
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
          <div className="filter-group">
            <label>Type:</label>
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'physical' ? 'active' : ''}`}
              onClick={() => setFilter('physical')}
            >
              Physical
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

          <div className="filter-group">
            <label>Category:</label>
            <button 
              className={`filter-btn ${categoryFilter === 'all' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${categoryFilter === 'gaming' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('gaming')}
            >
              🎮 Gaming
            </button>
            <button 
              className={`filter-btn ${categoryFilter === 'tech' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('tech')}
            >
              💻 Tech
            </button>
            <button 
              className={`filter-btn ${categoryFilter === 'cash' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('cash')}
            >
              💰 Cash
            </button>
            <button 
              className={`filter-btn ${categoryFilter === 'giftcards' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('giftcards')}
            >
              🎁 Gift Cards
            </button>
          </div>
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
                  {prize.status === 'upcoming' && (
                    <div className="coming-soon-overlay">
                      <Clock size={48} />
                      <span>COMING SOON</span>
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
                  
                  {!prize.isInstantWin && (
                    <div className="prize-value">
                      <span className="value-label">Prize Value</span>
                      <span className="value-amount">£{prize.value}</span>
                    </div>
                  )}
                  
                  {prize.isInstantWin && prize.prizePool && (
                    <div className="prize-value">
                      <span className="value-label">Prize Pool</span>
                      <span className="value-amount">Multiple Prizes</span>
                    </div>
                  )}
                  
                  <div className="prize-stats">
                    <div className="stat">
                      <Users size={16} />
                      <span>{prize.totalEntries} entries</span>
                    </div>
                    <div className="stat">
                      <TrendingUp size={16} />
                      <span>£{prize.entryPrice?.toFixed(2) || '1.00'} per entry</span>
                    </div>
                  </div>
                  
                  {/* Countdown Timer */}
                  {prize.endDate && prize.status === 'active' && (
                    <PrizeCountdown endDate={prize.endDate} />
                  )}
                  
                  {/* Only show minimum entries for non-instant-win prizes */}
                  {prize.minimumEntries && !prize.isInstantWin && (
                    <div className="minimum-entries-info">
                      <span className="minimum-label">
                        Minimum to draw: {prize.minimumEntries} entries
                      </span>
                      <div className="minimum-progress">
                        <div 
                          className="minimum-fill" 
                          style={{ 
                            width: `${Math.min((prize.totalEntries / prize.minimumEntries) * 100, 100)}%`,
                            backgroundColor: prize.totalEntries >= prize.minimumEntries ? '#10b981' : '#f59e0b'
                          }}
                        />
                      </div>
                      <span className="minimum-status">
                        {prize.totalEntries >= prize.minimumEntries 
                          ? '✅ Minimum reached!' 
                          : `${prize.minimumEntries - prize.totalEntries} more needed`}
                      </span>
                    </div>
                  )}

                  {user && (
                    <EntryProgress 
                      userEntries={userPrizeEntries[prize._id] || 0}
                      totalEntries={prize.totalEntries || 1}
                      prizeName={prize.title}
                    />
                  )}
                  {user && console.log('Prize:', prize.title, 'User entries:', userPrizeEntries[prize._id], 'Total:', prize.totalEntries)}
                  
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
