// routes/jobs.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const JobMatcher = require('../services/jobMatcher');
const { Resume, Job } = require('../models/Resume');
  
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

    const query = {};
    
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

router.post('/match', auth, async (req, res) => {
  try {
    const { resumeId, limit = 10 } = req.body;

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

    const matcher = new JobMatcher();
    const matchedJobs = await matcher.matchJobsToResume(resume, jobs);

    const topMatches = matchedJobs
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);

    res.status(200).json({
      matches: topMatches,
      totalEvaluated: jobs.length
    });

  } catch (error) {
    console.error('Job matching error:', error);
    res.status(500).json({ error: 'Failed to match jobs' });
  }
});

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
