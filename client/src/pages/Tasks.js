import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, Twitter, Instagram, Youtube, Play, Award, DollarSign, FileText, Smartphone, Mail, Users, Gift } from 'lucide-react';
import VideoAdPlayer from '../components/VideoAdPlayer';
import OfferWall from '../components/OfferWall';
import TheoremReachSurveys from '../components/TheoremReachSurveys';
import './Tasks.css';

const Tasks = () => {
  const { user, updateUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdTask, setSelectedAdTask] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks', 'offers', or 'surveys'

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const response = await axios.post(`/api/tasks/${taskId}/complete`);
      toast.success(`Task completed! +${response.data.entriesEarned} entries`);
      updateUser({
        totalEntries: response.data.totalEntries,
        availableEntries: response.data.availableEntries
      });
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to complete task');
    }
  };

  const handleTaskClick = (task) => {
    // For video ads, open the ad player modal
    if (task.type === 'watch_video_ad' || task.type === 'watch_rewarded_ad') {
      setSelectedAdTask(task);
      return;
    }
    
    // For other tasks, complete directly
    handleCompleteTask(task._id);
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case 'twitter_follow':
      case 'twitter_retweet':
      case 'twitter_like':
        return <Twitter size={24} />;
      case 'instagram_follow':
      case 'instagram_like':
        return <Instagram size={24} />;
      case 'youtube_subscribe':
      case 'youtube_like':
        return <Youtube size={24} />;
      case 'watch_video_ad':
      case 'watch_rewarded_ad':
        return <Play size={24} />;
      case 'complete_survey':
        return <FileText size={24} />;
      case 'app_install':
      case 'app_trial':
      case 'game_trial':
        return <Smartphone size={24} />;
      case 'email_signup':
        return <Mail size={24} />;
      case 'referral':
        return <Users size={24} />;
      case 'affiliate_click':
      case 'affiliate_purchase':
        return <DollarSign size={24} />;
      default:
        return <CheckSquare size={24} />;
    }
  };

  const getTaskPlatformColor = (platform) => {
    switch (platform) {
      case 'twitter':
        return '#1DA1F2';
      case 'instagram':
        return '#E4405F';
      case 'youtube':
        return '#FF0000';
      case 'admob':
        return '#4CAF50';
      case 'survey':
        return '#FF9800';
      case 'affiliate':
        return '#9C27B0';
      default:
        return 'var(--primary)';
    }
  };

  if (loading) {
    return (
      <div className="tasks-page">
        <div className="loading">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div className="container">
          <h1>Complete Tasks & Earn Entries</h1>
          <p>Complete simple tasks to earn entries for prize draws</p>
          <div className="user-stats">
            <div className="stat-card">
              <Award size={24} />
              <div>
                <div className="stat-value">{user.totalEntries}</div>
                <div className="stat-label">Total Entries Earned</div>
              </div>
            </div>
            <div className="stat-card">
              <CheckSquare size={24} />
              <div>
                <div className="stat-value">{user.availableEntries}</div>
                <div className="stat-label">Available Entries</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="tasks-tabs">
          <button 
            className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            <CheckSquare size={20} />
            Quick Tasks
          </button>
          <button 
            className={`tab-btn ${activeTab === 'surveys' ? 'active' : ''}`}
            onClick={() => setActiveTab('surveys')}
          >
            <FileText size={20} />
            Surveys (High Rewards!)
          </button>
          <button 
            className={`tab-btn ${activeTab === 'offers' ? 'active' : ''}`}
            onClick={() => setActiveTab('offers')}
          >
            <Gift size={20} />
            Offer Wall
          </button>
        </div>

        {activeTab === 'tasks' && (
          <>
            {tasks.length === 0 ? (
              <div className="no-tasks">
                <CheckSquare size={64} />
                <h2>No tasks available</h2>
                <p>Check back soon for new tasks!</p>
              </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map(task => (
              <div 
                key={task._id} 
                className={`task-card ${task.completed ? 'completed' : ''}`}
                style={{ '--platform-color': getTaskPlatformColor(task.platform) }}
              >
                <div className="task-icon">
                  {getTaskIcon(task.type)}
                </div>
                
                <div className="task-content">
                  <div className="task-header">
                    <h3 className="task-title">{task.title}</h3>
                    {task.completed && (
                      <span className="completed-badge">Completed</span>
                    )}
                  </div>
                  
                  <p className="task-description">{task.description}</p>
                  
                  <div className="task-reward">
                    <Award size={18} />
                    <span>+{task.entriesReward} entries</span>
                  </div>
                  
                  {task.verificationData?.accountToFollow && (
                    <div className="task-meta">
                      <span>Follow: @{task.verificationData.accountToFollow}</span>
                    </div>
                  )}
                  
                  {task.verificationData?.postUrl && (
                    <div className="task-meta">
                      <a 
                        href={task.verificationData.postUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="task-link"
                      >
                        View Post
                      </a>
                    </div>
                  )}
                  
                  {task.isRepeatable && (
                    <div className="task-badge">
                      Repeatable ({task.repeatInterval})
                    </div>
                  )}
                </div>
                
                <button
                  className="complete-task-btn"
                  onClick={() => handleTaskClick(task)}
                  disabled={task.completed && !task.isRepeatable}
                >
                  {task.completed && !task.isRepeatable ? 'Completed' : 'Complete Task'}
                </button>
              </div>
            ))}
          </div>
        )}
          </>
        )}

        {activeTab === 'surveys' && (
          <TheoremReachSurveys userId={user._id} />
        )}

        {activeTab === 'offers' && (
          <OfferWall userId={user._id} />
        )}
      </div>

      {/* Video Ad Player Modal */}
      {selectedAdTask && (
        <VideoAdPlayer
          task={selectedAdTask}
          onComplete={handleCompleteTask}
          onClose={() => setSelectedAdTask(null)}
        />
      )}
    </div>
  );
};

export default Tasks;
