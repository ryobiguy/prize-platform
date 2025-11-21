import React, { useState } from 'react';
import axios from '../utils/axios';
import { Mail, X } from 'lucide-react';
import toast from 'react-hot-toast';
import './EmailVerificationBanner.css';

const EmailVerificationBanner = ({ user }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isSending, setIsSending] = useState(false);

  if (!user || user.emailVerified || !isVisible) {
    return null;
  }

  const handleResend = async () => {
    setIsSending(true);
    try {
      const response = await axios.post('/api/auth/resend-verification');
      toast.success(response.data.message || 'Verification email sent!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send verification email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="email-verification-banner">
      <div className="banner-content">
        <div className="banner-icon">
          <Mail size={24} />
        </div>
        <div className="banner-text">
          <h3>Verify Your Email Address</h3>
          <p>
            Please check your inbox and click the verification link to activate your account.
            {' '}
            <button 
              onClick={handleResend} 
              className="resend-link"
              disabled={isSending}
            >
              {isSending ? 'Sending...' : 'Resend email'}
            </button>
          </p>
        </div>
        <button 
          className="banner-close" 
          onClick={() => setIsVisible(false)}
          aria-label="Close banner"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
