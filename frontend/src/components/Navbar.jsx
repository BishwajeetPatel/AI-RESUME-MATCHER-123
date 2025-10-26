// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Menu, X, User, LogOut, BarChart, Briefcase, Upload, Home } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI Resume Matcher
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/upload"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/upload')
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Upload Resume
                </Link>
                <Link
                  to="/jobs"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/jobs')
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Jobs
                </Link>
                <Link
                  to="/analytics"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/analytics')
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BarChart className="w-4 h-4" />
                  Analytics
                </Link>

                {/* User Menu */}
                <div className="flex items-center gap-3 ml-4 pl-4 border-l">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {user?.firstName || 'Profile'}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                    isActive('/dashboard')
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  Dashboard
                </Link>
                <Link
                  to="/upload"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                    isActive('/upload')
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Upload className="w-5 h-5" />
                  Upload Resume
                </Link>
                <Link
                  to="/jobs"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                    isActive('/jobs')
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Briefcase className="w-5 h-5" />
                  Jobs
                </Link>
                <Link
                  to="/analytics"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                    isActive('/analytics')
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BarChart className="w-5 h-5" />
                  Analytics
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  <User className="w-5 h-5" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-center"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;