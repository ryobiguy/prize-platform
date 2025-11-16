import React, { useState } from 'react';
import { CreditCard, Zap, Star, Crown, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import './BuyEntries.css';

// Buy Entries Page - Stripe Integration

const BuyEntries = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const packages = [
    {
      id: 'starter',
      name: 'Starter Pack',
      entries: 100,
      price: 0.99,
      priceId: 'price_starter', // Will be replaced with real Stripe price ID
      popular: false,
      icon: Zap,
      color: '#3b82f6'
    },
    {
      id: 'popular',
      name: 'Popular Pack',
      entries: 500,
      price: 3.99,
      priceId: 'price_popular',
      popular: true,
      bonus: 25,
      icon: Star,
      color: '#f59e0b'
    },
    {
      id: 'mega',
      name: 'Mega Pack',
      entries: 1000,
      price: 6.99,
      priceId: 'price_mega',
      popular: false,
      bonus: 100,
      icon: Crown,
      color: '#8b5cf6'
    },
    {
      id: 'ultimate',
      name: 'Ultimate Pack',
      entries: 1200,
      price: 14.99,
      priceId: 'price_ultimate',
      popular: false,
      bonus: 300,
      icon: Crown,
      color: '#ec4899'
    }
  ];

  const handlePurchase = async (pkg) => {
    if (!user) {
      toast.error('Please login to purchase entries');
      return;
    }

    setLoading(true);
    try {
      // Create Stripe checkout session
      const response = await axios.post('/api/payments/create-checkout', {
        packageId: pkg.id,
        priceId: pkg.priceId,
        entries: pkg.entries + (pkg.bonus || 0),
        amount: pkg.price
      });

      // Open Square checkout in a new tab so the app stays open
      if (response.data.url) {
        window.open(response.data.url, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error(error.response?.data?.error || 'Failed to process purchase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buy-entries-page">
      <div className="buy-entries-header">
        <div className="container">
          <h1>Buy Entries</h1>
          <p>Get more entries instantly and increase your chances of winning!</p>
        </div>
      </div>

      <div className="container">
        <div className="packages-grid">
          {packages.map((pkg) => {
            const Icon = pkg.icon;
            const totalEntries = pkg.entries + (pkg.bonus || 0);
            const pricePerEntry = (pkg.price / totalEntries).toFixed(3);

            return (
              <div 
                key={pkg.id} 
                className={`package-card ${pkg.popular ? 'popular' : ''}`}
                style={{ '--accent-color': pkg.color }}
              >
                {pkg.popular && (
                  <div className="popular-badge">
                    <Star size={16} />
                    Most Popular
                  </div>
                )}

                <div className="package-icon">
                  <Icon size={48} />
                </div>

                <h3>{pkg.name}</h3>
                
                <div className="package-price">
                  <span className="currency">£</span>
                  <span className="amount">{pkg.price.toFixed(2)}</span>
                </div>

                <div className="package-entries">
                  <div className="base-entries">
                    {pkg.entries.toLocaleString()} entries
                  </div>
                  {pkg.bonus && (
                    <div className="bonus-entries">
                      + {pkg.bonus} BONUS entries!
                    </div>
                  )}
                  <div className="total-entries">
                    = {totalEntries.toLocaleString()} total entries
                  </div>
                </div>

                <div className="package-value">
                  £{pricePerEntry} per entry
                </div>

                <div className="package-features">
                  <div className="feature">
                    <Check size={16} />
                    Instant delivery
                  </div>
                  <div className="feature">
                    <Check size={16} />
                    Secure payment
                  </div>
                  <div className="feature">
                    <Check size={16} />
                    No expiration
                  </div>
                </div>

                <button
                  className="buy-button"
                  onClick={() => handlePurchase(pkg)}
                  disabled={loading}
                >
                  <CreditCard size={20} />
                  Buy Now
                </button>
              </div>
            );
          })}
        </div>

        <div className="buy-entries-info">
          <div className="info-section">
            <h3>💳 Secure Payment</h3>
            <p>All payments are processed securely through Stripe. We never store your card details.</p>
          </div>

          <div className="info-section">
            <h3>⚡ Instant Delivery</h3>
            <p>Entries are added to your account immediately after successful payment.</p>
          </div>

          <div className="info-section">
            <h3>🎁 No Expiration</h3>
            <p>Your entries never expire. Use them whenever you want on any active prize draw.</p>
          </div>

          <div className="info-section">
            <h3>🔒 Safe & Secure</h3>
            <p>Your payment information is encrypted and secure. We use industry-standard security.</p>
          </div>
        </div>

        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          
          <div className="faq-item">
            <h4>How do I use my entries?</h4>
            <p>Go to any active prize draw and click "Enter Now". Choose how many entries you want to use.</p>
          </div>

          <div className="faq-item">
            <h4>Do entries expire?</h4>
            <p>No! Your entries never expire and can be used on any current or future prize draw.</p>
          </div>

          <div className="faq-item">
            <h4>Can I get a refund?</h4>
            <p>Due to the instant digital nature of entries, all sales are final. Please choose carefully.</p>
          </div>

          <div className="faq-item">
            <h4>What payment methods do you accept?</h4>
            <p>We accept all major credit/debit cards, Apple Pay, and Google Pay via Stripe.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyEntries;
