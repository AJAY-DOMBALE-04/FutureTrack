// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const PlacementStatus = () => {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const API_URL = 'http://localhost:5000';

//   useEffect(() => {
//     const fetchAllJobs = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         // ✅ 1️⃣ Get the student’s branch from localStorage or fallback
//         let studentBranch = localStorage.getItem("branch");
//         const userData = localStorage.getItem("user");
//         if (!studentBranch && userData) {
//           try {
//             const parsed = JSON.parse(userData);
//             studentBranch = parsed?.branch || parsed?.user?.branch || "";
//           } catch {
//             studentBranch = "";
//           }
//         }

//         if (!studentBranch) {
//           console.warn("⚠️ No branch found for the student. Showing all jobs as fallback.");
//         }

//         const res = await fetch(`${API_URL}/api/jobs`);
//         if (!res.ok) throw new Error('Failed to fetch job postings.');

//         const data = await res.json();

//         // ✅ 2️⃣ Normalize everything for comparison
//         const normalizedBranch = studentBranch.trim().toLowerCase();

//         // ✅ 3️⃣ Filter jobs per branch
//         const filteredJobs = data.filter(job => {
//           // Handle empty eligibleBranches (default show to all)
//           if (!job.eligibleBranches || job.eligibleBranches.length === 0) return true;

//           // Normalize job branches
//           const normalizedJobBranches = job.eligibleBranches.map(b => b.trim().toLowerCase());

//           // If admin marked “All” branch → show to everyone
//           if (normalizedJobBranches.includes("all")) return true;

//           // Match student’s branch
//           return normalizedJobBranches.includes(normalizedBranch);
//         });

//         setJobs(filteredJobs);
//       } catch (err) {
//         console.error("❌ Fetch error:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllJobs();
//   }, [navigate]);

//   const formatDate = (isoString) => {
//     try {
//       return new Date(isoString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//       });
//     } catch {
//       return "N/A";
//     }
//   };

//   return (
//     <>
//       <style>
//         {`
//           @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap');
          
//           .placement-page {
//             font-family: 'Inter', sans-serif;
//             background-color: #f0f2f5;
//             min-height: 100vh;
//             padding: 2rem 1rem;
//           }
          
//           .placement-container {
//             max-width: 1100px;
//             margin: 0 auto;
//           }
          
//           .placement-title {
//             font-size: 2.25rem;
//             font-weight: 800;
//             color: #1a2b4b;
//             margin-bottom: 2rem;
//             border-bottom: 3px solid #3b82f6;
//             padding-bottom: 0.5rem;
//           }
          
//           .loading-container, .error-container, .no-jobs-container {
//             text-align: center;
//             padding: 4rem;
//             font-size: 1.25rem;
//             color: #4b5563;
//           }
          
//           .jobs-grid {
//             display: grid;
//             grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
//             gap: 1.5rem;
//           }
          
//           .job-card {
//             background-color: #ffffff;
//             border-radius: 1rem;
//             box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
//             border: 1px solid #e5e7eb;
//             display: flex;
//             flex-direction: column;
//             transition: all 0.3s ease;
//             overflow: hidden;
//           }
          
//           .job-card:hover {
//             transform: translateY(-5px);
//             box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
//           }

//           .job-card-image-container {
//             width: 100%;
//             height: 180px;
//             background-color: #f3f4f6;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             overflow: hidden;
//           }
          
//           .job-card-image {
//             width: 100%;
//             height: 100%;
//             object-fit: cover;
//           }
          
//           .job-card-image-placeholder {
//             font-weight: 600;
//             color: #9ca3af;
//           }
          
//           .job-card-header {
//             padding: 1.5rem 1.5rem 1rem;
//             border-bottom: 1px solid #f3f4f6;
//           }
          
//           .job-card-role {
//             font-size: 1.25rem;
//             font-weight: 700;
//             color: #1a2b4b;
//             margin: 0;
//           }
          
//           .job-card-company {
//             font-size: 1rem;
//             font-weight: 500;
//             color: #3b82f6;
//             margin-top: 0.25rem;
//           }
          
//           .job-card-body {
//             padding: 1rem 1.5rem;
//             flex-grow: 1;
//           }
          
//           .job-card-description {
//             color: #4b5563;
//             font-size: 0.9rem;
//             line-height: 1.6;
//             margin-bottom: 1rem;
//             display: -webkit-box;
//             -webkit-line-clamp: 3;
//             -webkit-box-orient: vertical;  
//             overflow: hidden;
//           }
          
