import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axios';
import { CheckCircle, XCircle, Mail, Loader } from 'lucide-react';
import './VerifyEmail.css';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token) => {
    try {
      const response = await axios.get(`/api/auth/verify-email/${token}`);
      setStatus('success');
      setMessage(response.data.message || 'Email verified successfully!');
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.error || 'Verification failed. Please try again.');
    }
  };

  return (
    <div className="verify-email-page">
      <div className="verify-email-container">
        {status === 'verifying' && (
          <div className="verify-status verifying">
            <Loader size={64} className="spinner" />
            <h1>Verifying Your Email</h1>
            <p>Please wait while we verify your email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="verify-status success">
            <CheckCircle size={64} />
            <h1>Email Verified!</h1>
            <p>{message}</p>
            <p className="redirect-message">Redirecting you to your dashboard...</p>
            <Link to="/dashboard" className="btn-primary">Go to Dashboard Now</Link>
          </div>
        )}

        {status === 'error' && (
          <div className="verify-status error">
            <XCircle size={64} />
            <h1>Verification Failed</h1>
            <p>{message}</p>
            <div className="error-actions">
              <Link to="/dashboard" className="btn-secondary">
                <Mail size={18} />
                Request New Link
              </Link>
              <Link to="/" className="btn-primary">Return to Home</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
