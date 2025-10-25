// routes/analytics.js - Analytics & Dashboard Routes
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { Resume, Job, User } = require('../models/Resume');

// GET /api/analytics/dashboard - Get user dashboard stats
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get resume stats
    const totalResumes = await Resume.countDocuments({ userId });
    const latestResume = await Resume.findOne({ userId })
      .sort({ uploadedAt: -1 })
      .select('analysis uploadedAt');

    // Calculate average ATS score
    const resumes = await Resume.find({ userId }).select('analysis.atsScore');
    const avgATSScore = resumes.length > 0
      ? Math.round(resumes.reduce((sum, r) => sum + (r.analysis?.atsScore || 0), 0) / resumes.length)
      : 0;

    // Get user data
    const user = await User.findById(userId).select('appliedJobs savedJobs');
    
    const stats = {
      totalResumes,
      avgATSScore,
      latestResumeScore: latestResume?.analysis?.atsScore || 0,
      interviewProbability: latestResume?.analysis?.interviewProbability || 0,
      appliedJobs: user?.appliedJobs?.length || 0,
      savedJobs: user?.savedJobs?.length || 0,
      lastUpdated: latestResume?.uploadedAt || null
    };

    res.status(200).json({ stats });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// GET /api/analytics/resume-performance - Get resume performance over time
router.get('/resume-performance', auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id })
      .sort({ uploadedAt: 1 })
      .select('uploadedAt analysis.atsScore analysis.overallMatch analysis.interviewProbability fileName');

    const performanceData = resumes.map(resume => ({
      date: resume.uploadedAt,
      fileName: resume.fileName,
      atsScore: resume.analysis?.atsScore || 0,
      overallMatch: resume.analysis?.overallMatch || 0,
      interviewProbability: resume.analysis?.interviewProbability || 0
    }));

    res.status(200).json({ performanceData });

  } catch (error) {
    console.error('Resume performance error:', error);
    res.status(500).json({ error: 'Failed to fetch resume performance' });
  }
});

// GET /api/analytics/skill-trends - Get skill gap trends
router.get('/skill-trends', auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id })
      .select('analysis.skillGaps analysis.keySkills uploadedAt');

    // Aggregate skill gaps
    const skillGapFrequency = {};
    const skillsAcquired = new Set();

    resumes.forEach(resume => {
      const skills = resume.analysis?.keySkills || [];
      const gaps = resume.analysis?.skillGaps || [];

      skills.forEach(skill => skillsAcquired.add(skill));

      gaps.forEach(gap => {
        const skill = gap.skill;
        if (!skillGapFrequency[skill]) {
          skillGapFrequency[skill] = {
            count: 0,
            importance: gap.importance,
            firstSeen: resume.uploadedAt
          };
        }
        skillGapFrequency[skill].count++;
      });
    });

    // Sort by frequency
    const topGaps = Object.entries(skillGapFrequency)
      .map(([skill, data]) => ({
        skill,
        frequency: data.count,
        importance: data.importance,
        firstSeen: data.firstSeen
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);

    res.status(200).json({
      topSkillGaps: topGaps,
      totalSkillsAcquired: skillsAcquired.size,
      skillsAcquired: Array.from(skillsAcquired)
    });

  } catch (error) {
    console.error('Skill trends error:', error);
    res.status(500).json({ error: 'Failed to fetch skill trends' });
  }
});

// GET /api/analytics/job-matches - Get job match statistics
router.get('/job-matches', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('appliedJobs.jobId', 'title company location jobType');

    const appliedJobs = user?.appliedJobs || [];

    // Group by status
    const statusBreakdown = {
      Applied: 0,
      Reviewing: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0
    };

    appliedJobs.forEach(app => {
      statusBreakdown[app.status]++;
    });

    // Calculate success rate
    const totalApplications = appliedJobs.length;
    const interviewRate = totalApplications > 0 
      ? Math.round((statusBreakdown.Interview / totalApplications) * 100)
      : 0;
    const offerRate = totalApplications > 0
      ? Math.round((statusBreakdown.Offer / totalApplications) * 100)
      : 0;

    res.status(200).json({
      totalApplications,
      statusBreakdown,
      interviewRate,
      offerRate,
      recentApplications: appliedJobs
        .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
        .slice(0, 5)
    });

  } catch (error) {
    console.error('Job matches error:', error);
    res.status(500).json({ error: 'Failed to fetch job match statistics' });
  }
});

// GET /api/analytics/improvement-insights - Get personalized improvement insights
router.get('/improvement-insights', auth, async (req, res) => {
  try {
    const latestResume = await Resume.findOne({ userId: req.user.id })
      .sort({ uploadedAt: -1 });

    if (!latestResume) {
      return res.status(404).json({ error: 'No resume found' });
    }

    const analysis = latestResume.analysis;

    // Generate insights based on scores
    const insights = [];

    // ATS Score insights
    if (analysis.atsScore < 70) {
      insights.push({
        type: 'warning',
        category: 'ATS Optimization',
        title: 'Low ATS Score',
        message: 'Your resume may not pass automated screening. Focus on keyword optimization.',
        action: 'Review job descriptions and add relevant keywords'
      });
    } else if (analysis.atsScore >= 85) {
      insights.push({
        type: 'success',
        category: 'ATS Optimization',
        title: 'Excellent ATS Score',
        message: 'Your resume is well-optimized for automated systems.',
        action: 'Maintain current keyword strategy'
      });
    }

    // Interview probability insights
    if (analysis.interviewProbability < 60) {
      insights.push({
        type: 'warning',
        category: 'Interview Readiness',
        title: 'Low Interview Probability',
        message: 'Add more quantifiable achievements and impact statements.',
        action: 'Include metrics and numbers in your accomplishments'
      });
    }

    // Skill gap insights
    const highPriorityGaps = analysis.skillGaps?.filter(g => g.importance === 'High') || [];
    if (highPriorityGaps.length > 0) {
      insights.push({
        type: 'info',
        category: 'Skill Development',
        title: 'Critical Skill Gaps Identified',
        message: `Focus on acquiring: ${highPriorityGaps.map(g => g.skill).join(', ')}`,
        action: 'Take courses or build projects in these areas'
      });
    }

    // Improvement areas
    if (analysis.improvements && analysis.improvements.length > 0) {
      insights.push({
        type: 'info',
        category: 'Content Quality',
        title: 'Areas for Improvement',
        message: analysis.improvements[0],
        action: 'Review and implement suggested improvements'
      });
    }

    res.status(200).json({ insights });

  } catch (error) {
    console.error('Improvement insights error:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

// GET /api/analytics/market-trends - Get job market trends (admin/premium feature)
router.get('/market-trends', auth, async (req, res) => {
  try {
    // Aggregate job market data
    const jobsByType = await Job.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$jobType', count: { $sum: 1 } } }
    ]);

    const jobsByExperience = await Job.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$experienceLevel', count: { $sum: 1 } } }
    ]);

    // Top companies hiring
    const topCompanies = await Job.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$company', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Most in-demand skills
    const skillDemand = await Job.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$requiredSkills' },
      { $group: { _id: '$requiredSkills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]);

    res.status(200).json({
      jobsByType,
      jobsByExperience,
      topCompanies,
      skillDemand,
      totalActiveJobs: await Job.countDocuments({ isActive: true })
    });

  } catch (error) {
    console.error('Market trends error:', error);
    res.status(500).json({ error: 'Failed to fetch market trends' });
  }
});

module.exports = router;