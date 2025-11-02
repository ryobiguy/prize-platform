import React, { useState, useEffect } from 'react';
import { FileText, TrendingUp, DollarSign, Award, CheckCircle } from 'lucide-react';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import './TheoremReachSurveys.css';

const TheoremReachSurveys = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    completedSurveys: 0,
    totalEarned: 0
  });

  const apiKey = process.env.REACT_APP_THEOREMREACH_API_KEY || '18f0db9c129628808f84d7ad62e9';
  
  useEffect(() => {
    fetchUserStats();
    initializeTheoremReach();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await axios.get('/api/surveys/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching survey stats:', error);
    }
  };

  const initializeTheoremReach = () => {
    if (!apiKey) {
      console.log('TheoremReach API key not configured');
      return;
    }

    // TheoremReach SDK is loaded in index.html
    // Just wait for it to be available
    if (!window.theoremReachSurveyWall) {
      console.log('Waiting for TheoremReach SDK to load...');
    }
  };

  const openSurveyWall = () => {
    if (!apiKey) {
      toast.error('Survey system not configured');
      return;
    }

    // Open TheoremReach survey wall in new window
    // Using iframe embed URL format
    const surveyUrl = `https://theoremreach.com/survey_wall/show?api_key=${apiKey}&user_id=${userId}`;
    const surveyWindow = window.open(
      surveyUrl,
      'TheoremReach Surveys',
      'width=900,height=700,scrollbars=yes,resizable=yes'
    );

    if (!surveyWindow) {
      toast.error('Please allow popups to complete surveys');
    } else {
      toast.success('Survey wall opened! Complete surveys to earn entries.');
      
      // Check for window close
      const checkClosed = setInterval(() => {
        if (surveyWindow.closed) {
          clearInterval(checkClosed);
          fetchUserStats();
          toast.info('Survey wall closed. Check your entries!');
        }
      }, 1000);
    }
  };

  const handleSurveyComplete = async (rewardAmount) => {
    try {
      const response = await axios.post('/api/surveys/complete', {
        rewardAmount,
        provider: 'theoremreach'
      });
      
      toast.success(`Survey completed! You earned ${response.data.entries} entries!`);
      fetchUserStats();
    } catch (error) {
      console.error('Error recording survey completion:', error);
      toast.error('Error recording survey completion');
    }
  };

  return (
    <div className="theoremreach-container">
      <div className="theoremreach-header">
        <div className="header-content">
          <div className="header-icon">
            <FileText size={32} />
          </div>
          <div className="header-text">
            <h2>Complete Surveys & Earn Big</h2>
            <p>Answer surveys and earn up to 500 entries per survey</p>
          </div>
        </div>

        <div className="survey-stats">
          <div className="stat-item">
            <TrendingUp size={20} />
            <div>
              <div className="stat-value">{stats.completedSurveys}</div>
              <div className="stat-label">Surveys Completed</div>
            </div>
          </div>
          <div className="stat-item">
            <Award size={20} />
            <div>
              <div className="stat-value">{stats.totalEarned}</div>
              <div className="stat-label">Total Entries Earned</div>
            </div>
          </div>
        </div>
      </div>

      <div className="theoremreach-info">
        <div className="info-card">
          <h3>📊 How It Works</h3>
          <ol>
            <li>Click "Start Surveys" below</li>
            <li>Answer questions honestly</li>
            <li>Complete the survey (5-15 minutes)</li>
            <li>Earn entries automatically</li>
          </ol>
        </div>

        <div className="info-card highlight">
          <h3>💰 Earning Potential</h3>
          <ul>
            <li><strong>Quick surveys:</strong> 100-200 entries (5 min)</li>
            <li><strong>Standard surveys:</strong> 200-400 entries (10 min)</li>
            <li><strong>Premium surveys:</strong> 400-800 entries (15 min)</li>
            <li><strong>Daily limit:</strong> Unlimited surveys!</li>
          </ul>
        </div>

        <div className="info-card tips">
          <h3>✨ Pro Tips</h3>
          <ul>
            <li><CheckCircle size={16} /> Answer honestly for better matches</li>
            <li><CheckCircle size={16} /> Complete your profile for more surveys</li>
            <li><CheckCircle size={16} /> Check back daily for new opportunities</li>
            <li><CheckCircle size={16} /> Longer surveys = more entries</li>
          </ul>
        </div>
      </div>

      <div className="theoremreach-action">
        {apiKey ? (
          <button 
            className="start-surveys-btn"
            onClick={openSurveyWall}
            disabled={loading}
          >
            <FileText size={24} />
            <span>Start Surveys</span>
          </button>
        ) : (
          <div className="not-configured">
            <FileText size={64} />
            <h3>Surveys Not Configured</h3>
            <p>Please add your TheoremReach API key to the .env file</p>
            <code>REACT_APP_THEOREMREACH_API_KEY=your_key_here</code>
          </div>
        )}
      </div>

      <div className="theoremreach-footer">
        <p>
          <strong>Note:</strong> Entries are credited immediately after survey completion. 
          Survey availability depends on your demographics and location.
        </p>
      </div>
    </div>
  );
};

export default TheoremReachSurveys;
