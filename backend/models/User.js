const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // This automatically creates an index
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
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
      }
    ],
    appliedJobs: [
      {
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
      }
    ],
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastLogin: Date
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User; // ✅ Export only User
