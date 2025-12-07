import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, User, LogOut, LayoutDashboard } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      {/* Top row with logo */}
      <div className="navbar-top">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <img src="/logo.png" alt="Total Raffle" className="logo-image" />
          </Link>
        </div>
        <div className="navbar-actions">
          {user ? (
            <>
              {user.cashBalance > 0 && (
                <div className="user-cash-balance">
                  <Trophy size={18} />
                  <span>£{user.cashBalance?.toFixed(2) || '0.00'} credit</span>
                </div>
              )}
              <div className="user-menu">
                <button className="user-button">
                  <User size={20} />
                  <span>{user.username}</span>
                  {user.wins && user.wins.some(win => !win.claimed) && (
                    <span className="win-indicator" aria-label="You have a win" />
                  )}
                </button>
                <div className="user-dropdown">
                  <Link to="/dashboard" className="dropdown-item">
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                  {user.isAdmin && (
                    <Link to="/admin" className="dropdown-item">
                      <User size={16} />
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="dropdown-item">
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-primary">Sign In</Link>
            </>
          )}
        </div>
      </div>

      {/* Bottom row with navigation in orange bar */}
      <div className="navbar-bottom">
        <div className="navbar-menu">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/prizes" className="nav-link">
            Prizes
          </Link>
          <Link to="/how-it-works" className="nav-link">
            How It Works
          </Link>
          <Link to="/winners" className="nav-link">
            Winners
          </Link>
          {user ? (
            <>
              <Link to="/referrals" className="nav-link">
                Refer Friends
              </Link>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
            </>
          ) : (
            <Link to="/login" className="nav-link">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
