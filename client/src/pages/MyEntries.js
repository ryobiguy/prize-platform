import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, Gift, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './MyEntries.css';

const MyEntries = () => {
  const { user } = useAuth();

  // Mock entries data
  const myEntries = [
    {
      id: 1,
      prizeId: '1',
      prizeTitle: '£500 Cash Prize',
      prizeValue: 500,
      entriesUsed: 5,
      dateEntered: '2025-10-16',
      drawDate: '2025-10-17',
      status: 'active'
    },
    {
      id: 2,
      prizeId: '2',
      prizeTitle: 'iPhone 15 Pro',
      prizeValue: 999,
      entriesUsed: 10,
      dateEntered: '2025-10-15',
      drawDate: '2025-10-25',
      status: 'active'
    },
    {
      id: 3,
      prizeId: '3',
      prizeTitle: 'Amazon Gift Card £100',
      prizeValue: 100,
      entriesUsed: 3,
      dateEntered: '2025-10-14',
      drawDate: '2025-10-20',
      status: 'active'
    }
  ];

  const totalEntriesUsed = myEntries.reduce((sum, entry) => sum + entry.entriesUsed, 0);

  return (
    <div className="my-entries-page">
      <div className="page-header">
        <div className="container">
          <h1>My Entries</h1>
          <p>Track all your prize entries in one place</p>
        </div>
      </div>

      <div className="container">
        <div className="stats-grid">
          <div className="stat-card">
            <Trophy size={32} />
            <div className="stat-info">
              <div className="stat-number">{user?.availableEntries || 0}</div>
              <div className="stat-label">Available Entries</div>
            </div>
          </div>
          <div className="stat-card">
            <TrendingUp size={32} />
            <div className="stat-info">
              <div className="stat-number">{totalEntriesUsed}</div>
              <div className="stat-label">Entries Used</div>
            </div>
          </div>
          <div className="stat-card">
            <Gift size={32} />
            <div className="stat-info">
              <div className="stat-number">{myEntries.length}</div>
              <div className="stat-label">Active Entries</div>
            </div>
          </div>
        </div>

        <div className="entries-section">
          <h2>Active Prize Entries</h2>
          
          {myEntries.length === 0 ? (
            <div className="no-entries">
              <Gift size={64} />
              <h3>No entries yet</h3>
              <p>Start entering prize draws to see them here</p>
              <Link to="/prizes" className="browse-btn">Browse Prizes</Link>
            </div>
          ) : (
            <div className="entries-list">
              {myEntries.map(entry => (
                <div key={entry.id} className="entry-card">
                  <div className="entry-icon">
                    <Gift size={32} />
                  </div>
                  <div className="entry-info">
                    <h3>{entry.prizeTitle}</h3>
                    <div className="entry-meta">
                      <span className="prize-value">£{entry.prizeValue}</span>
                      <span className="meta-divider">•</span>
                      <span>{entry.entriesUsed} entries used</span>
                    </div>
                    <div className="entry-dates">
                      <div className="date-item">
                        <Calendar size={14} />
                        <span>Entered: {new Date(entry.dateEntered).toLocaleDateString()}</span>
                      </div>
                      <div className="date-item">
                        <Calendar size={14} />
                        <span>Draw: {new Date(entry.drawDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Link to={`/prizes/${entry.prizeId}`} className="view-btn">
                    View Prize
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="earn-more-section">
          <h2>Want More Entries?</h2>
          <p>Complete tasks to earn more entries and increase your chances of winning</p>
          <Link to="/tasks" className="tasks-btn">View Tasks</Link>
        </div>
      </div>
    </div>
  );
};

export default MyEntries;
