import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
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

          .dashboard-card-1:hover { border-left-color: #3b82f6; }
          .dashboard-card-2:hover { border-left-color: #22c55e; }
          .dashboard-card-3:hover { border-left-color: #facc15; }
          .dashboard-card-4:hover { border-left-color: #ef4444; }
          .dashboard-card-5:hover { border-left-color: #6d28d9; }
          .dashboard-card-6:hover { border-left-color: #f97316; }
          
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

          .card-1 .card-link { background-color: #3b82f6; }
          .card-1 .card-link:hover { background-color: #2563eb; }
          
          .card-2 .card-link { background-color: #22c55e; }
          .card-2 .card-link:hover { background-color: #16a34a; }
          
          .card-3 .card-link { background-color: #facc15; color: #1a2b4b; }
          .card-3 .card-link:hover { background-color: #eab308; }
          
          .card-4 .card-link { background-color: #ef4444; }
          .card-4 .card-link:hover { background-color: #dc2626; }
          
          .card-5 .card-link { background-color: #6d28d9; }
          .card-5 .card-link:hover { background-color: #5b21b6; }
          
          .card-6 .card-link { background-color: #f97316; }
          .card-6 .card-link:hover { background-color: #ea580c; }
          
          @media (max-width: 768px) {
            .dashboard-title {
              font-size: 2rem;
            }
          }
        `}
      </style>
      <div className="dashboard-page">
        <h2 className="dashboard-title">👨‍🏫 Admin Dashboard</h2>
        <div className="dashboard-grid">

          <div className="dashboard-card dashboard-card-1">
            <h5 className="card-title">👥 Manage Students</h5>
            <p className="card-text">View, edit, or delete student profiles and their details.</p>
            <Link to="/admin/manage-students" className="card-link card-1">Manage Students</Link>
          </div>

          <div className="dashboard-card dashboard-card-2">
            <h5 className="card-title">🏢 Upload Company Information</h5>
            <p className="card-text">Add and manage companies offering jobs and internships.</p>
            <Link to="/admin/upload-company" className="card-link card-2">Upload Info</Link>
          </div>

          <div className="dashboard-card dashboard-card-3">
            <h5 className="card-title">📊 View Placement Analytics</h5>
            <p className="card-text">Analyze placement trends and student success metrics.</p>
            <Link to="/admin/placement-analytics" className="card-link card-3">View Analytics</Link>
          </div>

          <div className="dashboard-card dashboard-card-4">
            <h5 className="card-title">🎯 Auto-Shortlist Students</h5>
            <p className="card-text">Automatically shortlist students based on predefined criteria.</p>
            <Link to="/admin/auto-shortlist" className="card-link card-4">Shortlist Students</Link>
          </div>

          <div className="dashboard-card dashboard-card-5">
            <h5 className="card-title">🔧 Skill Gap Analysis</h5>
            <p className="card-text">Check skill gaps across student batches and suggest improvements.</p>
            <Link to="/admin/skill-gap-analysis" className="card-link card-5">Analyze Skill Gaps</Link>
          </div>

     

        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
