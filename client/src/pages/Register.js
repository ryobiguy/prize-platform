import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, Gift, Clock } from 'lucide-react';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });

  // Check if signup bonus is still active
  const SIGNUP_BONUS_END = new Date('2025-12-20T23:59:59Z');
  const isBonusActive = new Date() < SIGNUP_BONUS_END;
  const daysLeft = Math.ceil((SIGNUP_BONUS_END - new Date()) / (1000 * 60 * 60 * 24));

  useEffect(() => {
    // Check for referral code in URL
    const refCode = searchParams.get('ref');
    if (refCode) {
      setFormData(prev => ({ ...prev, referralCode: refCode }));
    }
  }, [searchParams]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaQuestion] = useState(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return { num1, num2, answer: num1 + num2 };
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      alert('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (!agreedToTerms || !agreedToPrivacy) {
      alert('Please agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }
    
    if (parseInt(captchaAnswer) !== captchaQuestion.answer) {
      alert('Incorrect CAPTCHA answer. Please try again.');
      setCaptchaAnswer('');
      return;
    }
    
    setLoading(true);
    
    const success = await register(formData.name, formData.email, formData.password);
    
    if (success) {
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <Trophy size={48} />
          </div>
          <h1>Create Account</h1>
          <p>Sign up to start winning prizes</p>
        </div>

        {isBonusActive && (
          <div style={{
            background: 'linear-gradient(135deg, #FF8C00 0%, #FFB800 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            textAlign: 'center',
            boxShadow: '0 8px 20px rgba(255, 140, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Gift size={28} />
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#1a1a1a' }}>
                LIMITED TIME OFFER!
              </h2>
            </div>
            <p style={{ fontSize: '1.25rem', margin: '0.5rem 0', fontWeight: '600', color: '#2d2d2d' }}>
              Get <span style={{ fontSize: '2rem', fontWeight: '800', color: '#1a1a1a' }}>500 FREE ENTRIES</span> when you sign up!
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
              <Clock size={18} />
              <span style={{ fontSize: '0.95rem', color: '#2d2d2d', fontWeight: '500' }}>
                Ends December 20th • Only {daysLeft} days left!
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
              placeholder="Min 8 characters, 1 uppercase, 1 lowercase, 1 number"
            />
            <small style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              Must include uppercase, lowercase, and number
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="referralCode">Referral Code (Optional)</label>
            <input
              type="text"
              id="referralCode"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleChange}
              placeholder="Enter referral code for bonus entries"
              style={{ textTransform: 'uppercase' }}
            />
            {formData.referralCode && (
              <small style={{ color: '#10b981', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                🎁 Get 25 bonus entries with this code!
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="captcha">Security Check: What is {captchaQuestion.num1} + {captchaQuestion.num2}?</label>
            <input
              type="number"
              id="captcha"
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value)}
              required
              placeholder="Enter the answer"
            />
          </div>

          <div className="consent-section">
            <div className="consent-checkbox">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                required
              />
              <label htmlFor="terms">
                I agree to the <Link to="/terms-of-service" target="_blank">Terms of Service</Link>
              </label>
            </div>

            <div className="consent-checkbox">
              <input
                type="checkbox"
                id="privacy"
                checked={agreedToPrivacy}
                onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                required
              />
              <label htmlFor="privacy">
                I agree to the <Link to="/privacy-policy" target="_blank">Privacy Policy</Link> and consent to the collection and use of my personal data as described
              </label>
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
