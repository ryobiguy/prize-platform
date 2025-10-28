import axios from 'axios';

// Create axios instance with base URL
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://totalraffle.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
