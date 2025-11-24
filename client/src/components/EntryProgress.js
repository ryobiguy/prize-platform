import React from 'react';
import { Users, Ticket } from 'lucide-react';
import './EntryProgress.css';

const EntryProgress = ({ userEntries, totalEntries, prizeName }) => {
  const percentage = totalEntries > 0 ? (userEntries / totalEntries) * 100 : 0;
  const displayPercentage = Math.min(percentage, 100);

  return (
    <div className="entry-progress">
      <div className="progress-header">
        <div className="progress-stat">
          <Ticket size={18} />
          <span className="stat-label">Your Entries:</span>
          <span className="stat-value">{userEntries.toLocaleString()}</span>
        </div>
        <div className="progress-stat">
          <Users size={18} />
          <span className="stat-label">Total Entries:</span>
          <span className="stat-value">{totalEntries.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${displayPercentage}%` }}
        >
          {displayPercentage > 5 && (
            <span className="progress-percentage">{displayPercentage.toFixed(2)}%</span>
          )}
        </div>
      </div>
      
      <div className="progress-footer">
        <p className="progress-text">
          You have <strong>{displayPercentage.toFixed(2)}%</strong> chance of winning {prizeName || 'this prize'}
        </p>
      </div>
    </div>
  );
};

export default EntryProgress;
