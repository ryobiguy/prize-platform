import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { Trophy, Gift, CheckSquare, Users, ArrowRight } from 'lucide-react';
import { mockPrizes } from '../mockData';
import RecentWinners from '../components/RecentWinners';
import './Home.css';

const Home = () => {
  const [featuredPrizes, setFeaturedPrizes] = useState([]);
  const [stats, setStats] = useState({ totalPrizes: 0, totalUsers: 0, totalWinners: 0 });

  useEffect(() => {
    fetchFeaturedPrizes();
  }, []);

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

  return (
    <div className="home">
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
