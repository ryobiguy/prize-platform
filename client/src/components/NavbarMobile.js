import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import './NavbarMobile.css';

const NavbarMobile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar-mobile">
      <div className="navbar-mobile-top">
        <Link to="/" className="navbar-mobile-logo">
          <img src="/logo.png" alt="Total Raffle" className="logo-mobile-image" />
        </Link>
        {user && (
          <div className="mobile-entries">
            <Trophy size={16} />
            <span>{user.availableEntries}</span>
          </div>
        )}
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-menu-dropdown">
          <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/prizes" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            Prizes
          </Link>
          <Link to="/how-it-works" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            How It Works
          </Link>
          <Link to="/winners" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            Winners
          </Link>
          {user ? (
            <>
              <Link to="/referrals" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                Refer Friends
              </Link>
              <Link to="/buy-entries" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                Buy Entries
              </Link>
              <Link to="/dashboard" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </Link>
              <button onClick={handleLogout} className="mobile-nav-link mobile-logout">
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavbarMobile;
