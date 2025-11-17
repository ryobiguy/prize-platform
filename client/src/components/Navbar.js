import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, Menu, X, User, LogOut, LayoutDashboard, Gift, CheckSquare } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Top row with logo */}
      <div className="navbar-top">
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="Total Raffle" className="logo-image" />
        </Link>
        <div className="navbar-actions">
          {user ? (
            <>
              <div className="user-entries">
                <Trophy size={18} />
                <span>{user.availableEntries} entries</span>
              </div>
              <div className="user-menu">
                <button className="user-button">
                  <User size={20} />
                  <span>{user.username}</span>
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
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Bottom row with navigation in orange bar */}
      <div className="navbar-bottom">
        <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/prizes" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Prizes
          </Link>
          <Link to="/how-it-works" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            How It Works
          </Link>
          <Link to="/winners" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Winners
          </Link>
          {user ? (
            <>
              <Link to="/buy-entries" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                Buy Entries
              </Link>
              <Link to="/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </Link>
            </>
          ) : (
            <Link to="/login" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
