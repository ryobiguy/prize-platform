import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get('/api/auth/me');
        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post('/api/auth/register', { username, email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      toast.success('Registration successful! Welcome bonus: 10 entries!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
  };

  const googleLogin = async (googleData) => {
    try {
      const response = await axios.post('/api/auth/google', googleData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      toast.success('Welcome! You received 10 free entries!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Google login failed');
      return false;
    }
  };

  const appleLogin = async (appleData) => {
    try {
      const response = await axios.post('/api/auth/apple', {
        identityToken: appleData.authorization.id_token,
        email: appleData.user?.email,
        fullName: appleData.user?.name
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      toast.success('Welcome! You received 10 free entries!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Apple login failed');
      return false;
    }
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, googleLogin, appleLogin, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
