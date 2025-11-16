import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Zap, Star, Crown, Award, ArrowRight, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Tasks.css';

const Tasks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const entryPackages = [
    {
      id: 'starter',
      name: 'Starter Pack',
      entries: 100,
      price: 0.99,
      icon: Zap,
      color: '#3b82f6',
      description: 'Perfect for trying your luck'
    },
    {
      id: 'popular',
      name: 'Popular Pack',
      entries: 500,
      price: 3.99,
      bonus: 50,
      icon: Star,
      color: '#f59e0b',
      popular: true,
      description: 'Best value for regular players'
    },
    {
      id: 'mega',
      name: 'Mega Pack',
      entries: 1000,
      price: 6.99,
      bonus: 200,
      icon: Crown,
      color: '#8b5cf6',
      description: 'For serious prize hunters'
    }
  ];

  const handleBuyEntries = () => {
    navigate('/buy-entries');
  };


  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div className="container">
          <h1>Get More Entries</h1>
          <p>Purchase entries instantly to increase your chances of winning amazing prizes!</p>
          <div className="user-stats">
            <div className="stat-card">
              <Award size={24} />
              <div>
                <div className="stat-value">{user?.availableEntries || 0}</div>
                <div className="stat-label">Available Entries</div>
              </div>
            </div>
            <div className="stat-card">
              <Gift size={24} />
              <div>
                <div className="stat-value">{user?.totalEntries || 0}</div>
                <div className="stat-label">Total Entries Purchased</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="entry-packages-section">
          <h2>Choose Your Entry Package</h2>
          <p>All packages include instant delivery and never expire!</p>
          
          <div className="packages-preview">
            {entryPackages.map((pkg) => {
              const Icon = pkg.icon;
              const totalEntries = pkg.entries + (pkg.bonus || 0);
              
              return (
                <div 
                  key={pkg.id} 
                  className={`package-preview-card ${pkg.popular ? 'popular' : ''}`}
                  style={{ '--accent-color': pkg.color }}
                >
                  {pkg.popular && (
                    <div className="popular-badge">
                      <Star size={16} />
                      Most Popular
                    </div>
                  )}
                  
                  <div className="package-icon">
                    <Icon size={32} />
                  </div>
                  
                  <h3>{pkg.name}</h3>
                  <p className="package-description">{pkg.description}</p>
                  
                  <div className="package-entries">
                    <span className="entries-count">{totalEntries.toLocaleString()}</span>
                    <span className="entries-label">entries</span>
                  </div>
                  
                  <div className="package-price">
                    <span className="currency">£</span>
                    <span className="amount">{pkg.price.toFixed(2)}</span>
                  </div>
                  
                  {pkg.bonus && (
                    <div className="bonus-badge">
                      +{pkg.bonus} BONUS!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="buy-entries-cta">
            <button className="buy-entries-btn" onClick={handleBuyEntries}>
              <CreditCard size={20} />
              View All Packages
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="why-buy-entries">
          <h2>Why Buy Entries?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <Zap size={32} />
              </div>
              <h3>Instant Delivery</h3>
              <p>Entries are added to your account immediately after purchase</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <Award size={32} />
              </div>
              <h3>Better Odds</h3>
              <p>More entries = higher chances of winning amazing prizes</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <Gift size={32} />
              </div>
              <h3>Never Expire</h3>
              <p>Your entries never expire - use them on any current or future draw</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <CreditCard size={32} />
              </div>
              <h3>Secure Payment</h3>
              <p>All payments processed securely through Stripe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
