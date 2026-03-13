import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { Link } from 'react-router-dom';

const About = () => {
  // State for animated numbers
  const [students, setStudents] = useState(0);
  const [companies, setCompanies] = useState(0);
  const [placementIncrease, setPlacementIncrease] = useState(0);
  const [satisfaction, setSatisfaction] = useState(0);

  // Target values for the animation
  const targetStudents = 25000;
  const targetCompanies = 400;
  const targetPlacementIncrease = 20;
  const targetSatisfaction = 95;

  // Animation duration in milliseconds
  const duration = 2000; // 2 seconds

  useEffect(() => {
    const animateNumber = (setter, target, step, suffix = '') => {
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          setter(target + suffix);
          clearInterval(timer);
        } else {
          setter(Math.floor(current) + suffix);
        }
      }, duration / (target / step)); // Adjust interval for smoother animation based on target and step
      return () => clearInterval(timer);
    };

    // Start animations for each stat
    const cleanupStudents = animateNumber(setStudents, targetStudents, targetStudents / (duration / 10), '+'); // e.g., step 1000 for 25000
    const cleanupCompanies = animateNumber(setCompanies, targetCompanies, targetCompanies / (duration / 10), '+'); // e.g., step 10 for 400
    const cleanupPlacement = animateNumber(setPlacementIncrease, targetPlacementIncrease, 1, '%');
    const cleanupSatisfaction = animateNumber(setSatisfaction, targetSatisfaction, 1, '%');

    // Cleanup function to clear intervals on component unmount
    return () => {
      cleanupStudents();
      cleanupCompanies();
      cleanupPlacement();
      cleanupSatisfaction();
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap');
          
          .about-page {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(180deg, #f0f4f8 0%, #ffffff 100%); /* Subtle light gradient */
            color: #000000;
            min-height: 100vh;
            width: 100%;
            padding: 4rem 1rem;
            box-sizing: border-box;
          }
          
          .about-content-wrapper {
            max-width: 1280px;
            margin: 0 auto;
            padding: 3rem;
            background-color: #ffffff;
            border-radius: 1.5rem; /* Smoother corners */
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08); /* Stronger, modern shadow */
          }
          
          .about-title {
            font-size: 3rem; /* Larger title */
            font-weight: 900;
            color: #0c1a2e; /* Darker primary color */
            margin-bottom: 0.5rem;
            text-align: center;
          }

          .about-tagline {
            font-size: 1.25rem;
            font-weight: 500;
            color: #16a34a; /* Accent color */
            margin-bottom: 2.5rem;
            text-align: center;
            letter-spacing: 0.5px;
          }
          
          .about-subtitle {
            font-size: 1.05rem;
            line-height: 1.8;
            margin-bottom: 2.5rem;
            color: #4b5563;
          }
          
          .about-section-title {
            font-size: 2rem;
            font-weight: 800;
            color: #1a2b4b; /* Dark title color */
            margin-bottom: 1.5rem;
            border-bottom: 3px solid #eab308; /* Highlighted underline */
            padding-bottom: 0.5rem;
            display: inline-block;
          }
          
          .feature-card {
            background-color: #f0f8ff; /* Light blue background for features */
            padding: 2rem;
            border-radius: 0.75rem;
            border-left: 5px solid #16a34a;
            margin-bottom: 1.5rem;
            transition: all 0.3s ease;
            height: 100%;
          }

          .feature-card:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 0 10px 20px rgba(22, 163, 74, 0.15); /* Shadow matching accent color */
          }

          .feature-list-item {
            list-style: none;
            position: relative;
            padding-left: 2rem;
            margin-bottom: 0.75rem;
            color: #333333;
            font-weight: 500;
          }
          
          .feature-list-item::before {
            content: '→';
            position: absolute;
            left: 0;
            top: 0;
            color: #16a34a;
            font-weight: bold;
            font-size: 1.2rem;
          }

          /* --- Stats/Metrics Grid (Added animation styles) --- */
          .stats-grid {
            display: flex;
            justify-content: space-around;
            text-align: center;
            margin-bottom: 3rem;
            padding: 2rem 0;
            border-top: 1px solid #e5e7eb;
            border-bottom: 1px solid #e5e7eb;
          }

          .stat-item h3 {
            font-size: 2.5rem;
            font-weight: 900;
            color: #0c1a2e;
            margin-bottom: 0.25rem;
            transition: color 0.3s ease; /* Smooth color change */
          }

          .stat-item h3:hover {
            color: #16a34a; /* Highlight on hover */
          }

          .stat-item p {
            font-size: 0.9rem;
            color: #4b5563;
            font-weight: 600;
          }

          /* --- Tech Section (Retained) --- */
          .tech-section {
            background-color: #f9fafb;
            padding: 2rem;
            border-radius: 1rem;
            margin-bottom: 3rem;
          }

          .tech-list {
            list-style: none;
            padding: 0;
            display: flex;
            flex-wrap: wrap;
            gap: 1.5rem;
          }

          .tech-item {
            font-size: 1rem;
            font-weight: 600;
            color: #1a2b4b;
            background-color: #e5e7eb;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            transition: background-color 0.3s ease;
          }

          .tech-item:hover {
            background-color: #d1d5db;
          }

          /* --- Gemini/AI Specific Styles (Retained) --- */
          .gemini-box {
            margin-top: 4rem;
            background-color: #0c1a2e;
            color: #ffffff;
            padding: 3rem;
            border-radius: 1.5rem;
            text-align: center;
            border: 2px solid #4ade80;
            box-shadow: 0 0 25px rgba(74, 222, 128, 0.5);
            animation: pulse 2s infinite alternate;
          }

          .gemini-title {
            color: #4ade80;
            font-size: 2.5rem;
            font-weight: 900;
            margin-bottom: 1rem;
          }

          .gemini-text {
            font-size: 1.15rem;
            color: #e5e7eb;
            line-height: 1.7;
          }
          
          @keyframes pulse {
            from { box-shadow: 0 0 15px rgba(74, 222, 128, 0.3); }
            to { box-shadow: 0 0 30px rgba(74, 222, 128, 0.8); }
          }
          
          /* Responsive adjustments */
          @media (max-width: 768px) {
            .about-title {
              font-size: 2.2rem;
            }
            .about-content-wrapper {
              padding: 1.5rem;
            }
            .feature-list-item {
              padding-left: 1.5rem;
            }
            .stats-grid {
              flex-wrap: wrap; /* Allow stats to wrap on smaller screens */
            }
            .stat-item {
              flex: 1 1 45%; /* Two items per row */
              margin-bottom: 1.5rem;
            }
          }
        `}
      </style>
      <div className="about-page">
        <div className="about-content-wrapper">
          <h1 className="about-title">AI Placement Portal 🧠</h1>
          <p className="about-tagline">Intelligent Solutions for Tomorrow's Workforce</p>
          
          <p className="about-subtitle">
            The AI Placement Portal is a smart and interactive web-based platform designed to **streamline the placement process**
            for colleges and universities using artificial intelligence. We provide dedicated dashboards for students, 
            training & placement officers (TPOs), and recruiters to manage everything from personalized skill-gap analysis 
            to automated offer generation. We are building the future of campus recruitment.
          </p>

          {/* -------------------- FOUNDING STORY -------------------- */}
          <h2 className="about-section-title">Our Founding Story 💡</h2>
          <p className="about-subtitle">
            The idea for the AI Placement Portal was born from a simple frustration: the manual and often biased nature of traditional campus placements. Our founders—a team of educators and data scientists—realized the immense potential of **leveraging Big Data and Machine Learning** to create a fair, efficient, and student-centric system. We spent two years perfecting our core algorithm, focusing on predictive modeling and skill-to-job matching, leading to the launch of the first fully AI-integrated placement platform in 2024.
          </p>

          {/* -------------------- KEY METRICS/IMPACT (NOW ANIMATED) -------------------- */}
          <h2 className="about-section-title">Key Impact Metrics 📈</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <h3>{students}</h3> {/* Animated value */}
              <p>Registered Students</p>
            </div>
            <div className="stat-item">
              <h3>{companies}</h3> {/* Animated value */}
              <p>Recruiting Companies</p>
            </div>
            <div className="stat-item">
              <h3>{placementIncrease}</h3> {/* Animated value */}
              <p>Increase in Placement Rate</p>
            </div>
            <div className="stat-item">
              <h3>{satisfaction}</h3> {/* Animated value */}
              <p>Student Satisfaction Score</p>
            </div>
          </div>
          <hr style={{ borderTop: '1px solid #e5e7eb' }} />
          
          {/* -------------------- FEATURE BREAKDOWN -------------------- */}
          <h2 className="about-section-title">Core Platform Features</h2>
          <div className="row mt-5 g-4">
            
            <div className="col-md-4">
              <div className="feature-card">
                <h4 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a2b4b' }}>🎓 For Students</h4>
                <ul className="about-list-group">
                  <li className="feature-list-item">AI Resume Analyzer & Score</li>
                  <li className="feature-list-item">AI-Powered Interview Practice</li>
                  <li className="feature-list-item">Personalized Learning Path</li>
                  <li className="feature-list-item">Real-time Placement Tracker</li>
                </ul>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="feature-card">
                <h4 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a2b4b' }}>👨‍🏫 For Admin/TPO</h4>
                <ul className="about-list-group">
                  <li className="feature-list-item">Batch Skill Gap Analysis</li>
                  <li className="feature-list-item">AI-Based Auto Shortlisting</li>
                  <li className="feature-list-item">Comprehensive Placement Analytics</li>
                  <li className="feature-list-item">Streamlined Job Posting Management</li>
                </ul>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="feature-card">
                <h4 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a2b4b' }}>💼 For Recruiters</h4>
                <ul className="about-list-group">
                  <li className="feature-list-item">Post Jobs/Internships Easily</li>
                  <li className="feature-list-item">AI Matchmaking for Candidates</li>
                  <li className="feature-list-item">One-Click Candidate Reports</li>
                  <li className="feature-list-item">Detailed Hiring Analytics</li>
                </ul>
              </div>
            </div>
            
          </div>
          
          {/* -------------------- TECHNOLOGY STACK -------------------- */}
          <h2 className="about-section-title" style={{ marginTop: '3rem' }}>Powering Our Intelligence ⚙️</h2>
          <p className="about-subtitle">
            Our platform is built on a modern, scalable MERN stack (MongoDB, Express, React, Node.js) architecture. The **AI engine** is driven by robust Python libraries and cloud-native services, ensuring high uptime, fast processing, and military-grade data security.
          </p>
          <div className="tech-section">
            <h5 style={{ color: '#1a2b4b', fontWeight: 700, marginBottom: '1rem' }}>Key Technologies:</h5>
            <ul className="tech-list">
              <li className="tech-item">React & Bootstrap (Frontend)</li>
              <li className="tech-item">Node.js / Express (Backend)</li>
              <li className="tech-item">MongoDB (Database)</li>
              <li className="tech-item">Python & scikit-learn (AI/ML)</li>
              <li className="tech-item">Cloudflare (CDN & Security)</li>
              <li className="tech-item">Google Cloud Platform (Hosting)</li>
            </ul>
          </div>
          
          {/* -------------------- GEMINI/AI SECTION -------------------- */}
          <div className="gemini-box">
            <h4 className="gemini-title">Ask Gemini: Your Smart Career Companion</h4>
            <p className="gemini-text">
              Our core intelligence, powered by **Gemini**, doesn't just process data—it guides careers. 
              It synthesizes market demand, your resume score, and academic performance to give you a 
              precise **Career Readiness Index**. Ready to see your future track?
            </p>
            <div className="mt-4">
              <Link to="/login" className="btn" style={{ backgroundColor: '#4ade80', color: '#0c1a2e', fontWeight: 700, padding: '0.9rem 2.5rem' }}>
                Analyze My Resume
              </Link>
            </div>
          </div>
          
          {/* -------------------- MISSION & VISION -------------------- */}
          <div className="row mt-5 g-4">
            <div className="col-md-6">
              <div className="about-highlight-box">
                <h4 className="about-section-title" style={{ color: '#eab308', borderBottom: 'none' }}>Our Mission</h4>
                <p className="about-subtitle" style={{ marginBottom: '0' }}>
                  To **bridge the talent gap** by providing an intelligent, data-driven platform that empowers students 
                  to achieve their career goals and enables organizations to find the perfect talent efficiently.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="about-highlight-box">
                <h4 className="about-section-title" style={{ color: '#eab308', borderBottom: 'none' }}>Our Vision</h4>
                <p className="about-subtitle" style={{ marginBottom: '0' }}>
                  To be the **leading global platform** for talent acquisition, leveraging AI to create a future 
                  where every student finds a rewarding career and every company discovers their ideal candidate.
                </p>
              </div>
            </div>
          </div>

          {/* -------------------- CALL TO ACTION -------------------- */}
          <div className="about-call-to-action">
            <h4 className="about-section-title" style={{ color: '#1a2b4b', borderBottom: 'none' }}>Ready to Revolutionize Your Placement?</h4>
            <p className="about-subtitle">Join thousands of students and recruiters already benefiting from AI intelligence!</p>
            <Link to="/register" className="btn">Sign Up Now</Link>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default About;