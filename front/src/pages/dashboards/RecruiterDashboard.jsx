import React from "react";
import { Link } from "react-router-dom";

const RecruiterDashboard = () => {
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
            grid-template-columns: minmax(300px, 420px);
            justify-content: center;
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
            border-left-color: #3b82f6;
          }

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
            background-color: #3b82f6;
            color: #ffffff;
            border-radius: 9999px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            text-align: center;
          }

          .card-link:hover {
            background-color: #2563eb;
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          }

          @media (max-width: 768px) {
            .dashboard-title {
              font-size: 2rem;
            }
          }
        `}
      </style>
      <div className="dashboard-page">
        <h2 className="dashboard-title">Recruiter Dashboard</h2>
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h5 className="card-title">Post Jobs / Internships</h5>
            <p className="card-text">
              Create a new job or internship listing and publish it for students.
            </p>
            <Link to="/recruiter/post-job" className="card-link">
              Post New
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecruiterDashboard;
