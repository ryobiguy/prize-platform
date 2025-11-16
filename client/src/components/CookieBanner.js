import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './CookieBanner.css';

const STORAGE_KEY = 'tr_cookie_consent_v1';

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setVisible(true);
      }
    } catch (e) {
      // If localStorage is unavailable, still show banner
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch (e) {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-banner__content container">
        <div className="cookie-banner__text">
          <strong>Cookies & Privacy.</strong>
          <span>
            {' '}We use cookies to improve your experience, personalize content, and analyse traffic.
            By using Total Raffle, you agree to our{' '}
            <Link to="/privacy-policy">Privacy Policy</Link> and{' '}
            <Link to="/terms-of-service">Terms of Service</Link>.
          </span>
        </div>
        <button className="cookie-banner__button" onClick={handleAccept}>
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
