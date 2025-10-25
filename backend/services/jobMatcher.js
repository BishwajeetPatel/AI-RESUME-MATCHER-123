// services/jobMatcher.js - Job Matching Algorithm
const ResumeAnalyzer = require('./resumeAnalyzer');

class JobMatcher {
  constructor() {
    this.analyzer = new ResumeAnalyzer();
  }

  // Match multiple jobs to a resume
  async matchJobsToResume(resume, jobs) {
    const matches = [];

    for (const job of jobs) {
      try {
        const matchScore = this.calculateMatchScore(resume, job);
        const matchDetails = this.getMatchDetails(resume, job);

        matches.push({
          job: {
            id: job._id,
            title: job.title,
            company: job.company,
            location: job.location,
            salary: job.salary,
            jobType: job.jobType,
            description: job.description
          },
          matchScore,
          ...matchDetails
        });
      } catch (error) {
        console.error(`Error matching job ${job._id}:`, error);
      }
    }

    return matches;
  }

  // Calculate overall match score (0-100)
  calculateMatchScore(resume, job) {
    let score = 0;

    // Skills match (40 points)
    const skillsScore = this.calculateSkillsMatch(resume, job);
    score += skillsScore * 0.4;

    // Experience match (25 points)
    const experienceScore = this.calculateExperienceMatch(resume, job);
    score += experienceScore * 0.25;

    // Education match (15 points)
    const educationScore = this.calculateEducationMatch(resume, job);
    score += educationScore * 0.15;

    // Location match (10 points)
    const locationScore = this.calculateLocationMatch(resume, job);
    score += locationScore * 0.1;

    // Keywords match (10 points)
    const keywordScore = this.calculateKeywordMatch(resume, job);
    score += keywordScore * 0.1;

    return Math.round(score);
  }

  // Calculate skills match
  calculateSkillsMatch(resume, job) {
    const resumeSkills = resume.analysis?.keySkills || [];
    const jobSkills = job.requiredSkills || [];

    if (jobSkills.length === 0) return 50; // No requirements specified

    const lowerResumeSkills = resumeSkills.map(s => s.toLowerCase());
    const lowerJobSkills = jobSkills.map(s => s.toLowerCase());

    let matchCount = 0;
    lowerJobSkills.forEach(skill => {
      if (lowerResumeSkills.some(rs => rs.includes(skill) || skill.includes(rs))) {
        matchCount++;
      }
    });

    return (matchCount / jobSkills.length) * 100;
  }

  // Calculate experience match
  calculateExperienceMatch(resume, job) {
    const resumeYears = resume.analysis?.experience?.years || 0;
    const requiredYears = job.experienceRequired || 0;

    if (requiredYears === 0) return 100;

    if (resumeYears >= requiredYears) {
      // Perfect match or overqualified
      return 100;
    } else if (resumeYears >= requiredYears * 0.8) {
      // Close enough (80%+)
      return 85;
    } else if (resumeYears >= requiredYears * 0.6) {
      // Somewhat close (60%+)
      return 70;
    } else if (resumeYears >= requiredYears * 0.4) {
      // Below requirements (40%+)
      return 50;
    } else {
      // Significantly below
      return 30;
    }
  }

  // Calculate education match
  calculateEducationMatch(resume, job) {
    const educationLevel = {
      'high school': 1,
      'associate': 2,
      'bachelor': 3,
      'master': 4,
      'phd': 5,
      'doctorate': 5
    };

    const resumeText = (resume.content || '').toLowerCase();
    const jobRequirements = (job.description || '').toLowerCase();

    let resumeLevel = 0;
    let requiredLevel = 0;

    // Detect resume education level
    for (const [degree, level] of Object.entries(educationLevel)) {
      if (resumeText.includes(degree)) {
        resumeLevel = Math.max(resumeLevel, level);
      }
    }

    // Detect required education level
    for (const [degree, level] of Object.entries(educationLevel)) {
      if (jobRequirements.includes(degree)) {
        requiredLevel = Math.max(requiredLevel, level);
      }
    }

    if (requiredLevel === 0) return 100; // No specific requirement

    if (resumeLevel >= requiredLevel) return 100;
    if (resumeLevel >= requiredLevel - 1) return 80;
    return 50;
  }

  // Calculate location match
  calculateLocationMatch(resume, job) {
    if (!job.location) return 100;

    const resumeText = (resume.content || '').toLowerCase();
    const jobLocation = job.location.toLowerCase();

    // Check if job is remote
    if (jobLocation.includes('remote') || jobLocation.includes('anywhere')) {
      return 100;
    }

    // Extract city/state from job location
    const locationParts = jobLocation.split(',').map(p => p.trim());

    // Check if any location part appears in resume
    for (const part of locationParts) {
      if (resumeText.includes(part)) {
        return 100;
      }
    }

    // Check for nearby locations (simplified - would use geolocation API in production)
    return 50; // Default to neutral if can't determine
  }

  // Calculate keyword match
  calculateKeywordMatch(resume, job) {
    const resumeKeywords = resume.analysis?.keywords || [];
    const jobDescription = (job.description || '').toLowerCase();

    if (resumeKeywords.length === 0) return 50;

    let matchCount = 0;
    resumeKeywords.forEach(keyword => {
      if (jobDescription.includes(keyword.toLowerCase())) {
        matchCount++;
      }
    });

    return Math.min(100, (matchCount / resumeKeywords.length) * 100 * 1.5);
  }

  // Get detailed match breakdown
  getMatchDetails(resume, job) {
    const resumeSkills = resume.analysis?.keySkills || [];
    const jobSkills = job.requiredSkills || [];

    const lowerResumeSkills = resumeSkills.map(s => s.toLowerCase());
    const lowerJobSkills = jobSkills.map(s => s.toLowerCase());

    const matchingSkills = [];
    const missingSkills = [];

    lowerJobSkills.forEach(skill => {
      const matched = lowerResumeSkills.some(rs => 
        rs.includes(skill) || skill.includes(rs)
      );
      
      if (matched) {
        matchingSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    return {
      matchingSkills,
      missingSkills,
      experienceMatch: this.calculateExperienceMatch(resume, job),
      skillsMatch: this.calculateSkillsMatch(resume, job)
    };
  }

  // Detailed AI-powered job fit analysis
  async analyzeJobFit(resume, job) {
    try {
      const jobDescription = `
Title: ${job.title}
Company: ${job.company}
Description: ${job.description}
Required Skills: ${job.requiredSkills.join(', ')}
Experience Required: ${job.experienceRequired} years
      `;

      const fitAnalysis = await this.analyzer.getJobMatchScore(
        resume.content,
        jobDescription
      );

      return fitAnalysis;

    } catch (error) {
      console.error('Job fit analysis error:', error);
      throw error;
    }
  }
}

module.exports = JobMatcher;