//           .job-card-info {
//             font-size: 0.9rem;
//             color: #6b7280;
//             margin-bottom: 0.5rem;
//           }
          
//           .job-card-footer {
//             padding: 1rem 1.5rem;
//             background-color: #f9fafb;
//             border-top: 1px solid #f3f4f6;
//           }
          
//           .btn-apply {
//             display: block;
//             width: 100%;
//             text-align: center;
//             background-color: #3b82f6;
//             color: #ffffff;
//             padding: 0.75rem 1rem;
//             border-radius: 0.5rem;
//             text-decoration: none;
//             font-weight: 600;
//             transition: all 0.3s ease;
//           }
          
//           .btn-apply:hover {
//             background-color: #2563eb;
//             transform: translateY(-2px);
//             box-shadow: 0 4px 10px rgba(59, 130, 246, 0.2);
//           }
          
//           .btn-apply.disabled {
//             background-color: #9ca3af;
//             cursor: not-allowed;
//           }
//         `}
//       </style>

//       <div className="placement-page">
//         <div className="placement-container">
//           <h1 className="placement-title">Recent Placement Opportunities</h1>
          
//           {loading && <div className="loading-container">Loading jobs...</div>}
//           {error && <div className="error-container">Error: {error}</div>}

//           {!loading && !error && (
//             <div className="jobs-grid">
//               {jobs.length === 0 ? (
//                 <div className="no-jobs-container">
//                   <p>No job postings available for your branch at this time.</p>
//                 </div>
//               ) : (
//                 jobs.map(job => (
//                   <div key={job._id} className="job-card">
//                     <div className="job-card-image-container">
//                       {job.companyImagePath ? (
//                         <img 
//                           src={`${API_URL}${job.companyImagePath}`} 
//                           alt={`${job.companyName} logo`} 
//                           className="job-card-image"
//                         />
//                       ) : (
//                         <span className="job-card-image-placeholder">No Image</span>
//                       )}
//                     </div>

//                     <div className="job-card-header">
//                       <h2 className="job-card-role">{job.jobRole}</h2>
//                       <h3 className="job-card-company">{job.companyName}</h3>
//                     </div>

//                     <div className="job-card-body">
//                       <p className="job-card-info"><strong>📍 Location:</strong> {job.location}</p>
//                       <p className="job-card-info"><strong>🗓️ Posted:</strong> {formatDate(job.postedAt)}</p>
//                       <p className="job-card-description">{job.companyDescription}</p>
//                       <p className="job-card-info"><strong>🎓 Eligible Branches:</strong> {job.eligibleBranches?.join(', ') || "All"}</p>
//                     </div>

//                     <div className="job-card-footer">
//                       <a 
//                         href={job.applicationLink} 
//                         target="_blank" 
//                         rel="noopener noreferrer"
//                         className={`btn-apply ${!job.applicationLink ? 'disabled' : ''}`}
//                         aria-disabled={!job.applicationLink}
//                         onClick={(e) => !job.applicationLink && e.preventDefault()}
//                       >
//                         {job.applicationLink ? 'Apply Now' : 'No Link Provided'}
//                       </a>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default PlacementStatus;




// ✅ src/pages/PlacementStatus.jsx
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // ✅ use your new context

