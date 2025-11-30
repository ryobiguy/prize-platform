import React, { useState, useEffect } from 'react';
import { CreditCard, Zap, Star, Crown, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import './BuyEntries.css';

// Buy Entries Page - PayPal & Square Integration

const BuyEntries = () => {
  const { user, fetchUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  // Handle PayPal return
  useEffect(() => {
    const handlePayPalReturn = async () => {
      const token = searchParams.get('token');
      const paymentStatus = searchParams.get('payment');

      if (paymentStatus === 'cancelled') {
        toast.error('Payment cancelled');
        return;
      }

      if (token) {
        try {
          setLoading(true);
          const response = await axios.post('/api/paypal/capture-order', {
            orderId: token
          });

          if (response.data.success) {
            toast.success(response.data.message);
            // Refresh user data to show new balance
            if (fetchUser) await fetchUser();
            // Clean URL
            window.history.replaceState({}, '', '/buy-entries');
          }
        } catch (error) {
          console.error('PayPal capture error:', error);
          toast.error('Failed to complete payment');
        } finally {
          setLoading(false);
        }
      }
    };

    handlePayPalReturn();
  }, [searchParams, fetchUser]);

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

  const handlePayPalPurchase = async (pkg) => {
    if (!user) {
      toast.error('Please login to purchase entries');
      return;
    }

    setLoading(true);
    try {
      // Create PayPal order
      const response = await axios.post('/api/paypal/create-order', {
        packageId: pkg.id,
        entries: pkg.entries + (pkg.bonus || 0),
        amount: pkg.price
      });

      // Redirect to PayPal approval URL
      if (response.data.approvalUrl) {
        window.location.href = response.data.approvalUrl;
      }
    } catch (error) {
      console.error('PayPal purchase error:', error);
      toast.error(error.response?.data?.error || 'Failed to process PayPal payment');
      setLoading(false);
    }
  };

  const handleSquarePurchase = async (pkg) => {
    if (!user) {
      toast.error('Please login to purchase entries');
      return;
    }

    setLoading(true);
    try {
      // Create Square checkout session
      const response = await axios.post('/api/payments/create-checkout', {
        packageId: pkg.id,
        priceId: pkg.priceId,
        entries: pkg.entries + (pkg.bonus || 0),
        amount: pkg.price
      });

      // Open Square checkout in a new tab
      if (response.data.url) {
        window.open(response.data.url, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Square purchase error:', error);
      toast.error(error.response?.data?.error || 'Failed to process Square payment');
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
                  className="buy-button paypal"
                  onClick={() => handlePayPalPurchase(pkg)}
                  disabled={loading}
                  style={{ 
                    background: '#0070ba',
                    marginBottom: '0.5rem'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.64h7.194c2.182 0 3.915.632 5.002 1.828 1.018 1.122 1.44 2.648 1.253 4.537-.005.048-.01.097-.016.145-.01.073-.022.147-.035.22a7.365 7.365 0 0 1-.16.755c-.043.16-.093.322-.15.483-.056.16-.119.32-.189.48a6.762 6.762 0 0 1-.673 1.265 5.729 5.729 0 0 1-.415.52c-.151.175-.315.344-.492.507a6.345 6.345 0 0 1-.597.48 7.465 7.465 0 0 1-.706.44c-.253.14-.518.264-.794.373a8.518 8.518 0 0 1-.884.297c-.306.087-.622.157-.946.21-.324.054-.657.09-1 .108l-.137.007H9.48l-.485 3.083a.65.65 0 0 1-.643.54H7.076z"/>
                  </svg>
                  Pay with PayPal
                </button>
                
                <button
                  className="buy-button square-alt"
                  onClick={() => handleSquarePurchase(pkg)}
                  disabled={loading}
                  style={{ 
                    background: '#f3f4f6',
                    color: '#374151',
                    fontSize: '0.875rem'
                  }}
                >
                  <CreditCard size={18} />
                  Or pay with Card
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

        <div className="responsible-play">
          <p>
            <strong>18+ only.</strong> Please play responsibly. Total Raffle is for entertainment purposes and is not a
            way to make money. If you feel your gambling is becoming a problem, seek help from organisations such as
            <a href="https://www.gamcare.org.uk/" target="_blank" rel="noreferrer"> GamCare</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BuyEntries;
