import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Mail } from 'lucide-react';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNewsletterSignup = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/newsletter/subscribe', { email });
      toast.success('Thanks for subscribing! Check your email for 10 free entries! 🎉');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        {/* Newsletter Section */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <Mail size={32} />
            <div className="newsletter-text">
              <h3>Get 10 Free Entries!</h3>
              <p>Subscribe to our newsletter for exclusive deals and new prize alerts</p>
            </div>
          </div>
          <form onSubmit={handleNewsletterSignup} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>

        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img src="/logo.png" alt="Total Raffle" className="footer-logo-image" />
            </div>
            <p>Win amazing prizes with Total Raffle. Buy entries and enter to win!</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/prizes">Prizes</Link></li>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/winners">Winners</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/terms-of-service">Terms of Service</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/contest-rules">Contest Rules</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Total Raffle. All rights reserved.</p>
          <p className="footer-responsible">
            18+ only. Please play responsibly. Total Raffle is for entertainment purposes only and is not a way to make
            money. If you need support, visit{' '}
            <a href="https://www.gamcare.org.uk/" target="_blank" rel="noreferrer">GamCare</a>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
