// routes/jobs.js - Job Matching Routes
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const JobMatcher = require('../services/jobMatcher');
const { Resume, Job } = require('../models/Resume'); // FIX: Import from models/Resume

// GET /api/jobs/search - Search jobs with filters
router.get('/search', auth, async (req, res) => {
  try {
    const { 
      keywords, 
      location, 
      jobType, 
      experienceLevel,
      page = 1, 
      limit = 20 
    } = req.query;

    console.log('🔍 Job search request:', { keywords, location, jobType, experienceLevel });

    const query = { isActive: true }; // Only show active jobs
    
    if (keywords) {
      query.$text = { $search: keywords };
    }
    
    if (location) {
      query.location = new RegExp(location, 'i');
    }
    
    if (jobType) {
      query.jobType = jobType;
    }
    
    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    const jobs = await Job.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ postedDate: -1 });

    const total = await Job.countDocuments(query);

    console.log(`✅ Found ${jobs.length} jobs`);

    res.status(200).json({
      jobs,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: jobs.length,
        totalJobs: total
      }
    });

  } catch (error) {
    console.error('Job search error:', error);
    res.status(500).json({ error: 'Failed to search jobs' });
  }
});

// POST /api/jobs/match - Get matched jobs for resume
router.post('/match', auth, async (req, res) => {
  try {
    const { resumeId, limit = 10 } = req.body;

    console.log('🎯 Job matching request for resume:', resumeId);

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user.id
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    const jobs = await Job.find({ isActive: true })
      .sort({ postedDate: -1 })
      .limit(50);

    console.log(`📋 Found ${jobs.length} active jobs for matching`);

    const matcher = new JobMatcher();
    const matchedJobs = await matcher.matchJobsToResume(resume, jobs);

    const topMatches = matchedJobs
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);

    console.log(`✅ Matched ${topMatches.length} jobs`);

    res.status(200).json({
      matches: topMatches,
      totalEvaluated: jobs.length
    });

  } catch (error) {
    console.error('Job matching error:', error);
    res.status(500).json({ error: 'Failed to match jobs' });
  }
});

// GET /api/jobs/:id - Get job details
router.get('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.status(200).json({ job });

  } catch (error) {
    console.error('Job fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch job details' });
  }
});

// POST /api/jobs/:id/analyze-fit - Analyze fit for specific job
router.post('/:id/analyze-fit', auth, async (req, res) => {
  try {
    const { resumeId } = req.body;

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user.id
    });
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    const matcher = new JobMatcher();
    const fitAnalysis = await matcher.analyzeJobFit(resume, job);

    res.status(200).json({ fitAnalysis });

  } catch (error) {
    console.error('Fit analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze job fit' });
  }
});

// POST /api/jobs/bulk-import - Import jobs (admin only)
router.post('/bulk-import', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { jobs } = req.body;

    if (!Array.isArray(jobs) || jobs.length === 0) {
      return res.status(400).json({ error: 'Invalid jobs array' });
    }

    const insertedJobs = await Job.insertMany(jobs);

    res.status(201).json({
      success: true,
      count: insertedJobs.length,
      message: `Successfully imported ${insertedJobs.length} jobs`
    });

  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ error: 'Failed to import jobs' });
  }
});

// GET /api/jobs/recommendations/:resumeId - Get personalized job recommendations
router.get('/recommendations/:resumeId', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.resumeId,
      userId: req.user.id
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    const skills = resume.analysis?.keySkills || [];

    const jobs = await Job.find({
      isActive: true,
      $or: [
        { requiredSkills: { $in: skills } },
        { description: { $regex: skills.join('|'), $options: 'i' } }
      ]
    })
    .sort({ postedDate: -1 })
    .limit(20);

    const matcher = new JobMatcher();
    const recommendations = await matcher.matchJobsToResume(resume, jobs);

    res.status(200).json({
      recommendations: recommendations.sort((a, b) => b.matchScore - a.matchScore).slice(0, 10)
    });

  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

module.exports = router;