import React, { useState, useEffect } from 'react';
import { Trophy, X } from 'lucide-react';
import './WinnerAnnouncement.css';

const WinnerAnnouncement = ({ winner, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (winner) {
      setIsVisible(true);
      // Auto-close after 8 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [winner]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  if (!winner) return null;

  return (
    <div className={`winner-announcement ${isVisible ? 'visible' : ''}`}>
      <div className="announcement-content">
        <button className="announcement-close" onClick={handleClose}>
          <X size={20} />
        </button>
        <div className="announcement-icon">
          <Trophy size={48} />
        </div>
        <h3 className="announcement-title">🎉 We Have a Winner! 🎉</h3>
        <p className="announcement-winner">{winner.username}</p>
        <p className="announcement-text">just won</p>
        <p className="announcement-prize">{winner.prize?.title || 'a prize'}</p>
        <div className="announcement-confetti">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="confetti" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: ['#FF8C00', '#FFB800', '#FFC107', '#FF6B00'][Math.floor(Math.random() * 4)]
            }}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WinnerAnnouncement;
