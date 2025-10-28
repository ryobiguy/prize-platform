import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, CheckSquare, Trophy, Gift } from 'lucide-react';
import './HowItWorks.css';

const HowItWorks = () => {
  return (
    <div className="how-it-works-page">
      <div className="page-header">
        <div className="container">
          <h1>How It Works</h1>
          <p>Start winning prizes in 3 simple steps</p>
        </div>
      </div>

      <div className="container">
        <div className="steps-section">
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-icon">
              <UserPlus size={48} />
            </div>
            <h2>Create Your Account</h2>
            <p>Sign up for free and get 10 bonus entries to start. No credit card required!</p>
            <Link to="/register" className="step-btn">Sign Up Now</Link>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-icon">
              <CheckSquare size={48} />
            </div>
            <h2>Complete Tasks</h2>
            <p>Earn entries by completing simple tasks like following social media accounts, watching ads, and daily logins.</p>
            <Link to="/tasks" className="step-btn">View Tasks</Link>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-icon">
              <Trophy size={48} />
            </div>
            <h2>Enter Prize Draws</h2>
            <p>Use your entries to enter prize draws. The more entries you have, the better your chances of winning!</p>
            <Link to="/prizes" className="step-btn">Browse Prizes</Link>
          </div>
        </div>

        <div className="info-section">
          <h2>Frequently Asked Questions</h2>
          
          <div className="faq-item">
            <h3>Is it really free?</h3>
            <p>Yes! Creating an account and earning entries is completely free. You'll never be asked to pay anything.</p>
          </div>

          <div className="faq-item">
            <h3>How do I earn entries?</h3>
            <p>Complete simple tasks like following our social media accounts, watching short advertisements, and logging in daily. Each task rewards you with entries.</p>
          </div>

          <div className="faq-item">
            <h3>How are winners selected?</h3>
            <p>Winners are selected randomly from all entries. Each entry gives you one chance to win, so the more entries you have, the better your odds!</p>
          </div>

          <div className="faq-item">
            <h3>When will I know if I've won?</h3>
            <p>Winners are notified via email within 24 hours of the draw closing. Make sure to check your email regularly!</p>
          </div>

          <div className="faq-item">
            <h3>Can I enter multiple times?</h3>
            <p>Yes! You can use multiple entries on the same prize to increase your chances of winning, up to the maximum entries allowed per user.</p>
          </div>
        </div>

        <div className="cta-section">
          <Gift size={64} />
          <h2>Ready to Start Winning?</h2>
          <p>Join thousands of users who are already winning amazing prizes</p>
          <Link to="/register" className="cta-btn">Get Started Free</Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
