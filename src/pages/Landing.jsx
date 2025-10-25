// src/pages/Landing.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Target, TrendingUp, Zap, CheckCircle, BarChart } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI-Powered Analysis',
      description: 'GPT-4 analyzes your resume with human-level understanding'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'ATS Score Prediction',
      description: 'Know if your resume will pass automated screening systems'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Smart Job Matching',
      description: 'Get matched with jobs that fit your skills and experience'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Feedback',
      description: 'Real-time improvement suggestions to boost your chances'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Skill Gap Analysis',
      description: 'Identify missing skills and how to acquire them'
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: 'Performance Tracking',
      description: 'Track your progress across multiple resume versions'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Resumes Analyzed' },
    { value: '87%', label: 'Average ATS Score' },
    { value: '3x', label: 'More Interviews' },
    { value: '500+', label: 'Companies Hiring' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Land Your Dream Job with
            <span className="block mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI-Powered Resume Analysis
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get instant ATS scores, personalized feedback, and intelligent job matches. 
            Our GPT-4 powered platform helps you optimize your resume and land more interviews.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white text-indigo-600 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-indigo-600"
            >
              Login
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features to help you stand out from the competition
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in just 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Resume</h3>
              <p className="text-gray-600">
                Upload your resume in PDF or DOCX format
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get AI Analysis</h3>
              <p className="text-gray-600">
                Our AI analyzes your resume and provides detailed feedback
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Jobs</h3>
              <p className="text-gray-600">
                Get matched with relevant jobs and apply with confidence
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of job seekers who have improved their resumes and landed more interviews
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-white text-indigo-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-xl"
          >
            Start Free Analysis Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 AI Resume Matcher. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;