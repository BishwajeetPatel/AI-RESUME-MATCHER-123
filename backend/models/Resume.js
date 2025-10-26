// models/Resume.js - All MongoDB Schemas (Resume, Job, User)
const mongoose = require('mongoose');

// ========================================
// RESUME SCHEMA
// ========================================
const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  analysis: {
    atsScore: { type: Number, min: 0, max: 100 },
    overallMatch: { type: Number, min: 0, max: 100 },
    interviewProbability: { type: Number, min: 0, max: 100 },
    strengths: [String],
    improvements: [String],
    skillGaps: [{
      skill: String,
      importance: {
        type: String,
        enum: ['High', 'Medium', 'Low']
      }
    }],
    keySkills: [String],
    experience: {
      years: Number,
      industries: [String],
      roles: [String]
    },
    keywords: [String],
    formatting: {
      score: Number,
      issues: [String]
    },
    analyzedAt: Date,
    modelUsed: String
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for faster queries
resumeSchema.index({ userId: 1, uploadedAt: -1 });
resumeSchema.index({ 'analysis.atsScore': -1 });

// ========================================
// USER SCHEMA
// ========================================
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profile: {
    currentTitle: String,
    experience: Number,
    location: String,
    phone: String,
    linkedin: String,
    github: String,
    portfolio: String
  },
  preferences: {
    jobTypes: [String],
    locations: [String],
    salaryExpectation: {
      min: Number,
      max: Number
    },
    remotePreference: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site', 'Any'],
      default: 'Any'
    }
  },
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
  appliedJobs: [{
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    },
    appliedAt: Date,
    status: {
      type: String,
      enum: ['Applied', 'Reviewing', 'Interview', 'Offer', 'Rejected'],
      default: 'Applied'
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date
}, {
  timestamps: true
});

// Only one index on email - removed duplicate
userSchema.index({ email: 1 });

// ========================================
// JOB SCHEMA
// ========================================
const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'],
    default: 'Full-time'
  },
  experienceLevel: {
    type: String,
    enum: ['Entry', 'Mid', 'Senior', 'Lead', 'Executive'],
    default: 'Mid'
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  description: {
    type: String,
    required: true
  },
  requiredSkills: {
    type: [String],
    default: []
  },
  preferredSkills: {
    type: [String],
    default: []
  },
  experienceRequired: {
    type: Number,
    default: 0
  },
  benefits: [String],
  applicationUrl: String,
  companyLogo: String,
  isActive: {
    type: Boolean,
    default: true
  },
  postedDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: Date,
  applicants: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Text index for search functionality
jobSchema.index({
  title: 'text',
  description: 'text',
  company: 'text'
});

// Indexes for filtering
jobSchema.index({ location: 1, jobType: 1 });
jobSchema.index({ experienceLevel: 1, isActive: 1 });
jobSchema.index({ postedDate: -1 });
jobSchema.index({ requiredSkills: 1 });

// ========================================
// EXPORT MODELS
// ========================================
const Resume = mongoose.model('Resume', resumeSchema);
const Job = mongoose.model('Job', jobSchema);
const User = mongoose.model('User', userSchema);

module.exports = { Resume, Job, User };