const PlacementStatus = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { branch, loading: authLoading } = useAuth(); // ✅ Get branch from context

  const API_BASE = API_BASE_URL;

  useEffect(() => {
    if (authLoading) return; // Wait until auth is ready

    const fetchAllJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/jobs`);
        if (!res.ok) throw new Error('Failed to fetch job postings.');

        const data = await res.json();

        // ✅ Filter jobs based on student's branch (case-insensitive)
        const filteredJobs = data.filter(job => {
          if (!branch) return true; // if branch is missing, show all
          if (!job.eligibleBranches || job.eligibleBranches.length === 0) return true;
          if (job.eligibleBranches.includes("All")) return true;

          // Case-insensitive comparison
          return job.eligibleBranches.some(
            b => b.trim().toLowerCase() === branch.trim().toLowerCase()
          );
        });

        setJobs(filteredJobs);
      } catch (err) {
        console.error(err);
        setError(
          err.message === 'Failed to fetch'
            ? `Could not reach the backend at ${API_BASE}. Check that the Flask server is running and REACT_APP_API_BASE_URL is correct.`
            : err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllJobs();
  }, [navigate, branch, authLoading]);

  const formatDate = (isoString) => {
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap');
          
          .placement-page {
            font-family: 'Inter', sans-serif;
            background-color: #f0f2f5;
            min-height: 100vh;
            padding: 2rem 1rem;
          }
          
          .placement-container {
            max-width: 1100px;
            margin: 0 auto;
          }
          
          .placement-title {
            font-size: 2.25rem;
            font-weight: 800;
            color: #1a2b4b;
            margin-bottom: 2rem;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 0.5rem;
          }
          
          .loading-container, .error-container, .no-jobs-container {
            text-align: center;
            padding: 4rem;
            font-size: 1.25rem;
            color: #4b5563;
          }
          
          .jobs-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1.5rem;
          }
          
          .job-card {
            background-color: #ffffff;
            border-radius: 1rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            border: 1px solid #e5e7eb;
            display: flex;
            flex-direction: column;
            transition: all 0.3s ease;
            overflow: hidden;
          }
          
          .job-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          }

          .job-card-image-container {
            width: 100%;
            height: 180px;
            background-color: #f3f4f6;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          
          .job-card-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .job-card-image-placeholder {
            font-weight: 600;
            color: #9ca3af;
          }
          
          .job-card-header {
            padding: 1.5rem 1.5rem 1rem;
            border-bottom: 1px solid #f3f4f6;
          }
          
          .job-card-role {
            font-size: 1.25rem;
            font-weight: 700;
            color: #1a2b4b;
            margin: 0;
          }
          
          .job-card-company {
            font-size: 1rem;
            font-weight: 500;
            color: #3b82f6;
            margin-top: 0.25rem;
          }
          
          .job-card-body {
            padding: 1rem 1.5rem;
            flex-grow: 1;
          }
          
          .job-card-description {
            color: #4b5563;
            font-size: 0.9rem;
            line-height: 1.6;
            margin-bottom: 1rem;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;  
            overflow: hidden;
          }
          
          .job-card-info {
            font-size: 0.9rem;
            color: #6b7280;
            margin-bottom: 0.5rem;
          }
          
          .job-card-footer {
            padding: 1rem 1.5rem;
            background-color: #f9fafb;
            border-top: 1px solid #f3f4f6;
          }
          
          .btn-apply {
            display: block;
            width: 100%;
            text-align: center;
            background-color: #3b82f6;
            color: #ffffff;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
          }
          
          .btn-apply:hover {
            background-color: #2563eb;
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(59, 130, 246, 0.2);
          }
          
          .btn-apply.disabled {
            background-color: #9ca3af;
            cursor: not-allowed;
          }
        `}
      </style>

      <div className="placement-page">
        <div className="placement-container">
          <h1 className="placement-title">Recent Placement Opportunities</h1>

          {loading && <div className="loading-container">Loading jobs...</div>}
          {error && <div className="error-container">Error: {error}</div>}

          {!loading && !error && (
            <div className="jobs-grid">
              {jobs.length === 0 ? (
                <div className="no-jobs-container">
                  <p>No job postings available for your branch at this time.</p>
                </div>
              ) : (
                jobs.map((job) => (
                  <div key={job._id} className="job-card">
                    <div className="job-card-image-container">
                      {job.companyImagePath ? (
                        <img
                          src={job.companyImagePath}
                          alt={`${job.companyName} logo`}
                          className="job-card-image"
                        />
                      ) : (
                        <span className="job-card-image-placeholder">No Image</span>
                      )}
                    </div>

                    <div className="job-card-header">
                      <h2 className="job-card-role">{job.jobRole}</h2>
                      <h3 className="job-card-company">{job.companyName}</h3>
                    </div>

                    <div className="job-card-body">
                      <p className="job-card-info"><strong>📍 Location:</strong> {job.location}</p>
                      <p className="job-card-info"><strong>🗓️ Posted:</strong> {formatDate(job.postedAt)}</p>
                      <p className="job-card-description">{job.companyDescription}</p>
                      <p className="job-card-info">
                        <strong>🎓 Eligible Branches:</strong>{" "}
                        {job.eligibleBranches?.join(", ") || "All"}
                      </p>
                    </div>

                    <div className="job-card-footer">
                      <a
                        href={job.applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`btn-apply ${!job.applicationLink ? "disabled" : ""}`}
                        aria-disabled={!job.applicationLink}
                        onClick={(e) => !job.applicationLink && e.preventDefault()}
                      >
                        {job.applicationLink ? "Apply Now" : "No Link Provided"}
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PlacementStatus;
