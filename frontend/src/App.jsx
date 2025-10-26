import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';

// Import pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeUpload from './pages/ResumeUpload';
import ResumeAnalysis from './pages/ResumeAnalysis';
import JobMatches from './pages/JobMatches';
import JobDetails from './pages/JobDetails';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useStore();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useStore();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  const { initializeAuth, isAuthenticated } = useStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><ResumeUpload /></ProtectedRoute>} />
        <Route path="/resume/:id" element={<ProtectedRoute><ResumeAnalysis /></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><JobMatches /></ProtectedRoute>} />
        <Route path="/jobs/:id" element={<ProtectedRoute><JobDetails /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;