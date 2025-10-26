# 🎯 AI Resume Matcher

An intelligent resume analysis and job matching platform powered by AI. Upload your resume, get instant ATS scores, personalized feedback, and find jobs that match your skills.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)

## ✨ Features

### 📊 Resume Analysis
- **AI-Powered ATS Score** - Get instant feedback on how well your resume performs with Applicant Tracking Systems
- **Interview Probability** - Understand your chances of landing an interview
- **Skill Gap Analysis** - Identify missing skills and get recommendations
- **Strengths & Improvements** - Receive actionable feedback to improve your resume
- **Keyword Optimization** - Ensure your resume contains the right keywords

### 🎯 Job Matching
- **Smart Job Recommendations** - Get personalized job matches based on your resume
- **Match Score** - See how well you fit each job posting
- **Skills Comparison** - Identify matching and missing skills for each job
- **Real-time Search** - Browse and filter jobs by location, type, and experience level

### 📈 Analytics Dashboard
- Track your progress over time
- Compare multiple resume versions
- Monitor application statistics
- View skill development trends

## 🚀 Tech Stack

### Frontend
- **React** 18 with Hooks
- **React Router** for navigation
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for fast development

### Backend
- **Node.js** & **Express.js**
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **OpenAI API** (GPT-3.5-Turbo) for resume analysis
- **pdf-parse** & **mammoth** for document parsing
- **bcryptjs** for password hashing

### Additional Tools
- **express-fileupload** for file handling
- **express-rate-limit** for API protection
- **helmet** for security headers
- **CORS** enabled

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **MongoDB** (local or MongoDB Atlas)
- **OpenAI API Key** (optional - falls back to mock analysis)
- **npm** or **yarn**

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-resume-matcher.git
cd ai-resume-matcher
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/resume-matcher
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume-matcher

# JWT Secret (Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=your-secret-key-here

# OpenAI API (Optional - will use mock analysis if not provided)
OPENAI_API_KEY=your-openai-api-key-here

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=AI Resume Matcher
```

### 4. Seed Sample Jobs (Optional)

```bash
cd backend
node scripts/seedJobs.js
```

## 🎮 Running the Application

### Development Mode

**Start Backend:**
```bash
cd backend
npm start
# or with nodemon for auto-restart
nodemon server.js
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

### Production Mode

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Start Backend:**
```bash
cd backend
NODE_ENV=production node server.js
```

## 📁 Project Structure

```
ai-resume-matcher/
├── backend/
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── models/
│   │   └── Resume.js         # MongoDB schemas (User, Resume, Job)
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── resume.js        # Resume upload & analysis
│   │   ├── jobs.js          # Job matching & search
│   │   └── analytics.js     # Dashboard statistics
│   ├── services/
│   │   ├── resumeAnalyzer.js    # AI resume analysis
│   │   └── jobMatcher.js        # Job matching algorithm
│   ├── scripts/
│   │   └── seedJobs.js      # Database seeding
│   ├── .env                 # Environment variables
│   ├── server.js            # Express server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ResumeCard.jsx
│   │   │   └── JobCard.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ResumeUpload.jsx
│   │   │   ├── ResumeAnalysis.jsx
│   │   │   ├── JobMatches.jsx
│   │   │   └── Analytics.jsx
│   │   ├── services/
│   │   │   └── api.js       # Axios API client
│   │   ├── store/
│   │   │   └── useStore.js  # Zustand state management
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Resume Management
- `POST /api/resume/upload` - Upload & analyze resume (protected)
- `GET /api/resume/history` - Get user's resumes (protected)
- `GET /api/resume/:id` - Get specific resume (protected)
- `DELETE /api/resume/:id` - Delete resume (protected)

### Job Matching
- `GET /api/jobs/search` - Search jobs with filters (protected)
- `POST /api/jobs/match` - Get matched jobs for resume (protected)
- `GET /api/jobs/:id` - Get job details (protected)
- `POST /api/jobs/:id/analyze-fit` - Analyze fit for specific job (protected)
- `GET /api/jobs/recommendations/:resumeId` - Get personalized recommendations (protected)

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard stats (protected)
- `GET /api/analytics/resume-performance` - Resume performance over time (protected)
- `GET /api/analytics/skill-trends` - Skill gap trends (protected)

## 🎨 Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Resume Analysis
![Resume Analysis](docs/screenshots/analysis.png)

### Job Matches
![Job Matches](docs/screenshots/jobs.png)

## 🤖 AI Features

### Resume Analysis (GPT-3.5-Turbo)
- Analyzes resume content for ATS compatibility
- Identifies strengths and areas for improvement
- Extracts key skills and keywords
- Calculates interview probability
- Provides skill gap analysis

### Fallback Mode
If OpenAI API is unavailable, the system automatically falls back to a mock analyzer that:
- Extracts skills using pattern matching
- Calculates scores based on content metrics
- Provides relevant feedback based on resume length and structure

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Helmet security headers
- Input validation
- SQL injection protection (MongoDB ODM)

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Make sure MongoDB is running
mongod

# Or use MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://...
```

### OpenAI API Errors
```bash
# If you get "model not found" error, use gpt-3.5-turbo
# Or leave OPENAI_API_KEY empty to use mock analysis
```

### Port Already in Use
```bash
# Change port in .env file
PORT=5001  # Backend
# or
VITE_PORT=3001  # Frontend in vite.config.js
```

### File Upload Issues
```bash
# Ensure tmp directory exists
mkdir /tmp

# Check file size limits in server.js
limits: { fileSize: 5 * 1024 * 1024 }  // 5MB
```

## 📝 Environment Variables

### Backend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port | Yes |
| MONGODB_URI | MongoDB connection string | Yes |
| JWT_SECRET | Secret for JWT tokens | Yes |
| OPENAI_API_KEY | OpenAI API key | No |
| FRONTEND_URL | Frontend URL for CORS | Yes |
| NODE_ENV | Environment (development/production) | No |

### Frontend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| VITE_API_URL | Backend API URL | Yes |
| VITE_APP_NAME | Application name | No |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Bishwajeet Patel**
- GitHub: [@BishwajeetPatel](https://github.com/BishwajeetPatel)
- LinkedIn: [bishwajeet-patel](https://linkedin.com/in/bishwajeet-patel)
- Email: bishwajeetpatelbth@gmail.com

## 🙏 Acknowledgments

- OpenAI for GPT-3.5-Turbo API
- React team for the amazing framework
- MongoDB for the database
- All open-source contributors

## 📞 Support

For support, email bishwajeetpatelbth@gmail.com or open an issue in the repository.

## 🗺️ Roadmap

- [ ] Real-time job scraping from job boards
- [ ] Resume builder with templates
- [ ] Email notifications for job matches
- [ ] Interview preparation resources
- [ ] Salary insights and negotiation tips
- [ ] Cover letter generator
- [ ] LinkedIn profile optimization
- [ ] Advanced analytics with charts
- [ ] Mobile application (React Native)
- [ ] Chrome extension for quick analysis

---

⭐ **Star this repository if you find it helpful!**