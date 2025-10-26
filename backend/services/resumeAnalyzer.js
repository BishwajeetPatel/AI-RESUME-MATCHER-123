// services/resumeAnalyzer.js - AI-Powered Resume Analysis
const OpenAI = require('openai');

class ResumeAnalyzer {
  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      this.hasOpenAI = true;
    } else {
      this.hasOpenAI = false;
      console.log('⚠️ OpenAI API key not found, will use mock analysis');
    }
  }

  // Main resume analysis function
  async analyzeResume(resumeText) {
    // Use OpenAI if available, otherwise fall back to mock
    if (this.hasOpenAI) {
      try {
        return await this.openAIAnalyze(resumeText);
      } catch (error) {
        console.error('OpenAI analysis failed, using mock:', error.message);
        return this.mockAnalyze(resumeText);
      }
    } else {
      return this.mockAnalyze(resumeText);
    }
  }

  // Real OpenAI Analysis
  async openAIAnalyze(resumeText) {
    console.log('🤖 Using OpenAI GPT-3.5-Turbo for analysis...');

    const prompt = `Analyze the following resume and provide a comprehensive evaluation in JSON format:

Resume:
${resumeText.substring(0, 3000)} // Limit to 3000 chars to save tokens

Provide analysis in this exact JSON structure (valid JSON only, no markdown):
{
  "atsScore": <number 0-100>,
  "overallMatch": <number 0-100>,
  "interviewProbability": <number 0-100>,
  "strengths": [<array of 4-5 specific strengths>],
  "improvements": [<array of 4-5 actionable improvements>],
  "skillGaps": [
    {"skill": "<skill name>", "importance": "High|Medium|Low"}
  ],
  "keySkills": [<extracted technical and soft skills>],
  "experience": {
    "years": <estimated years>,
    "industries": [<list of industries>],
    "roles": [<list of roles>]
  },
  "keywords": [<ATS-friendly keywords>],
  "formatting": {
    "score": <number 0-100>,
    "issues": [<formatting problems>]
  }
}`;

    const completion = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert resume reviewer. Return ONLY valid JSON, no markdown or explanations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    let analysisText = completion.choices[0].message.content.trim();
    
    // Clean up any markdown formatting
    analysisText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const analysis = JSON.parse(analysisText);
    
    // Add metadata
    analysis.analyzedAt = new Date().toISOString();
    analysis.modelUsed = "gpt-3.5-turbo";
    
    console.log('✅ OpenAI analysis complete - ATS Score:', analysis.atsScore);
    return analysis;
  }

  // Mock analyzer (fallback)
  mockAnalyze(resumeText) {
    console.log('🤖 Using Mock Analyzer...');
    
    const lines = resumeText.split('\n').filter(line => line.trim());
    const hasEmail = resumeText.includes('@');
    const hasPhone = /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
    
    // Extract skills
    const techSkills = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'MongoDB', 
      'SQL', 'Git', 'AWS', 'Docker', 'TypeScript', 'Angular', 'Vue',
      'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Go', 'Rust',
      'HTML', 'CSS', 'REST API', 'GraphQL', 'Redis', 'PostgreSQL',
      'MySQL', 'Express', 'Django', 'Flask', 'Spring', 'Laravel',
      'Kubernetes', 'Jenkins', 'TensorFlow', 'PyTorch', 'Pandas'
    ];
    
    const foundSkills = techSkills.filter(skill => 
      resumeText.toLowerCase().includes(skill.toLowerCase())
    );
    
    // Extract experience
    const yearMatches = resumeText.match(/(\d+)\+?\s*(years?|yrs?)/gi) || [];
    const experienceYears = yearMatches.length > 0 
      ? Math.max(...yearMatches.map(m => parseInt(m.match(/\d+/)[0])))
      : 2;
    
    // Education check
    const hasEducation = resumeText.toLowerCase().includes('bachelor') || 
                        resumeText.toLowerCase().includes('master') ||
                        resumeText.toLowerCase().includes('b.tech') ||
                        resumeText.toLowerCase().includes('degree');
    
    // Calculate scores
    const baseScore = 70;
    const skillBonus = Math.min(foundSkills.length * 2, 15);
    const educationBonus = hasEducation ? 5 : 0;
    const contactBonus = (hasEmail && hasPhone) ? 5 : 0;
    const lengthBonus = resumeText.length > 2000 ? 5 : 0;
    
    const atsScore = Math.min(baseScore + skillBonus + educationBonus + contactBonus + lengthBonus, 100);
    
    const analysis = {
      atsScore: atsScore,
      overallMatch: Math.min(atsScore + Math.floor(Math.random() * 10) - 5, 100),
      interviewProbability: Math.min(atsScore - Math.floor(Math.random() * 15) + 5, 95),
      
      strengths: [
        foundSkills.length > 5 ? 'Strong technical skill set with ' + foundSkills.length + ' technologies' : 'Good foundation of technical skills',
        hasEducation ? 'Relevant educational background from recognized institution' : 'Practical experience demonstrated',
        resumeText.length > 2000 ? 'Comprehensive work experience with detailed descriptions' : 'Clear and concise presentation style',
        hasEmail && hasPhone ? 'Complete contact information provided' : 'Basic contact details included'
      ],
      
      improvements: [
        foundSkills.length < 5 ? 'Expand technical skills section with more relevant technologies' : null,
        !resumeText.toLowerCase().includes('achieved') && !resumeText.toLowerCase().includes('increased') 
          ? 'Add quantifiable achievements with metrics (e.g., "Increased performance by 30%")' : null,
        resumeText.length < 1500 ? 'Provide more details about projects and responsibilities' : null,
        !resumeText.toLowerCase().includes('led') && !resumeText.toLowerCase().includes('managed')
          ? 'Highlight leadership and project management experience' : null,
        'Optimize keyword density for better ATS compatibility',
        !resumeText.toLowerCase().includes('certification') ? 'Consider adding relevant certifications' : null
      ].filter(Boolean).slice(0, 5),
      
      skillGaps: [
        { skill: 'Cloud Computing (AWS/Azure/GCP)', importance: 'High' },
        { skill: 'CI/CD and DevOps practices', importance: 'High' },
        { skill: 'System Design & Architecture', importance: 'Medium' },
        { skill: 'Microservices Architecture', importance: 'Medium' },
        { skill: 'Container Orchestration', importance: 'Medium' },
        { skill: 'Test-Driven Development', importance: 'Low' }
      ].slice(0, Math.floor(Math.random() * 2) + 4),
      
      keySkills: foundSkills.length > 0 
        ? foundSkills.slice(0, 12)
        : ['Communication', 'Problem Solving', 'Teamwork', 'Programming', 'Analysis'],
      
      experience: {
        years: experienceYears,
        industries: ['Technology', 'Software Development'],
        roles: resumeText.toLowerCase().includes('senior') ? ['Senior Developer', 'Engineer'] 
              : resumeText.toLowerCase().includes('lead') ? ['Lead Developer', 'Tech Lead']
              : ['Software Engineer', 'Developer']
      },
      
      keywords: foundSkills.length > 0 ? foundSkills : ['Software', 'Development', 'Engineering'],
      
      formatting: {
        score: (hasEmail && hasPhone && hasEducation) ? 90 : 75,
        issues: [
          !hasEmail ? 'Email address not clearly visible' : null,
          !hasPhone ? 'Phone number not found' : null,
          !hasEducation ? 'Education section could be more prominent' : null
        ].filter(Boolean)
      },
      
      analyzedAt: new Date().toISOString(),
      modelUsed: 'mock-analyzer-v2'
    };
    
    console.log('✅ Mock analysis complete - ATS Score:', analysis.atsScore);
    return analysis;
  }
}

module.exports = ResumeAnalyzer;