// scripts/seedJobs.js - Seed Sample Job Data
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Job } = require('../models/Resume');

dotenv.config();

const sampleJobs = [
  {
    title: 'Full Stack Developer',
    company: 'Tech Innovations Inc.',
    location: 'Bengaluru, India',
    jobType: 'Full-time',
    experienceLevel: 'Mid',
    salary: { min: 800000, max: 1500000, currency: 'INR' },
    description: 'We are looking for a Full Stack Developer with experience in React, Node.js, and MongoDB. You will work on building scalable web applications and APIs.',
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express.js', 'REST API'],
    preferredSkills: ['TypeScript', 'Docker', 'AWS', 'Redis'],
    experienceRequired: 2,
    benefits: ['Health Insurance', 'Work from Home', 'Flexible Hours'],
    applicationUrl: 'https://example.com/apply',
    isActive: true,
    postedDate: new Date(),
    applicants: 45
  },
  {
    title: 'Software Engineer - Backend',
    company: 'CloudScale Systems',
    location: 'Bengaluru, India',
    jobType: 'Full-time',
    experienceLevel: 'Mid',
    salary: { min: 1000000, max: 1800000, currency: 'INR' },
    description: 'Join our backend team to build high-performance microservices using Node.js, Python, and cloud platforms.',
    requiredSkills: ['Node.js', 'Python', 'MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes'],
    preferredSkills: ['AWS', 'Redis', 'Microservices', 'CI/CD'],
    experienceRequired: 3,
    benefits: ['Health Insurance', 'Stock Options', 'Learning Budget'],
    applicationUrl: 'https://example.com/apply',
    isActive: true,
    postedDate: new Date(),
    applicants: 67
  },
  {
    title: 'Frontend Developer - React',
    company: 'DesignHub Technologies',
    location: 'Remote',
    jobType: 'Full-time',
    experienceLevel: 'Entry',
    salary: { min: 600000, max: 1000000, currency: 'INR' },
    description: 'Create beautiful, responsive web applications using React and modern CSS frameworks.',
    requiredSkills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS'],
    preferredSkills: ['TypeScript', 'Next.js', 'Redux', 'Git'],
    experienceRequired: 1,
    benefits: ['Remote Work', 'Flexible Hours', 'Health Insurance'],
    applicationUrl: 'https://example.com/apply',
    isActive: true,
    postedDate: new Date(),
    applicants: 123
  },
  {
    title: 'MERN Stack Developer',
    company: 'StartupLabs',
    location: 'Hyderabad, India',
    jobType: 'Full-time',
    experienceLevel: 'Mid',
    salary: { min: 900000, max: 1600000, currency: 'INR' },
    description: 'Build cutting-edge applications using MongoDB, Express, React, and Node.js.',
    requiredSkills: ['MongoDB', 'Express.js', 'React', 'Node.js', 'JavaScript', 'REST API'],
    preferredSkills: ['TypeScript', 'Redux', 'Docker', 'AWS', 'CI/CD'],
    experienceRequired: 2,
    benefits: ['Health Insurance', 'Stock Options', 'Team Outings'],
    applicationUrl: 'https://example.com/apply',
    isActive: true,
    postedDate: new Date(),
    applicants: 89
  },
  {
    title: 'Junior Software Developer',
    company: 'NextGen Solutions',
    location: 'Pune, India',
    jobType: 'Full-time',
    experienceLevel: 'Entry',
    salary: { min: 500000, max: 800000, currency: 'INR' },
    description: 'Start your career with us! Looking for fresh graduates with strong programming fundamentals.',
    requiredSkills: ['JavaScript', 'HTML', 'CSS', 'Git', 'Problem Solving'],
    preferredSkills: ['React', 'Node.js', 'MongoDB', 'SQL'],
    experienceRequired: 0,
    benefits: ['Training Programs', 'Mentorship', 'Health Insurance'],
    applicationUrl: 'https://example.com/apply',
    isActive: true,
    postedDate: new Date(),
    applicants: 234
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudOps Inc.',
    location: 'Bengaluru, India',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    salary: { min: 1500000, max: 2500000, currency: 'INR' },
    description: 'Manage cloud infrastructure, CI/CD pipelines, and automation.',
    requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Jenkins', 'Linux'],
    preferredSkills: ['Terraform', 'Ansible', 'Python', 'Monitoring Tools'],
    experienceRequired: 4,
    benefits: ['Health Insurance', 'Stock Options', 'Remote Work'],
    applicationUrl: 'https://example.com/apply',
    isActive: true,
    postedDate: new Date(),
    applicants: 56
  },
  {
    title: 'AI/ML Engineer',
    company: 'DataMinds AI',
    location: 'Remote',
    jobType: 'Full-time',
    experienceLevel: 'Mid',
    salary: { min: 1200000, max: 2000000, currency: 'INR' },
    description: 'Build intelligent applications using machine learning and NLP.',
    requiredSkills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'NLP'],
    preferredSkills: ['Hugging Face', 'LangChain', 'OpenAI API', 'Docker'],
    experienceRequired: 2,
    benefits: ['Remote Work', 'Learning Budget', 'Conferences'],
    applicationUrl: 'https://example.com/apply',
    isActive: true,
    postedDate: new Date(),
    applicants: 78
  },
  {
    title: 'React Native Developer',
    company: 'MobileFirst Apps',
    location: 'Bengaluru, India',
    jobType: 'Full-time',
    experienceLevel: 'Mid',
    salary: { min: 1000000, max: 1700000, currency: 'INR' },
    description: 'Develop cross-platform mobile applications using React Native.',
    requiredSkills: ['React Native', 'JavaScript', 'TypeScript', 'Mobile Development'],
    preferredSkills: ['Redux', 'Firebase', 'Push Notifications', 'App Store Deployment'],
    experienceRequired: 2,
    benefits: ['Health Insurance', 'Flexible Hours', 'Device Allowance'],
    applicationUrl: 'https://example.com/apply',
    isActive: true,
    postedDate: new Date(),
    applicants: 92
  },
  {
    title: 'Backend Developer - Python',
    company: 'DataFlow Systems',
    location: 'Mumbai, India',
    jobType: 'Full-time',
    experienceLevel: 'Mid',
    salary: { min: 1100000, max: 1900000, currency: 'INR' },
    description: 'Build robust backend systems using Python, Django/Flask, and modern databases.',
    requiredSkills: ['Python', 'Django', 'Flask', 'PostgreSQL', 'REST API'],
    preferredSkills: ['Redis', 'Celery', 'Docker', 'AWS', 'Microservices'],
    experienceRequired: 3,
    benefits: ['Health Insurance', 'Work from Home', 'Learning Budget'],
    applicationUrl: 'https://example.com/apply',
    isActive: true,
    postedDate: new Date(),
    applicants: 67
  },
  {
    title: 'Full Stack Java Developer',
    company: 'Enterprise Solutions Ltd.',
    location: 'Bengaluru, India',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    salary: { min: 1400000, max: 2200000, currency: 'INR' },
    description: 'Experienced Java developer needed for enterprise applications with Spring Boot and Hibernate.',
    requiredSkills: ['Java', 'Spring Boot', 'Hibernate', 'Microservices', 'SQL', 'REST API'],
    preferredSkills: ['Docker', 'Kubernetes', 'AWS', 'Redis', 'Kafka'],
    experienceRequired: 5,
    benefits: ['Health Insurance', 'Stock Options', 'Retirement Plan'],
    applicationUrl: 'https://example.com/apply',
    isActive: true,
    postedDate: new Date(),
    applicants: 45
  }
];

async function seedJobs() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🗑️  Clearing existing jobs...');
    await Job.deleteMany({});
    console.log('✅ Existing jobs cleared');

    console.log('📝 Inserting sample jobs...');
    const insertedJobs = await Job.insertMany(sampleJobs);
    console.log(`✅ Inserted ${insertedJobs.length} jobs successfully`);

    console.log('\n📊 Job Summary:');
    insertedJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} at ${job.company} - ${job.location}`);
    });

    console.log('\n✨ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedJobs();