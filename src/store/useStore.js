// src/store/useStore.js
import { create } from 'zustand';
import api from '../services/api';

export const useStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,

  initializeAuth: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await api.get('/auth/me');
        set({ 
          user: response.data.user, 
          isAuthenticated: true,
          loading: false 
        });
      } catch (error) {
        console.error('Init auth error:', error);
        localStorage.removeItem('token');
        set({ 
          user: null, 
          isAuthenticated: false, 
          token: null,
          loading: false 
        });
      }
    } else {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    try {
      console.log('🔐 Attempting login...', { email });
      
      const response = await api.post('/auth/login', { email, password });
      
      console.log('✅ Login response:', response.data);
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      set({ 
        token, 
        user, 
        isAuthenticated: true 
      });
      
      return { success: true };
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  },

  register: async (userData) => {
    try {
      console.log('📝 Attempting registration...', { email: userData.email });
      
      const response = await api.post('/auth/register', userData);
      
      console.log('✅ Register response:', response.data);
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      set({ 
        token, 
        user, 
        isAuthenticated: true 
      });
      
      return { success: true };
    } catch (error) {
      console.error('❌ Register error:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false
    });
  }
}));

export default useStore;