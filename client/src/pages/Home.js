import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { Trophy, Gift, CheckSquare, Users, ArrowRight, Clock } from 'lucide-react';
import { mockPrizes } from '../mockData';
import RecentWinners from '../components/RecentWinners';
import CountdownTimer from '../components/CountdownTimer';
import WinnersTicker from '../components/WinnersTicker';
import WinnerAnnouncement from '../components/WinnerAnnouncement';
import './Home.css';

const Home = () => {
  const [featuredPrizes, setFeaturedPrizes] = useState([]);
  const [stats, setStats] = useState({ totalPrizes: 0, totalUsers: 0, totalWinners: 0 });
  const [latestWinner, setLatestWinner] = useState(null);
  
  // Check if signup bonus is still active
  const SIGNUP_BONUS_END = new Date('2025-12-20T23:59:59Z');
  const isBonusActive = new Date() < SIGNUP_BONUS_END;
  const daysLeft = Math.ceil((SIGNUP_BONUS_END - new Date()) / (1000 * 60 * 60 * 24));

  useEffect(() => {
    fetchFeaturedPrizes();
    // Check for new winners every 30 seconds
    const winnerInterval = setInterval(checkForNewWinners, 30000);
    return () => clearInterval(winnerInterval);
  }, []);

  const checkForNewWinners = async () => {
    try {
      const response = await axios.get('/api/winners/recent?limit=1');
      if (response.data.winners && response.data.winners.length > 0) {
        const winner = response.data.winners[0];
        // Only show if it's a recent win (within last 5 minutes)
        const winTime = new Date(winner.wonAt);
        const now = new Date();
        if ((now - winTime) < 5 * 60 * 1000) {
          setLatestWinner(winner);
        }
      }
    } catch (error) {
      console.error('Error checking for winners:', error);
    }
  };

  const fetchFeaturedPrizes = async () => {
    try {
      const response = await axios.get('/api/prizes');
      const featured = response.data.prizes.filter(p => p.featured).slice(0, 3);
      setFeaturedPrizes(featured);
    } catch (error) {
      console.error('Error fetching prizes:', error);
      // Use mock data if API fails
      const featured = mockPrizes.filter(p => p.featured).slice(0, 3);
      setFeaturedPrizes(featured);
    }
  };

  // Set next draw date (example: 7 days from now)
  const nextDrawDate = new Date();
  nextDrawDate.setDate(nextDrawDate.getDate() + 7);

  return (
    <div className="home">
      {/* Winner Announcement Popup */}
      {latestWinner && (
        <WinnerAnnouncement 
          winner={latestWinner} 
          onClose={() => setLatestWinner(null)} 
        />
      )}

      {/* Winners Ticker */}
      <WinnersTicker />

      {/* Signup Bonus Banner */}
      {isBonusActive && (
        <div className="container" style={{ marginTop: '2rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #FF8C00 0%, #FFB800 100%)',
            color: 'white',
            padding: '2rem',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 8px 20px rgba(255, 140, 0, 0.3)',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
              <Gift size={36} />
              <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: '800', color: '#1a1a1a' }}>
                LIMITED TIME OFFER!
              </h2>
            </div>
            <p style={{ fontSize: '1.5rem', margin: '0.75rem 0', fontWeight: '700', color: '#2d2d2d' }}>
              Sign up now and get <span style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1a1a1a' }}>500 FREE ENTRIES</span>
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Clock size={20} />
              <span style={{ fontSize: '1.1rem', color: '#2d2d2d', fontWeight: '600' }}>
                Ends December 20th • Only {daysLeft} days left!
              </span>
            </div>
            <Link 
              to="/register" 
              style={{
                display: 'inline-block',
                padding: '1rem 3rem',
                background: '#1a1a1a',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '1.1rem',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Claim Your 500 Free Entries →
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">YOUR NEXT BIG WIN STARTS HERE</h1>
          <p className="hero-subtitle">PS5 • Cash Prizes • iPhones • Gift Cards & More</p>
          <Link to="/prizes" className="hero-cta">
            Start Earning Entries
            <ArrowRight size={20} />
          </Link>
        </div>
        <div className="hero-decoration">
          <Trophy className="floating-icon icon-1" size={80} />
          <Gift className="floating-icon icon-2" size={60} />
          <Trophy className="floating-icon icon-3" size={70} />
        </div>
      </section>

      {/* Countdown Timer */}
      <div className="container">
        <CountdownTimer targetDate={nextDrawDate} title="Next Draw In" />
      </div>

      {/* Recent Winners Feed */}
      <RecentWinners />

      {/* Most Popular Prizes */}
      <section className="popular-prizes">
        <div className="container">
          <h2 className="section-title">Most Popular Prizes We Run</h2>
          
          <div className="prizes-grid">
            {featuredPrizes.map(prize => (
              <Link to={`/prizes/${prize._id}`} key={prize._id} className="prize-card">
                <div className="prize-image">
                  {prize.imageUrl ? (
                    <img src={prize.imageUrl} alt={prize.title} />
                  ) : (
                    <div className="prize-placeholder">
                      <Gift size={48} />
                    </div>
                  )}
                </div>
                <div className="prize-content">
                  <h3 className="prize-title">{prize.title}</h3>
                  <p className="prize-value">£{prize.value}</p>
                  <div className="prize-meta">
                    <span>{prize.totalEntries} entries</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
