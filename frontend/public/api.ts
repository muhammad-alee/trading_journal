import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const register = (userData) => {
  return api.post('/auth/register', userData);
};

export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const getCurrentUser = () => {
  return api.get('/auth/me');
};

export const updateProfile = (userData) => {
  return api.put('/auth/me', userData);
};

export const changePassword = (currentPassword, newPassword) => {
  return api.post('/auth/password', { currentPassword, newPassword });
};

export const updateSettings = (settings) => {
  return api.put('/auth/settings', settings);
};

// Account API calls
export const getAccounts = () => {
  return api.get('/accounts');
};

export const getAccount = (id) => {
  return api.get(`/accounts/${id}`);
};

export const createAccount = (accountData) => {
  return api.post('/accounts', accountData);
};

export const updateAccount = (id, accountData) => {
  return api.put(`/accounts/${id}`, accountData);
};

export const deleteAccount = (id) => {
  return api.delete(`/accounts/${id}`);
};

// Trade API calls
export const getTrades = (params) => {
  return api.get('/trades', { params });
};

export const getTrade = (id) => {
  return api.get(`/trades/${id}`);
};

export const createTrade = (tradeData) => {
  return api.post('/trades', tradeData);
};

export const updateTrade = (id, tradeData) => {
  return api.put(`/trades/${id}`, tradeData);
};

export const deleteTrade = (id) => {
  return api.delete(`/trades/${id}`);
};

// Journal API calls
export const getJournalEntries = (params) => {
  return api.get('/journal', { params });
};

export const getJournalEntry = (id) => {
  return api.get(`/journal/${id}`);
};

export const createJournalEntry = (entryData) => {
  return api.post('/journal', entryData);
};

export const updateJournalEntry = (id, entryData) => {
  return api.put(`/journal/${id}`, entryData);
};

export const deleteJournalEntry = (id) => {
  return api.delete(`/journal/${id}`);
};

// Setup API calls
export const getSetups = () => {
  return api.get('/setups');
};

export const getSetup = (id) => {
  return api.get(`/setups/${id}`);
};

export const createSetup = (setupData) => {
  return api.post('/setups', setupData);
};

export const updateSetup = (id, setupData) => {
  return api.put(`/setups/${id}`, setupData);
};

export const deleteSetup = (id) => {
  return api.delete(`/setups/${id}`);
};

// Analytics API calls
export const getPerformanceMetrics = (params) => {
  return api.get('/analytics/performance', { params });
};

export const getTradeAnalysis = (params) => {
  return api.get('/analytics/trades', { params });
};

export default api;
