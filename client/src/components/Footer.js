import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img src="/logo.png" alt="Total Raffle" className="footer-logo-image" />
            </div>
            <p>Win amazing prizes by completing simple tasks. Free to join, free to play!</p>
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
