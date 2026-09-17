🚀 Job Application Tracker + Resume Analyzer

A full-stack SaaS-style web application that helps users track job applications and analyze resumes using ATS-style scoring.

🔗 Live Demo: (Add your Vercel link)
🔗 Backend API: (Add your Render link)

📌 Features

🧑‍💼 Authentication
Email & Password Login / Signup
Google Authentication (OAuth)
Secure JWT-based authentication
Protected routes

📊 Job Application Tracking
Add, edit, and delete job applications
Track job status:
Applied
Interview
Rejected
Inline status update (dropdown)
Notes and job link support
Search and filter jobs
Sort jobs (optional)

📈 Dashboard
Total job count
Status-based statistics
Clean, responsive UI

🧠 Resume Analyzer (ATS-style)
Upload resume (PDF)
Optional Job Description input
Keyword matching (resume vs job description)
Detect:
Missing keywords
Matched keywords
Resume sections (skills, experience, etc.)
Generate:
ATS score (0–100)
Improvement suggestions

🎨 User Experience
Clean SaaS-style UI (Tailwind CSS)
Responsive design
Loading & error states
Smooth interactions

🛠️ Tech Stack
Frontend
React (Vite)
Tailwind CSS
Axios
Lucide React Icons
Backend
Node.js
Express.js
MongoDB (Mongoose)
Authentication
JWT (JSON Web Token)
bcrypt
Google OAuth


🔐 Authentication Flow
User logs in via email/password or Google
Backend verifies credentials
JWT token is generated
Token stored in localStorage
Protected routes use middleware

🧠 Resume Analyzer Logic
The analyzer uses a rule-based ATS scoring system:
Keyword Matching (50%)
Section Detection (30%)
Formatting Checks (20%)

Outputs:

ATS Score
Missing Keywords
Suggestions
