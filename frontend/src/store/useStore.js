import { create } from 'zustand';
import api from '../services/api';

export const useStore = create((set, get) => ({
  // Auth state
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,

  // Data state
  resumes: [],
  jobs: [],
  dashboardStats: null,
  uploadProgress: 0,

  // Initialize auth on app load
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

  // Auth actions
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      set({ token, user, isAuthenticated: true });
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      set({ token, user, isAuthenticated: true });
      
      return { success: true };
    } catch (error) {
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
      isAuthenticated: false,
      resumes: [],
      jobs: [],
      dashboardStats: null
    });
  },

  // Resume actions
  fetchResumes: async () => {
    try {
      const response = await api.get('/resume/history');
      set({ resumes: response.data.resumes });
      return response.data.resumes;
    } catch (error) {
      console.error('Fetch resumes error:', error);
      return [];
    }
  },

  fetchResume: async (id) => {
    try {
      const response = await api.get(`/resume/${id}`);
      return response.data.resume;
    } catch (error) {
      console.error('Fetch resume error:', error);
      return null;
    }
  },

  uploadResume: async (file) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      set({ uploadProgress: 0 });

      const response = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          set({ uploadProgress: progress });
        }
      });

      // Refresh resumes list
      get().fetchResumes();

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Upload failed' 
      };
    }
  },

  deleteResume: async (id) => {
    try {
      await api.delete(`/resume/${id}`);
      set(state => ({
        resumes: state.resumes.filter(r => r._id !== id)
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Delete failed' };
    }
  },

  // Job actions
  searchJobs: async (filters) => {
    try {
      const response = await api.get('/jobs/search', { params: filters });
      set({ jobs: response.data.jobs });
      return response.data.jobs;
    } catch (error) {
      console.error('Search jobs error:', error);
      return [];
    }
  },

  fetchJob: async (id) => {
    try {
      const response = await api.get(`/jobs/${id}`);
      return response.data.job;
    } catch (error) {
      console.error('Fetch job error:', error);
      return null;
    }
  },

  fetchJobMatches: async (resumeId) => {
    try {
      const response = await api.post('/jobs/match', { resumeId });
      return response.data.matches;
    } catch (error) {
      console.error('Fetch matches error:', error);
      return [];
    }
  },

  // Dashboard stats
  fetchDashboardStats: async () => {
    try {
      const response = await api.get('/analytics/dashboard');
      set({ dashboardStats: response.data.stats });
      return response.data.stats;
    } catch (error) {
      console.error('Fetch stats error:', error);
      return null;
    }
  }
}));

export default useStore;