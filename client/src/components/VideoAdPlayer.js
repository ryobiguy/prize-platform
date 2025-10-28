import React, { useState, useEffect } from 'react';
import { Play, X, Award, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import './VideoAdPlayer.css';

const VideoAdPlayer = ({ task, onComplete, onClose }) => {
  const [adState, setAdState] = useState('ready'); // ready, loading, playing, completed
  const [timeWatched, setTimeWatched] = useState(0);
  const [canClaim, setCanClaim] = useState(false);

  const adDuration = task.verificationData?.adDuration || 30;

  useEffect(() => {
    let interval;
    if (adState === 'playing') {
      interval = setInterval(() => {
        setTimeWatched(prev => {
          const newTime = prev + 1;
          if (newTime >= adDuration) {
            setAdState('completed');
            setCanClaim(true);
            clearInterval(interval);
            return adDuration;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [adState, adDuration]);

  const handleStartAd = () => {
    setAdState('loading');
    
    // Simulate ad loading
    setTimeout(() => {
      setAdState('playing');
      toast.success('Demo ad started! Watch to earn entries');
    }, 1500);
  };

  const handleClaimReward = async () => {
    if (!canClaim) return;
    
    try {
      await onComplete(task._id);
      toast.success(`+${task.entriesReward} entries earned! 🎉`);
      onClose();
    } catch (error) {
      toast.error('Failed to claim reward');
    }
  };

  const progressPercent = (timeWatched / adDuration) * 100;

  return (
    <div className="video-ad-overlay">
      <div className="video-ad-modal">
        <button className="close-btn" onClick={onClose} disabled={adState === 'playing'}>
          <X size={24} />
        </button>

        <div className="video-ad-content">
          {adState === 'ready' && (
            <div className="ad-ready">
              <div className="ad-icon">
                <Play size={64} />
              </div>
              <h2>Watch Video Ad</h2>
              <p>Watch a {adDuration} second video to earn {task.entriesReward} entries</p>
              <button className="start-ad-btn" onClick={handleStartAd}>
                <Play size={20} />
                Start Video
              </button>
            </div>
          )}

          {adState === 'loading' && (
            <div className="ad-loading">
              <Loader className="spinner" size={64} />
              <p>Loading advertisement...</p>
            </div>
          )}

          {adState === 'playing' && (
            <div className="ad-playing">
              <div className="video-placeholder">
                {/* In production, this would be replaced with actual ad video player */}
                <div className="mock-ad">
                  <h3>Advertisement</h3>
                  <p>Video ad playing...</p>
                  <div className="ad-timer">
                    {adDuration - timeWatched}s remaining
                  </div>
                </div>
              </div>
              
              <div className="ad-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="progress-text">
                  {timeWatched}s / {adDuration}s
                </div>
              </div>
            </div>
          )}

          {adState === 'completed' && (
            <div className="ad-completed">
              <div className="success-icon">
                <Award size={64} />
              </div>
              <h2>Ad Complete!</h2>
              <p>You've earned {task.entriesReward} entries</p>
              <button className="claim-reward-btn" onClick={handleClaimReward}>
                <Award size={20} />
                Claim {task.entriesReward} Entries
              </button>
            </div>
          )}
        </div>

        {/* Demo Mode Indicator */}
        {adState === 'ready' && (
          <div className="ad-provider-info">
            <span className="provider-badge demo">🎬 Demo Mode</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoAdPlayer;
