// src/components/ResumeCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, Award, TrendingUp, Trash2, Eye } from 'lucide-react';
import { useStore } from '../store/useStore';

const ResumeCard = ({ resume }) => {
  const navigate = useNavigate();
  const { deleteResume } = useStore();

  const handleView = () => {
    navigate(`/resume/${resume._id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this resume?')) {
      await deleteResume(resume._id);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreGrade = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'D';
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border border-gray-100"
         onClick={handleView}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 rounded-lg">
            <FileText className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg truncate max-w-xs">
              {resume.fileName}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Calendar className="w-4 h-4" />
              {formatDate(resume.uploadedAt)}
            </div>
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete resume"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className={`p-3 rounded-lg ${getScoreColor(resume.analysis?.atsScore || 0)}`}>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4" />
            <span className="text-xs font-medium">ATS Score</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{resume.analysis?.atsScore || 0}</span>
            <span className="text-sm font-semibold">{getScoreGrade(resume.analysis?.atsScore || 0)}</span>
          </div>
        </div>

        <div className={`p-3 rounded-lg ${getScoreColor(resume.analysis?.overallMatch || 0)}`}>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium">Match</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{resume.analysis?.overallMatch || 0}</span>
            <span className="text-xs">%</span>
          </div>
        </div>

        <div className={`p-3 rounded-lg ${getScoreColor(resume.analysis?.interviewProbability || 0)}`}>
          <div className="text-xs font-medium mb-1">Interview</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{resume.analysis?.interviewProbability || 0}</span>
            <span className="text-xs">%</span>
          </div>
        </div>
      </div>

      {/* Key Skills Preview */}
      {resume.analysis?.keySkills && resume.analysis.keySkills.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-medium text-gray-600 mb-2">Top Skills</div>
          <div className="flex flex-wrap gap-2">
            {resume.analysis.keySkills.slice(0, 5).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {skill}
              </span>
            ))}
            {resume.analysis.keySkills.length > 5 && (
              <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">
                +{resume.analysis.keySkills.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleView}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <Eye className="w-4 h-4" />
        View Full Analysis
      </button>
    </div>
  );
};

export default ResumeCard;