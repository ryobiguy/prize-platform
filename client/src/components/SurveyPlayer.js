import React, { useState, useEffect, useRef } from 'react';
import { ClipboardList, X, Award, Loader, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import './SurveyPlayer.css';

const SurveyPlayer = ({ task, onComplete, onClose, userId }) => {
  const [surveyState, setSurveyState] = useState('ready'); // ready, loading, available, unavailable, completed
  const [pollfishInitialized, setPollfishInitialized] = useState(false);
  const pollfishRef = useRef(null);

  const apiKey = process.env.REACT_APP_POLLFISH_API_KEY;
  const testMode = process.env.REACT_APP_POLLFISH_TEST_MODE === 'true';

  useEffect(() => {
    // Initialize Pollfish when component mounts
    if (window.Pollfish && apiKey && !pollfishInitialized) {
      try {
        window.Pollfish.init({
          api_key: apiKey,
          debug: testMode,
          ready: () => {
            console.log('Pollfish initialized');
            setPollfishInitialized(true);
          },
          surveyAvailable: () => {
            console.log('Survey available');
            setSurveyState('available');
          },
          surveyNotAvailable: () => {
            console.log('No survey available');
            setSurveyState('unavailable');
            toast.error('No surveys available right now. Try again later!');
          },
          surveyCompleted: () => {
            console.log('Survey completed');
            setSurveyState('completed');
            toast.success('Survey completed! Claim your reward');
          },
          userNotEligible: () => {
            console.log('User not eligible');
            setSurveyState('unavailable');
            toast.error('You are not eligible for this survey');
          },
          userRejectedSurvey: () => {
            console.log('User rejected survey');
            setSurveyState('ready');
            toast.info('Survey cancelled');
          }
        });
      } catch (error) {
        console.error('Pollfish initialization error:', error);
        setSurveyState('unavailable');
      }
    }

    return () => {
      // Cleanup Pollfish when component unmounts
      if (window.Pollfish && pollfishRef.current) {
        try {
          window.Pollfish.hide();
        } catch (error) {
          console.error('Pollfish cleanup error:', error);
        }
      }
    };
  }, [apiKey, testMode, pollfishInitialized]);

  const handleStartSurvey = () => {
    setSurveyState('loading');
    
    if (window.Pollfish && pollfishInitialized) {
      try {
        // Show Pollfish survey
        window.Pollfish.show();
        toast.info('Checking for available surveys...');
      } catch (error) {
        console.error('Pollfish show error:', error);
        setSurveyState('unavailable');
        toast.error('Failed to load survey');
      }
    } else {
      // Fallback to demo mode
      setTimeout(() => {
        setSurveyState('completed');
        toast.success('Demo survey completed!');
      }, 3000);
    }
  };

  const handleClaimReward = async () => {
    try {
      await onComplete(task._id);
      toast.success(`+${task.entriesReward} entries earned! 🎉`);
      onClose();
    } catch (error) {
      toast.error('Failed to claim reward');
    }
  };

  return (
    <div className="survey-overlay">
      <div className="survey-modal">
        <button className="close-btn" onClick={onClose} disabled={surveyState === 'loading'}>
          <X size={24} />
        </button>

        <div className="survey-content">
          {surveyState === 'ready' && (
            <div className="survey-ready">
              <div className="survey-icon">
                <ClipboardList size={64} />
              </div>
              <h2>Complete Survey</h2>
              <p>Answer a few questions to earn {task.entriesReward} entries</p>
              <div className="survey-info">
                <div className="info-item">
                  <span className="info-label">Time:</span>
                  <span className="info-value">5-10 minutes</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Reward:</span>
                  <span className="info-value">{task.entriesReward} entries</span>
                </div>
              </div>
              <button className="start-survey-btn" onClick={handleStartSurvey}>
                <ClipboardList size={20} />
                Start Survey
              </button>
              {!apiKey && (
                <p className="demo-notice">Demo Mode - Surveys not configured yet</p>
              )}
            </div>
          )}

          {surveyState === 'loading' && (
            <div className="survey-loading">
              <Loader className="spinner" size={64} />
              <p>Checking for available surveys...</p>
              <p className="loading-subtext">This may take a moment</p>
            </div>
          )}

          {surveyState === 'available' && (
            <div className="survey-active">
              <div className="survey-icon">
                <ClipboardList size={64} />
              </div>
              <h2>Survey In Progress</h2>
              <p>Complete the survey to earn your reward</p>
              <div className="survey-tips">
                <h3>Tips:</h3>
                <ul>
                  <li>Answer honestly</li>
                  <li>Take your time</li>
                  <li>Don't refresh the page</li>
                </ul>
              </div>
            </div>
          )}

          {surveyState === 'unavailable' && (
            <div className="survey-unavailable">
              <div className="error-icon">
                <AlertCircle size={64} />
              </div>
              <h2>No Survey Available</h2>
              <p>Sorry, there are no surveys available for you right now.</p>
              <div className="unavailable-reasons">
                <h3>This could be because:</h3>
                <ul>
                  <li>You've completed recent surveys</li>
                  <li>No surveys match your profile</li>
                  <li>High demand from other users</li>
                </ul>
              </div>
              <p className="try-again">Try again in a few hours!</p>
              <button className="close-survey-btn" onClick={onClose}>
                Close
              </button>
            </div>
          )}

          {surveyState === 'completed' && (
            <div className="survey-completed">
              <div className="success-icon">
                <Award size={64} />
              </div>
              <h2>Survey Complete!</h2>
              <p>Thank you for your time!</p>
              <div className="reward-display">
                <span className="reward-amount">+{task.entriesReward}</span>
                <span className="reward-label">entries</span>
              </div>
              <button className="claim-reward-btn" onClick={handleClaimReward}>
                <Award size={20} />
                Claim {task.entriesReward} Entries
              </button>
            </div>
          )}
        </div>

        {/* Provider Badge */}
        {surveyState === 'ready' && (
          <div className="survey-provider-info">
            {pollfishInitialized ? (
              <span className="provider-badge pollfish">📊 Pollfish Surveys</span>
            ) : (
              <span className="provider-badge demo">🎬 Demo Mode</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyPlayer;
