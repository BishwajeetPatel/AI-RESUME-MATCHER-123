import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Award, TrendingUp, CheckCircle, AlertCircle, ArrowLeft, Briefcase } from 'lucide-react';

const ResumeAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchResume } = useStore();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResume = async () => {
      const data = await fetchResume(id);
      setResume(data);
      setLoading(false);
    };
    loadResume();
  }, [id, fetchResume]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Resume Not Found</h2>
          <button onClick={() => navigate('/dashboard')} className="text-indigo-600">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const analysis = resume.analysis || {};

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">{resume.fileName}</h1>

        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
            <Award className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-sm opacity-90 mb-1">ATS Score</p>
            <p className="text-4xl font-bold">{analysis.atsScore || 0}%</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
            <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-sm opacity-90 mb-1">Overall Match</p>
            <p className="text-4xl font-bold">{analysis.overallMatch || 0}%</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
            <Briefcase className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-sm opacity-90 mb-1">Interview Probability</p>
            <p className="text-4xl font-bold">{analysis.interviewProbability || 0}%</p>
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-800">Strengths</h3>
            </div>
            <ul className="space-y-3">
              {(analysis.strengths || []).map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl font-bold text-gray-800">Improvements</h3>
            </div>
            <ul className="space-y-3">
              {(analysis.improvements || []).map((improvement, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Skill Gaps */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Skill Gap Analysis</h3>
          <div className="space-y-3">
            {(analysis.skillGaps || []).map((gap, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-800">{gap.skill}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  gap.importance === 'High' ? 'bg-red-100 text-red-700' : 
                  gap.importance === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {gap.importance} Priority
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Skills */}
        {analysis.keySkills && analysis.keySkills.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Detected Skills</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.keySkills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};