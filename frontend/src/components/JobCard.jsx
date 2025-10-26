// src/components/JobCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Clock, TrendingUp, ExternalLink } from 'lucide-react';

const JobCard = ({ job, matchScore, matchingSkills, missingSkills }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/jobs/${job.id || job._id}`);
  };

  const formatSalary = (salary) => {
    if (!salary || !salary.min) return 'Salary not specified';
    return `$${(salary.min / 1000).toFixed(0)}k - $${(salary.max / 1000).toFixed(0)}k`;
  };

  const getMatchColor = (score) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getMatchTextColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100 hover:border-indigo-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-indigo-600 cursor-pointer"
              onClick={handleViewDetails}>
            {job.title}
          </h3>
          <p className="text-gray-600 font-medium">{job.company}</p>
        </div>

        {/* Match Score Badge */}
        {matchScore !== undefined && (
          <div className="text-right ml-4">
            <div className={`text-3xl font-bold ${getMatchTextColor(matchScore)}`}>
              {matchScore}%
            </div>
            <div className="text-xs text-gray-500 font-medium">Match Score</div>
          </div>
        )}
      </div>

      {/* Match Progress Bar */}
      {matchScore !== undefined && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getMatchColor(matchScore)} transition-all`}
              style={{ width: `${matchScore}%` }}
            />
          </div>
        </div>
      )}

      {/* Job Details */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400" />
          {job.location}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Briefcase className="w-4 h-4 text-gray-400" />
          {job.jobType || 'Full-time'}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <DollarSign className="w-4 h-4 text-gray-400" />
          {formatSalary(job.salary)}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-gray-400" />
          {job.experienceLevel || 'Mid'} Level
        </div>
      </div>

      {/* Description Preview */}
      {job.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {job.description}
        </p>
      )}

      {/* Skills Match/Gap */}
      {(matchingSkills || missingSkills) && (
        <div className="space-y-3 mb-4">
          {/* Matching Skills */}
          {matchingSkills && matchingSkills.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-green-600 mb-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Matching Skills ({matchingSkills.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {matchingSkills.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {matchingSkills.length > 4 && (
                  <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs">
                    +{matchingSkills.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {missingSkills && missingSkills.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-orange-600 mb-2">
                Skills to Learn ({missingSkills.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {missingSkills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {missingSkills.length > 3 && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded text-xs">
                    +{missingSkills.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Required Skills (if no match data) */}
      {!matchingSkills && job.requiredSkills && job.requiredSkills.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-semibold text-gray-600 mb-2">Required Skills</div>
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills.slice(0, 5).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {skill}
              </span>
            ))}
            {job.requiredSkills.length > 5 && (
              <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">
                +{job.requiredSkills.length - 5}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleViewDetails}
          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
        >
          View Details
        </button>
        {job.applicationUrl && (
          <a
            href={job.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
          >
            Apply
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};

export default JobCard;