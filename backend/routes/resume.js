// routes/resume.js - Resume Analysis Routes
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const ResumeAnalyzer = require('../services/resumeAnalyzer');
const Resume = require('../models/Resume');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

// POST /api/resume/upload - Upload and analyze resume
router.post('/upload', auth, async (req, res) => {
  try {
    if (!req.files || !req.files.resume) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    const resumeFile = req.files.resume;
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 
                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(resumeFile.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type. Please upload PDF or DOC/DOCX' });
    }

    // Extract text from resume
    let resumeText = '';
    
    if (resumeFile.mimetype === 'application/pdf') {
      const pdfData = await pdfParse(resumeFile.data);
      resumeText = pdfData.text;
    } else {
      const result = await mammoth.extractRawText({ buffer: resumeFile.data });
      resumeText = result.value;
    }

    // Analyze resume using AI
    const analyzer = new ResumeAnalyzer();
    const analysis = await analyzer.analyzeResume(resumeText);

    // Save to database
    const resume = new Resume({
      userId: req.user.id,
      fileName: resumeFile.name,
      fileSize: resumeFile.size,
      content: resumeText,
      analysis: analysis,
      uploadedAt: new Date()
    });

    await resume.save();

    res.status(200).json({
      success: true,
      resumeId: resume._id,
      analysis: analysis
    });

  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ error: 'Failed to process resume', details: error.message });
  }
});

// GET /api/resume/history - Get user's resume history
router.get('/history', auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id })
      .sort({ uploadedAt: -1 })
      .limit(10)
      .select('-content'); // Exclude full content for performance

    res.status(200).json({ resumes });
  } catch (error) {
    console.error('Resume history error:', error);
    res.status(500).json({ error: 'Failed to fetch resume history' });
  }
});

// GET /api/resume/:id - Get specific resume analysis
router.get('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.status(200).json({ resume });
  } catch (error) {
    console.error('Resume fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

// POST /api/resume/:id/improve - Get improvement suggestions
router.post('/:id/improve', auth, async (req, res) => {
  try {
    const { targetJob } = req.body;
    
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    const analyzer = new ResumeAnalyzer();
    const improvements = await analyzer.getImprovementSuggestions(
      resume.content,
      targetJob
    );

    res.status(200).json({ improvements });
  } catch (error) {
    console.error('Improvement suggestions error:', error);
    res.status(500).json({ error: 'Failed to generate improvements' });
  }
});

// DELETE /api/resume/:id - Delete resume
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await Resume.deleteOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.status(200).json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Resume delete error:', error);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

module.exports = router;