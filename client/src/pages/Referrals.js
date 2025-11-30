import React, { useState, useEffect } from 'react';
import { Users, Copy, Gift, TrendingUp, Check, Share2 } from 'lucide-react';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import './Referrals.css';

const Referrals = () => {
  const [referralData, setReferralData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      console.log('Fetching referral data...');
      const response = await axios.get('/api/referral/me');
      console.log('Referral data received:', response.data);
      setReferralData(response.data);
    } catch (error) {
      console.error('Error fetching referral data:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.error || 'Failed to load referral data');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Total Raffle!',
          text: `Use my referral code ${referralData.referralCode} to get 25 bonus entries when you sign up!`,
          url: referralData.referralLink
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      copyToClipboard(referralData.referralLink);
    }
  };

  if (loading) {
    return (
      <div className="referrals-page">
        <div className="container">
          <div className="loading-state">Loading referral data...</div>
        </div>
      </div>
    );
  }

  if (!referralData) {
    return (
      <div className="referrals-page">
        <div className="container">
          <div className="loading-state">
            <p>Unable to load referral data. Please try refreshing the page.</p>
            <button onClick={fetchReferralData} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="referrals-page">
      <div className="page-header">
        <div className="container">
          <Users size={64} />
          <h1>Refer Friends, Earn Entries!</h1>
          <p>Get 50 entries for each friend who joins</p>
        </div>
      </div>

      <div className="container">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={32} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{referralData?.stats?.totalReferrals || 0}</div>
              <div className="stat-label">Total Referrals</div>
            </div>
          </div>
          <div className="stat-card highlight">
            <div className="stat-icon">
              <Gift size={32} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{referralData?.stats?.totalEntriesEarned || 0}</div>
              <div className="stat-label">Entries Earned</div>
            </div>
          </div>
        </div>

        {/* Referral Link Section */}
        <div className="referral-section">
          <h2>Your Referral Link</h2>
          <p className="section-description">
            Share this link with friends. They get 25 entries, you get 50 entries!
          </p>

          <div className="referral-code-box">
            <div className="code-display">
              <span className="code-label">Code:</span>
              <span className="code-value">{referralData?.referralCode}</span>
            </div>
            <button 
              className="copy-btn"
              onClick={() => copyToClipboard(referralData?.referralCode)}
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>

          <div className="referral-link-box">
            <input 
              type="text" 
              value={referralData?.referralLink || ''} 
              readOnly 
              className="link-input"
            />
            <button 
              className="copy-btn"
              onClick={() => copyToClipboard(referralData?.referralLink)}
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
            <button 
              className="share-btn"
              onClick={shareReferral}
            >
              <Share2 size={20} />
              Share
            </button>
          </div>
        </div>

        {/* How It Works */}
        <div className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Share Your Link</h3>
              <p>Send your unique referral link to friends via social media, email, or messaging</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>They Sign Up</h3>
              <p>Your friend creates an account using your referral link and gets 25 bonus entries</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>You Both Win!</h3>
              <p>You receive 50 entries instantly! No limit on how many friends you can refer</p>
            </div>
          </div>
        </div>

        {/* Referral List */}
        {referralData?.referrals && referralData.referrals.length > 0 && (
          <div className="referrals-list">
            <h2>Your Referrals ({referralData.referrals.length})</h2>
            <div className="referrals-table">
              {referralData.referrals.map((referral, index) => (
                <div key={index} className="referral-item">
                  <div className="referral-user">
                    <Users size={20} />
                    <span>{referral.user?.username || 'User'}</span>
                  </div>
                  <div className="referral-reward">
                    <Gift size={16} />
                    <span>+{referral.entriesEarned} entries</span>
                  </div>
                  <div className="referral-date">
                    {new Date(referral.joinedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="cta-section">
          <TrendingUp size={48} />
          <h2>Start Earning Today!</h2>
          <p>The more friends you refer, the more entries you earn. No limits!</p>
          <button className="cta-btn" onClick={shareReferral}>
            <Share2 size={20} />
            Share Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Referrals;
