import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Simple Landing Page
const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-indigo-600">
              AI Resume Matcher
            </h1>
            <div className="flex gap-4">
              <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-indigo-600">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Land Your Dream Job with
          <span className="block mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI-Powered Resume Analysis
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Get instant ATS scores, personalized feedback, and intelligent job matches
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/register" className="px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700">
            Get Started Free
          </Link>
          <Link to="/login" className="px-8 py-4 bg-white text-indigo-600 rounded-lg text-lg font-semibold border-2 border-indigo-600 hover:bg-gray-50">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

// Simple Login Page
const Login = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Login</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input type="password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-indigo-600 hover:text-indigo-500">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

// Simple Register Page
const Register = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Create Account</h2>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="John" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Doe" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input type="password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
            Create Account
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-500">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

// Main App
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </Router>
  );
}

export default App;