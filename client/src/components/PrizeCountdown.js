import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import './PrizeCountdown.css';

const PrizeCountdown = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(endDate) - new Date();
    
    if (difference <= 0) {
      return { expired: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { days, hours, minutes, seconds, expired: false };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (timeLeft.expired) {
    return (
      <div className="prize-countdown expired">
        <Clock size={16} />
        <span>Draw Ended</span>
      </div>
    );
  }

  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 24;

  return (
    <div className={`prize-countdown ${isUrgent ? 'urgent' : ''}`}>
      <Clock size={16} />
      <div className="countdown-time">
        {timeLeft.days > 0 && (
          <span className="time-unit">
            <strong>{timeLeft.days}</strong>d
          </span>
        )}
        <span className="time-unit">
          <strong>{String(timeLeft.hours).padStart(2, '0')}</strong>h
        </span>
        <span className="time-unit">
          <strong>{String(timeLeft.minutes).padStart(2, '0')}</strong>m
        </span>
        {timeLeft.days === 0 && (
          <span className="time-unit">
            <strong>{String(timeLeft.seconds).padStart(2, '0')}</strong>s
          </span>
        )}
      </div>
    </div>
  );
};

export default PrizeCountdown;
