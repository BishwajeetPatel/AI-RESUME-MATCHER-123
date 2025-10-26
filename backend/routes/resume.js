// routes/resume.js - Resume Analysis Routes
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const ResumeAnalyzer = require('../services/resumeAnalyzer');
const { Resume } = require('../models/Resume');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;

// POST /api/resume/upload - Upload and analyze resume
router.post('/upload', auth, async (req, res) => {
  try {
    console.log('📁 Upload request received');

    if (!req.files || !req.files.resume) {
      console.log('❌ No file in request');
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    const resumeFile = req.files.resume;
    console.log('📄 File received:', resumeFile.name, resumeFile.mimetype);
    console.log('📄 File size:', resumeFile.size);
    console.log('📄 Temp path:', resumeFile.tempFilePath);
    
    // Validate file type
    const allowedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(resumeFile.mimetype)) {
      console.log('❌ Invalid file type:', resumeFile.mimetype);
      return res.status(400).json({ 
        error: 'Invalid file type. Please upload PDF or DOC/DOCX' 
      });
    }

    // Validate file size (5MB max)
    if (resumeFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({ 
        error: 'File too large. Maximum size is 5MB' 
      });
    }

    // Extract text from resume
    let resumeText = '';
    let fileBuffer;
    
    // Read file from temp path or data buffer
    if (resumeFile.tempFilePath) {
      console.log('📖 Reading from temp file...');
      fileBuffer = await fs.readFile(resumeFile.tempFilePath);
    } else {
      console.log('📖 Using data buffer...');
      fileBuffer = resumeFile.data;
    }
    
    if (resumeFile.mimetype === 'application/pdf') {
      console.log('📖 Parsing PDF...');
      try {
        const pdfData = await pdfParse(fileBuffer);
        resumeText = pdfData.text;
        console.log('✅ PDF parsed, text length:', resumeText.length);
      } catch (pdfError) {
        console.error('PDF Parse Error:', pdfError);
        return res.status(400).json({ 
          error: 'Failed to parse PDF. Please ensure your PDF contains selectable text (not scanned images).' 
        });
      }
    } else {
      console.log('📖 Parsing DOCX...');
      try {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        resumeText = result.value;
        console.log('✅ DOCX parsed, text length:', resumeText.length);
      } catch (docError) {
        console.error('DOCX Parse Error:', docError);
        return res.status(400).json({ 
          error: 'Failed to parse document. Please try a different file.' 
        });
      }
    }

    // Clean up temp file if it exists
    if (resumeFile.tempFilePath) {
      try {
        await fs.unlink(resumeFile.tempFilePath);
        console.log('🗑️ Temp file cleaned up');
      } catch (err) {
        console.log('⚠️ Failed to delete temp file:', err.message);
      }
    }

    // Validate extracted text
    if (!resumeText || resumeText.trim().length < 50) {
      console.log('❌ Insufficient text extracted. Length:', resumeText.length);
      return res.status(400).json({ 
        error: 'Could not extract enough text from resume. Please ensure your resume contains readable text.' 
      });
    }

    console.log('📝 Extracted text preview:', resumeText.substring(0, 200));

    // Analyze resume using AI
    console.log('🤖 Starting AI analysis...');
    const analyzer = new ResumeAnalyzer();
    const analysis = await analyzer.analyzeResume(resumeText);
    console.log('✅ AI analysis complete');

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
    console.log('✅ Resume saved to database:', resume._id);

    res.status(200).json({
      success: true,
      resumeId: resume._id,
      analysis: analysis
    });

  } catch (error) {
    console.error('❌ Resume upload error:', error);
    res.status(500).json({ 
      error: 'Failed to process resume', 
      details: error.message 
    });
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