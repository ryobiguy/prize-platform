import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Flame, TrendingUp, Award } from 'lucide-react';
import './StreakDisplay.css';

const StreakDisplay = () => {
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreakData();
    updateStreak();
  }, []);

  const fetchStreakData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('/api/gamification/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStreakData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching streak data:', error);
      setLoading(false);
    }
  };

  const updateStreak = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.post('/api/gamification/streak/update', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Show achievement notifications if any
      if (response.data.newAchievements && response.data.newAchievements.length > 0) {
        response.data.newAchievements.forEach(achievement => {
          showAchievementNotification(achievement);
        });
      }
      
      // Refresh data
      fetchStreakData();
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const showAchievementNotification = (achievement) => {
    // You can implement a toast notification here
    console.log('🎉 Achievement Unlocked:', achievement.name);
  };

  if (loading || !streakData) {
    return null;
  }

  const { streak, level, experience, experienceForNext } = streakData;
  const progressPercent = (experience / experienceForNext) * 100;

  return (
    <div className="streak-display">
      <div className="streak-card">
        <div className="streak-icon">
          <Flame size={32} className={streak.current > 0 ? 'flame-active' : 'flame-inactive'} />
        </div>
        <div className="streak-info">
          <div className="streak-number">{streak.current}</div>
          <div className="streak-label">Day Streak</div>
          {streak.current > 0 && (
            <div className="streak-bonus">+{streak.nextBonus} entries tomorrow!</div>
          )}
        </div>
      </div>

      <div className="level-card">
        <div className="level-header">
          <Award size={24} />
          <span className="level-text">Level {level}</span>
        </div>
        <div className="level-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="progress-text">
            {experience} / {experienceForNext} XP
          </div>
        </div>
      </div>

      {streak.nextMilestone && (
        <div className="milestone-card">
          <TrendingUp size={20} />
          <span>
            {streak.daysUntilMilestone} days until {streak.nextMilestone}-day milestone!
          </span>
        </div>
      )}
    </div>
  );
};

export default StreakDisplay;
