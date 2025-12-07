import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import NavbarMobile from './components/NavbarMobile';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import Home from './pages/Home';
import Prizes from './pages/Prizes';
import PrizeDetail from './pages/PrizeDetail';
import Tasks from './pages/Tasks';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import HowItWorks from './pages/HowItWorks';
import Winners from './pages/Winners';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import MyEntries from './pages/MyEntries';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import ContestRules from './pages/ContestRules';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Wins from './pages/Wins';
import VerifyEmail from './pages/VerifyEmail';
import Admin from './pages/Admin';
import Referrals from './pages/Referrals';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }
  
  return user && user.isAdmin ? children : <Navigate to="/" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <NavbarMobile />
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/prizes" element={<Prizes />} />
            <Route path="/prizes/:id" element={<PrizeDetail />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/winners" element={<Winners />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
            <Route path="/get-entries" element={<PrivateRoute><Tasks /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/my-entries" element={<PrivateRoute><MyEntries /></PrivateRoute>} />
            <Route path="/referrals" element={<PrivateRoute><Referrals /></PrivateRoute>} />
            <Route path="/wins" element={<PrivateRoute><Wins /></PrivateRoute>} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
            <Route path="/admin/quick" element={<PrivateRoute><Admin /></PrivateRoute>} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contest-rules" element={<ContestRules />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
          <CookieBanner />
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
