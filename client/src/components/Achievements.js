import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Award, Lock } from 'lucide-react';
import './Achievements.css';

const ALL_ACHIEVEMENTS = [
  { id: 'first_login', name: 'Welcome Aboard!', description: 'Complete your first login', icon: '👋', reward: 50 },
  { id: 'first_task', name: 'Task Master', description: 'Complete your first task', icon: '✅', reward: 25 },
  { id: 'first_entry', name: 'In It To Win It', description: 'Enter your first prize draw', icon: '🎫', reward: 50 },
  { id: 'streak_3', name: 'Getting Started', description: 'Maintain a 3-day streak', icon: '🔥', reward: 100 },
  { id: 'streak_7', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥🔥', reward: 250 },
  { id: 'streak_14', name: 'Fortnight Fighter', description: 'Maintain a 14-day streak', icon: '🔥🔥🔥', reward: 500 },
  { id: 'streak_30', name: 'Monthly Master', description: 'Maintain a 30-day streak', icon: '🔥🔥🔥🔥', reward: 1000 },
  { id: 'ads_10', name: 'Ad Viewer', description: 'Watch 10 ads', icon: '📺', reward: 50 },
  { id: 'ads_50', name: 'Ad Enthusiast', description: 'Watch 50 ads', icon: '📺📺', reward: 150 },
  { id: 'ads_100', name: 'Ad Master', description: 'Watch 100 ads', icon: '📺📺📺', reward: 300 },
  { id: 'ads_500', name: 'Ad Legend', description: 'Watch 500 ads', icon: '👑', reward: 1000 },
  { id: 'surveys_5', name: 'Survey Starter', description: 'Complete 5 surveys', icon: '📋', reward: 100 },
  { id: 'surveys_10', name: 'Survey Champion', description: 'Complete 10 surveys', icon: '📋📋', reward: 250 },
  { id: 'referral_1', name: 'Friendly Invite', description: 'Refer your first friend', icon: '👥', reward: 100 },
  { id: 'referral_5', name: 'Social Butterfly', description: 'Refer 5 friends', icon: '👥👥', reward: 500 },
  { id: 'referral_10', name: 'Influencer', description: 'Refer 10 friends', icon: '⭐', reward: 1000 },
  { id: 'first_win', name: 'Lucky Winner!', description: 'Win your first prize', icon: '🏆', reward: 200 },
  { id: 'win_3', name: 'Triple Threat', description: 'Win 3 prizes', icon: '🏆🏆🏆', reward: 500 },
  { id: 'entries_1000', name: 'Entry Collector', description: 'Earn 1,000 total entries', icon: '💎', reward: 200 },
  { id: 'entries_5000', name: 'Entry Hoarder', description: 'Earn 5,000 total entries', icon: '💎💎', reward: 500 },
  { id: 'entries_10000', name: 'Entry Legend', description: 'Earn 10,000 total entries', icon: '💎💎💎', reward: 1000 },
  { id: 'level_5', name: 'Rising Star', description: 'Reach level 5', icon: '⭐', reward: 250 },
  { id: 'level_10', name: 'Experienced Player', description: 'Reach level 10', icon: '⭐⭐', reward: 500 },
  { id: 'level_25', name: 'Elite Member', description: 'Reach level 25', icon: '⭐⭐⭐', reward: 1000 }
];

const Achievements = () => {
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('/api/gamification/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUnlockedAchievements(response.data.achievements || []);
      setStats(response.data.stats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setLoading(false);
    }
  };

  const isUnlocked = (achievementId) => {
    return unlockedAchievements.some(a => a.id === achievementId);
  };

  const getProgress = (achievementId) => {
    if (!stats) return null;

    const progressMap = {
      'ads_10': { current: stats.adsWatched, target: 10 },
      'ads_50': { current: stats.adsWatched, target: 50 },
      'ads_100': { current: stats.adsWatched, target: 100 },
      'ads_500': { current: stats.adsWatched, target: 500 },
      'surveys_5': { current: stats.surveysCompleted, target: 5 },
      'surveys_10': { current: stats.surveysCompleted, target: 10 },
      'referral_1': { current: stats.referralsMade, target: 1 },
      'referral_5': { current: stats.referralsMade, target: 5 },
      'referral_10': { current: stats.referralsMade, target: 10 },
      'win_3': { current: stats.prizesWon, target: 3 },
      'entries_1000': { current: stats.totalEntriesEarned, target: 1000 },
      'entries_5000': { current: stats.totalEntriesEarned, target: 5000 },
      'entries_10000': { current: stats.totalEntriesEarned, target: 10000 }
    };

    return progressMap[achievementId] || null;
  };

  if (loading) {
    return (
      <div className="achievements-section">
        <h2>🏆 Achievements</h2>
        <div className="loading">Loading achievements...</div>
      </div>
    );
  }

  return (
    <div className="achievements-section">
      <div className="achievements-header">
        <h2>
          <Award size={28} /> Achievements
        </h2>
        <div className="achievements-count">
          {unlockedAchievements.length} / {ALL_ACHIEVEMENTS.length} Unlocked
        </div>
      </div>

      <div className="achievements-grid">
        {ALL_ACHIEVEMENTS.map(achievement => {
          const unlocked = isUnlocked(achievement.id);
          const progress = getProgress(achievement.id);
          const progressPercent = progress ? Math.min((progress.current / progress.target) * 100, 100) : 0;

          return (
            <div 
              key={achievement.id} 
              className={`achievement-card ${unlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon">
                {unlocked ? achievement.icon : <Lock size={32} />}
              </div>
              <div className="achievement-content">
                <h3 className="achievement-name">{achievement.name}</h3>
                <p className="achievement-description">{achievement.description}</p>
                {progress && !unlocked && (
                  <div className="achievement-progress">
                    <div className="progress-bar-small">
                      <div 
                        className="progress-fill-small" 
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="progress-text-small">
                      {progress.current} / {progress.target}
                    </span>
                  </div>
                )}
                <div className="achievement-reward">
                  {unlocked ? '✅ Unlocked' : `🎁 ${achievement.reward} entries`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
