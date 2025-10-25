// services/resumeAnalyzer.js - AI-Powered Resume Analysis
const OpenAI = require('openai');

class ResumeAnalyzer {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  // Main resume analysis function
  async analyzeResume(resumeText) {
    try {
      const prompt = `Analyze the following resume and provide a comprehensive evaluation in JSON format:

Resume:
${resumeText}

Provide analysis in this exact JSON structure:
{
  "atsScore": <number 0-100>,
  "overallMatch": <number 0-100>,
  "interviewProbability": <number 0-100>,
  "strengths": [<array of 4-6 specific strengths>],
  "improvements": [<array of 4-6 actionable improvements>],
  "skillGaps": [
    {"skill": "<skill name>", "importance": "High|Medium|Low"}
  ],
  "keySkills": [<extracted technical and soft skills>],
  "experience": {
    "years": <number>,
    "industries": [<list of industries>],
    "roles": [<list of roles>]
  },
  "keywords": [<ATS-friendly keywords found>],
  "formatting": {
    "score": <number 0-100>,
    "issues": [<formatting problems>]
  }
}

Focus on:
1. ATS compatibility (keyword optimization, formatting)
2. Quantifiable achievements
3. Technical skills relevance
4. Industry-specific terminology
5. Action verbs and impact statements`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert resume reviewer and ATS specialist. Provide detailed, actionable feedback in valid JSON format only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const analysisText = completion.choices[0].message.content;
      
      // Extract JSON from response (handle markdown code blocks)
      let jsonText = analysisText.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }
      
      const analysis = JSON.parse(jsonText);
      
      // Add timestamp and metadata
      analysis.analyzedAt = new Date().toISOString();
      analysis.modelUsed = "gpt-4";
      
      return analysis;

    } catch (error) {
      console.error('Resume analysis error:', error);
      throw new Error('Failed to analyze resume: ' + error.message);
    }
  }

  // Get job-specific match score
  async getJobMatchScore(resumeText, jobDescription) {
    try {
      const prompt = `Compare this resume with the job description and provide a match score:

Resume:
${resumeText}

Job Description:
${jobDescription}

Provide a JSON response with:
{
  "matchScore": <number 0-100>,
  "matchingSkills": [<skills that match>],
  "missingSkills": [<required skills not found>],
  "recommendations": [<specific actions to improve match>],
  "fitAnalysis": "<detailed explanation of fit>"
}`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a technical recruiter analyzing candidate-job fit. Provide detailed matching analysis in JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 1500
      });

      const responseText = completion.choices[0].message.content;
      let jsonText = responseText.trim();
      if (jsonText.includes('```json')) {
        jsonText = jsonText.split('```json')[1].split('```')[0];
      }
      
      return JSON.parse(jsonText);

    } catch (error) {
      console.error('Job match scoring error:', error);
      throw new Error('Failed to calculate job match: ' + error.message);
    }
  }

  // Get improvement suggestions
  async getImprovementSuggestions(resumeText, targetRole = null) {
    try {
      const roleContext = targetRole ? `for a ${targetRole} position` : '';
      
      const prompt = `Provide specific, actionable improvements for this resume ${roleContext}:

Resume:
${resumeText}

Return JSON with:
{
  "contentImprovements": [
    {
      "section": "<section name>",
      "current": "<what's currently there>",
      "suggested": "<improved version>",
      "reason": "<why this is better>"
    }
  ],
  "keywordOptimization": [
    "<keywords to add>"
  ],
  "formattingTips": [
    "<formatting improvements>"
  ],
  "achievementEnhancements": [
    {
      "original": "<current bullet>",
      "improved": "<enhanced with metrics>",
      "impact": "<why this is stronger>"
    }
  ]
}`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a professional resume writer providing specific improvement suggestions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const responseText = completion.choices[0].message.content;
      let jsonText = responseText.trim();
      if (jsonText.includes('```json')) {
        jsonText = jsonText.split('```json')[1].split('```')[0];
      }
      
      return JSON.parse(jsonText);

    } catch (error) {
      console.error('Improvement suggestions error:', error);
      throw new Error('Failed to generate improvements: ' + error.message);
    }
  }

  // Extract skills from resume
  extractSkills(resumeText) {
    const skillCategories = {
      technical: [],
      soft: [],
      tools: [],
      languages: []
    };

    // Common technical skills patterns
    const technicalSkills = [
      'React', 'Node.js', 'Python', 'Java', 'JavaScript', 'TypeScript',
      'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes',
      'AWS', 'Azure', 'GCP', 'CI/CD', 'Git', 'REST API', 'GraphQL'
    ];

    const softSkills = [
      'leadership', 'communication', 'teamwork', 'problem-solving',
      'analytical', 'critical thinking', 'project management'
    ];

    const lowerText = resumeText.toLowerCase();

    // Extract technical skills
    technicalSkills.forEach(skill => {
      if (lowerText.includes(skill.toLowerCase())) {
        skillCategories.technical.push(skill);
      }
    });

    // Extract soft skills
    softSkills.forEach(skill => {
      if (lowerText.includes(skill.toLowerCase())) {
        skillCategories.soft.push(skill);
      }
    });

    return skillCategories;
  }

  // Calculate ATS compatibility score
  calculateATSScore(resumeText, analysis) {
    let score = 0;
    
    // Check for key sections (20 points)
    const requiredSections = ['experience', 'education', 'skills'];
    const lowerText = resumeText.toLowerCase();
    requiredSections.forEach(section => {
      if (lowerText.includes(section)) score += 7;
    });

    // Check for quantifiable achievements (30 points)
    const numbers = resumeText.match(/\d+%|\d+\+|\$\d+/g);
    if (numbers && numbers.length > 0) {
      score += Math.min(30, numbers.length * 5);
    }

    // Check for action verbs (20 points)
    const actionVerbs = ['developed', 'implemented', 'managed', 'led', 'created', 'designed', 'built'];
    const verbCount = actionVerbs.filter(verb => lowerText.includes(verb)).length;
    score += Math.min(20, verbCount * 3);

    // Check for formatting issues (30 points)
    if (!resumeText.includes('\t') && !resumeText.includes('  ')) score += 10;
    if (resumeText.length > 500 && resumeText.length < 5000) score += 10;
    if (!resumeText.includes('http://') || resumeText.includes('https://')) score += 10;

    return Math.min(100, score);
  }
}

module.exports = ResumeAnalyzer;