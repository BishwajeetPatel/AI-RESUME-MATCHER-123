// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import ResumeCard from '../components/ResumeCard';
import { Upload, FileText, Briefcase, TrendingUp, Award, Target, Plus } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, resumes, dashboardStats, fetchResumes, fetchDashboardStats } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchResumes(),
          fetchDashboardStats()
        ]);
      } catch (error) {
        console.error('Dashboard load error:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || 'User'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your resume optimization dashboard
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Resumes</p>
                <p className="text-3xl font-bold text-gray-900">
                  {dashboardStats?.totalResumes || 0}
                </p>
              </div>
              <FileText className="w-12 h-12 text-indigo-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg ATS Score</p>
                <p className="text-3xl font-bold text-gray-900">
                  {dashboardStats?.avgATSScore || 0}%
                </p>
              </div>
              <Award className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Interview Rate</p>
                <p className="text-3xl font-bold text-gray-900">
                  {dashboardStats?.interviewProbability || 0}%
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Jobs Applied</p>
                <p className="text-3xl font-bold text-gray-900">
                  {dashboardStats?.appliedJobs || 0}
                </p>
              </div>
              <Briefcase className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/upload')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6 hover:shadow-lg transition-all text-left"
          >
            <Upload className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Upload New Resume</h3>
            <p className="text-sm text-indigo-100">
              Get instant AI analysis and feedback
            </p>
          </button>

          <button
            onClick={() => navigate('/jobs')}
            className="bg-white rounded-xl p-6 hover:shadow-lg transition-all border border-gray-200 text-left"
          >
            <Briefcase className="w-8 h-8 text-indigo-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Jobs</h3>
            <p className="text-sm text-gray-600">
              Browse matched job opportunities
            </p>
          </button>

          <button
            onClick={() => navigate('/analytics')}
            className="bg-white rounded-xl p-6 hover:shadow-lg transition-all border border-gray-200 text-left"
          >
            <Target className="w-8 h-8 text-indigo-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">View Analytics</h3>
            <p className="text-sm text-gray-600">
              Track your progress over time
            </p>
          </button>
        </div>

        {/* Recent Resumes */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Resumes</h2>
            <button
              onClick={() => navigate('/upload')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Upload New
            </button>
          </div>

          {!resumes || resumes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No resumes yet
              </h3>
              <p className="text-gray-600 mb-6">
                Upload your first resume to get started with AI-powered analysis
              </p>
              <button
                onClick={() => navigate('/upload')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Upload className="w-5 h-5" />
                Upload Your First Resume
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <ResumeCard key={resume._id} resume={resume} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;