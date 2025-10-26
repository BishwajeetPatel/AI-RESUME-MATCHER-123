// src/pages/Analytics.jsx
import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Award, Briefcase, Target, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Analytics = () => {
  const navigate = useNavigate();
  const { resumes, dashboardStats, fetchResumes, fetchDashboardStats } = useStore();
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchResumes(),
        fetchDashboardStats()
      ]);
      setLoading(false);
    };
    loadData();
  }, [fetchResumes, fetchDashboardStats]);

  useEffect(() => {
    if (resumes.length > 0) {
      const data = resumes.map((resume, index) => ({
        name: `Resume ${index + 1}`,
        atsScore: resume.analysis?.atsScore || 0,
        overallMatch: resume.analysis?.overallMatch || 0,
        interviewProb: resume.analysis?.interviewProbability || 0,
        date: new Date(resume.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }));
      setPerformanceData(data.reverse());
    }
  }, [resumes]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

  const avgScores = {
    atsScore: resumes.length > 0 
      ? Math.round(resumes.reduce((sum, r) => sum + (r.analysis?.atsScore || 0), 0) / resumes.length)
      : 0,
    overallMatch: resumes.length > 0
      ? Math.round(resumes.reduce((sum, r) => sum + (r.analysis?.overallMatch || 0), 0) / resumes.length)
      : 0,
    interviewProb: resumes.length > 0
      ? Math.round(resumes.reduce((sum, r) => sum + (r.analysis?.interviewProbability || 0), 0) / resumes.length)
      : 0
  };

  const scoreDistribution = [
    { name: 'Excellent (90-100)', value: resumes.filter(r => (r.analysis?.atsScore || 0) >= 90).length },
    { name: 'Good (80-89)', value: resumes.filter(r => (r.analysis?.atsScore || 0) >= 80 && (r.analysis?.atsScore || 0) < 90).length },
    { name: 'Average (70-79)', value: resumes.filter(r => (r.analysis?.atsScore || 0) >= 70 && (r.analysis?.atsScore || 0) < 80).length },
    { name: 'Needs Work (<70)', value: resumes.filter(r => (r.analysis?.atsScore || 0) < 70).length }
  ].filter(item => item.value > 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your resume performance and progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Resumes</p>
                <p className="text-3xl font-bold text-gray-900">{resumes.length}</p>
              </div>
              <Calendar className="w-12 h-12 text-indigo-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg ATS Score</p>
                <p className="text-3xl font-bold text-gray-900">{avgScores.atsScore}%</p>
              </div>
              <Award className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Match</p>
                <p className="text-3xl font-bold text-gray-900">{avgScores.overallMatch}%</p>
              </div>
              <Target className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Interview Rate</p>
                <p className="text-3xl font-bold text-gray-900">{avgScores.interviewProb}%</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Charts */}
        {resumes.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Performance Over Time */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Resume Performance Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="atsScore" stroke="#4F46E5" name="ATS Score" strokeWidth={2} />
                  <Line type="monotone" dataKey="overallMatch" stroke="#10B981" name="Match Score" strokeWidth={2} />
                  <Line type="monotone" dataKey="interviewProb" stroke="#F59E0B" name="Interview Prob" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Score Distribution */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Score Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={scoreDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {scoreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Yet</h3>
            <p className="text-gray-600 mb-6">Upload resumes to see analytics and insights</p>
            <button
              onClick={() => navigate('/upload')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Upload Your First Resume
            </button>
          </div>
        )}

        {/* Score Comparison */}
        {resumes.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">All Resumes Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="atsScore" fill="#4F46E5" name="ATS Score" />
                <Bar dataKey="overallMatch" fill="#10B981" name="Match Score" />
                <Bar dataKey="interviewProb" fill="#F59E0B" name="Interview Probability" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;