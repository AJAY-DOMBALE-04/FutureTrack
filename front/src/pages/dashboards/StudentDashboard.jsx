import React from 'react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap');
          
          .dashboard-page {
            font-family: 'Inter', sans-serif;
            background-color: #f0f2f5;
            min-height: 100vh;
            padding: 2rem 1rem;
          }
          
          .dashboard-title {
            font-size: 2.5rem;
            font-weight: 800;
            color: #1a2b4b;
            text-align: center;
            margin-bottom: 2.5rem;
          }
          
          .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
          }
          
          .dashboard-card {
            background-color: #ffffff;
            border-radius: 1rem;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
            padding: 2rem;
            border-left: 5px solid transparent;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
          }
          
          .dashboard-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          }

          .dashboard-card-1:hover { border-left-color: #facc15; }
          .dashboard-card-2:hover { border-left-color: #22c55e; }
          .dashboard-card-3:hover { border-left-color: #3b82f6; }
          .dashboard-card-5:hover { border-left-color: #6d28d9; }
          .dashboard-card-7:hover { border-left-color: #14b8a6; }
          
          .card-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1a2b4b;
            margin-bottom: 0.75rem;
          }
          
          .card-text {
            color: #4b5563;
            flex-grow: 1;
          }
          
          .card-link {
            display: inline-block;
            margin-top: 1.5rem;
            padding: 0.75rem 1.5rem;
            background-color: #1a2b4b;
            color: #ffffff;
            border-radius: 9999px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            border: 1px solid transparent;
            text-align: center;
          }
          
          .card-link:hover {
            background-color: #3b82f6;
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          }

          .card-1 .card-link { background-color: #facc15; color: #1a2b4b; }
          .card-1 .card-link:hover { background-color: #eab308; }
          
          .card-2 .card-link { background-color: #22c55e; }
          .card-2 .card-link:hover { background-color: #16a34a; }
          
          .card-3 .card-link { background-color: #3b82f6; }
          .card-3 .card-link:hover { background-color: #2563eb; }
          
          .card-5 .card-link { background-color: #6d28d9; }
          .card-5 .card-link:hover { background-color: #5b21b6; }
          
          .card-7 .card-link { background-color: #14b8a6; }
          .card-7 .card-link:hover { background-color: #0d9488; }

          @media (max-width: 768px) {
            .dashboard-title {
              font-size: 2rem;
            }
          }
        `}
      </style>
      <div className="dashboard-page">
        <h2 className="dashboard-title">Student Dashboard</h2>
        <div className="dashboard-grid">

          <div className="dashboard-card dashboard-card-1">
            <h5 className="card-title">My Profile</h5>
            <p className="card-text">View and update your personal profile and academic details.</p>
            <Link to="/profile" className="card-link card-1">Go to Profile</Link>
          </div>

          <div className="dashboard-card dashboard-card-2">
            <h5 className="card-title">Resume Analyzer</h5>
            <p className="card-text">Upload your resume and get instant feedback and score.</p>
            <Link to="/resume-analyzer" className="card-link card-2">Analyze Resume</Link>
          </div>

          <div className="dashboard-card dashboard-card-3">
            <h5 className="card-title">Opportunity Recommendations</h5>
            <p className="card-text">Find the best job/internship matches based on your resume and skills.</p>
            <Link to="/opportunities" className="card-link card-3">View Opportunities</Link>
          </div>

          <div className="dashboard-card dashboard-card-5">
            <h5 className="card-title">Learning Path</h5>
            <p className="card-text">Personalized roadmap to improve your skills based on gap analysis.</p>
            <Link to="/learning-path" className="card-link card-5">View Path</Link>
          </div>

          <div className="dashboard-card dashboard-card-7">
            <h5 className="card-title">Placement Status</h5>
            <p className="card-text">Track your application progress and placement history.</p>
            <Link to="/placement-status" className="card-link card-7">View Status</Link>
          </div>

        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
