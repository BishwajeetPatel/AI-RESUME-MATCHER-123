// src/pages/ResumeUpload.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';

const ResumeUpload = () => {
  const navigate = useNavigate();
  const { uploadResume, uploadProgress } = useStore();
  
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (uploadedFile) => {
    setError('');
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 
                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(uploadedFile.type)) {
      setError('Invalid file type. Please upload PDF or DOC/DOCX files only.');
      return;
    }

    // Validate file size (5MB)
    if (uploadedFile.size > 5 * 1024 * 1024) {
      setError('File size too large. Maximum size is 5MB.');
      return;
    }

    setFile(uploadedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');

    const result = await uploadResume(file);

    if (result.success) {
      navigate(`/resume/${result.data.resumeId}`);
    } else {
      setError(result.error || 'Failed to upload resume. Please try again.');
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload Your Resume
          </h1>
          <p className="text-gray-600">
            Get instant AI-powered analysis and improvement suggestions
          </p>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50'
                  : file
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300 bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {!file ? (
                <>
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Drop your resume here
                  </h3>
                  <p className="text-gray-600 mb-4">
                    or click to browse files
                  </p>
                  <input
                    type="file"
                    onChange={handleChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="file-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                  >
                    Choose File
                  </label>
                  <p className="text-sm text-gray-500 mt-4">
                    Supported formats: PDF, DOC, DOCX (Max 5MB)
                  </p>
                </>
              ) : (
                <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-3">
                    <FileText className="w-10 h-10 text-green-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    disabled={uploading}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {uploadProgress < 100 ? 'Uploading...' : 'Analyzing with AI...'}
                  </span>
                  <span className="text-sm font-medium text-indigo-600">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            {file && !uploading && (
              <button
                type="submit"
                className="w-full mt-6 flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg"
              >
                <CheckCircle className="w-5 h-5" />
                Analyze Resume
              </button>
            )}
          </form>

          {/* Features List */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              What You'll Get:
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">ATS Score</p>
                  <p className="text-sm text-gray-600">
                    See how well your resume performs with applicant tracking systems
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Job Match Score</p>
                  <p className="text-sm text-gray-600">
                    Get personalized job recommendations based on your profile
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Improvement Tips</p>
                  <p className="text-sm text-gray-600">
                    Actionable suggestions to enhance your resume
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Skill Analysis</p>
                  <p className="text-sm text-gray-600">
                    Identify skill gaps and learning opportunities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;