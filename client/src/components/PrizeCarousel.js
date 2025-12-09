import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import './PrizeCarousel.css';

const PrizeCarousel = ({ prizes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying || prizes.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % prizes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, prizes.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + prizes.length) % prizes.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % prizes.length);
  };

  const goToSlide = (index) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  if (!prizes || prizes.length === 0) return null;

  const currentPrize = prizes[currentIndex];

  return (
    <div className="prize-carousel">
      <div className="carousel-header">
        <Trophy size={32} />
        <h2>Current Prizes</h2>
      </div>

      <div className="carousel-container">
        {/* Navigation Arrows */}
        {prizes.length > 1 && (
          <>
            <button className="carousel-arrow left" onClick={goToPrevious}>
              <ChevronLeft size={32} />
            </button>
            <button className="carousel-arrow right" onClick={goToNext}>
              <ChevronRight size={32} />
            </button>
          </>
        )}

        {/* Prize Slide */}
        <Link to={`/prizes/${currentPrize._id}`} className="carousel-slide">
          <div className="carousel-image">
            <img 
              src={currentPrize.imageUrl || '/prizes/prize.jpg'} 
              alt={currentPrize.title}
            />
            {currentPrize.status === 'upcoming' && (
              <div className="coming-soon-overlay">
                <Clock size={48} />
                <span>COMING SOON</span>
              </div>
            )}
            {currentPrize.isInstantWin && (
              <div className="instant-win-badge">INSTANT WIN</div>
            )}
          </div>
          <div className="carousel-content">
            <h3>{currentPrize.title}</h3>
            {currentPrize.isInstantWin && currentPrize.prizePool ? (
              <p className="prize-value">
                {currentPrize.prizePool.length} Different Prizes • Up to £{Math.max(...currentPrize.prizePool.map(p => p.value))}
              </p>
            ) : (
              <p className="prize-value">Worth £{currentPrize.value}</p>
            )}
            <p className="prize-entry-price">
              {currentPrize.isInstantWin 
                ? `£${currentPrize.entryPrice?.toFixed(2) || '1.00'} per play` 
                : `£${currentPrize.entryPrice?.toFixed(2) || '2.00'} per entry`}
            </p>
            <div className="carousel-cta">
              Enter Now →
            </div>
          </div>
        </Link>

        {/* Dots Indicator */}
        {prizes.length > 1 && (
          <div className="carousel-dots">
            {prizes.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrizeCarousel;
