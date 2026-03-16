// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const Home = () => {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const fetchJobs = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/jobs");
//       if (!res.ok) {
//         throw new Error("Failed to fetch jobs");
//       }
//       const data = await res.json();
//       setJobs(data);
//     } catch (error) {
//       console.error("Error fetching jobs:", error);
//       setJobs([
//         { _id: "1", title: "Software Engineer", company: "TechCorp", location: "Mumbai" },
//         { _id: "2", title: "Data Scientist", company: "Data Inc.", location: "Bangalore" },
//         { _id: "3", title: "Product Manager", company: "Innovate Inc.", location: "Pune" },
//         { _id: "4", title: "UX Designer", company: "Creative Solutions", location: "Hyderabad" },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchJobs();
//     const interval = setInterval(fetchJobs, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   const handleProtectedRedirect = (dashboardPath) => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate(`/login?redirect=${dashboardPath}`);
//     } else {
//       navigate(dashboardPath);
//     }
//   };

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   return (
//     <>
//       <style>
//         {`
//           @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap');

//           body {
//             font-family: 'Inter', sans-serif;
//             background-color: #ffffffff;
//             color: #000000;
//             line-height: 1.7;
//           }

//           .hero-title .glitch {
//             position: relative;
//             color: #890976ff;
//             // animation: glitch-anim 2s infinite alternate-reverse;
//           }

//           @keyframes glitch-anim {
//             0% { text-shadow: 2px 0px 0px #ff7a59, -2px 0px 0px #6be7c4; }
//             20% { text-shadow: 2px -2px 0px #ff7a59, -2px 2px 0px #6be7c4; }
//             40% { text-shadow: -2px 2px 0px #ff7a59, 2px -2px 0px #6be7c4; }
//             60% { text-shadow: -2px -2px 0px #ff7a59, 2px 2px 0px #6be7c4; }
//             80% { text-shadow: 2px 2px 0px #ff7a59, -2px -2px 0px #6be7c4; }
//             100% { text-shadow: 2px 0px 0px #ff7a59, -2px 0px 0px #6be7c4; }
//           }
          
//           .container { max-width: 1280px; margin: 0 auto; padding: 0 1rem; }
//           .hero-section { background: #f7f2f5ff; padding: 6rem 2rem; border-radius: 1.5rem; margin-top: 2rem; text-align: center; }
//           .hero-title { font-size: 3.8rem; font-weight: 900; margin-bottom: 1rem; color: #1a2b4b; }
//           .hero-subtitle { font-weight: 400; font-size: 1.25rem; max-width: 700px; margin: 0 auto; color: #6b7280; }
//           .highlight-cta { background-color: #efbc06ff; color: #060303ff; padding: 0.75rem 2rem; border-radius: 9999px; font-weight: 600; display: inline-block; margin-top: 2rem; box-shadow: 0 4px 14px 0 rgba(0,0,0,0.1); transition: all 0.3s ease; }
//           .highlight-cta:hover { background-color: #e91b6aff; transform: translateY(-2px); box-shadow: 0 6px 20px 0 rgba(0,0,0,0.15); }
//           .hero-img { max-height: 400px; border-radius: 1rem; margin-top: 2.5rem; animation: float 4s ease-in-out infinite; }
//           @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
//           .btn-animated { transition: all 0.3s ease; padding: 0.75rem 2rem; border-radius: 9999px; font-size: 1rem; font-weight: 500; border: none; }
//           .btn-animated:hover { transform: translateY(-3px); box-shadow: 0 6px 12px rgba(0,0,0,0.15); }
//           .btn-primary { background-color: #efbc06ff; color: #070606ff; }
//           .btn-primary:hover { background-color: #e91b6aff; }
//           .btn-outline-dark { background-color: transparent; color: #1a2b4b; border: 2px solid #1a2b4b; }
//           .btn-outline-dark:hover { background-color: #e91b6aff; color: #fff; }

//           .section-title { font-weight: 800; color: #1a2b4b; font-size: 2.25rem; text-align: center; margin-bottom: 2.5rem; }
//           .jobs-ticker { background-color: #f1f5f9; border: 1px solid #e2e8f0; padding: 1rem; overflow: hidden; white-space: nowrap; display: flex; align-items: center; height: 60px; border-radius: 0.75rem; }
//           .jobs-ticker-content { display: flex; animation: ticker 30s linear infinite; width: 100%; }
//           .jobs-ticker-content:hover { animation-play-state: paused; }
//           .jobs-ticker-content span { display: inline-block; padding: 0 2rem; color: #475569; cursor: pointer; transition: color 0.3s ease; }
//           .jobs-ticker-content span:hover { color: #6BE7C4; }
//           @keyframes ticker { 0% { transform: translateX(100%); } 100% { transform: translateX(-200%); } }
//           .how-it-works { padding-top: 5rem; }
//           .step { color: #475569; padding: 2rem; background-color: #f1f5f9; border-radius: 1rem; transition: transform 0.3s ease, box-shadow 0.3s ease; height: 100%; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
//           .step:hover { transform: translateY(-5px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -4px rgba(0,0,0,0.2); }
//           .step-number { font-size: 2.5rem; font-weight: 900; color: #1a2b4b; background-color: #FFD84A; border-radius: 50%; width: 70px; height: 70px; display: flex; justify-content: center; align-items: center; margin: 0 auto 1.5rem; transition: all 0.3s ease; }
//           .step:hover .step-number { background-color: #facc15; color: #000; transform: rotate(15deg) scale(1.1); }
//           .step-title { font-weight: 700; font-size: 1.25rem; color: #1a2b4b; margin-bottom: 0.5rem; }
//           .features-section { padding-top: 5rem; }
//           .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; border-radius: 1rem; cursor: pointer; background-color: #f1f5f9; color: #1a2b4b; border: 1px solid #e2e8f0; height: 100%; display: flex; flex-direction: column; }
//           .card-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -4px rgba(0,0,0,0.2); }
//           .card-body { flex-grow: 1; display: flex; flex-direction: column; padding: 1.5rem; }
//           .card-title { font-weight: 700; font-size: 1.25rem; }
//           .student-card { border-top: 4px solid #7AA2FF; }
//           .student-card .card-title { color: #7AA2FF; }
//           .student-card .btn { background-color: #7AA2FF; border-color: #7AA2FF; color: #fff; }
//           .student-card .btn:hover { background-color: #5b87f8; }
//           .admin-card { border-top: 4px solid #6BE7C4; }
//           .admin-card .card-title { color: #6BE7C4; }
//           .admin-card .btn { background-color: #6BE7C4; border-color: #6BE7C4; color: #000; }
//           .admin-card .btn:hover { background-color: #55d4b0; }
//           .recruiter-card { border-top: 4px solid #FF7A59; }
//           .recruiter-card .card-title { color: #FF7A59; }
//           .recruiter-card .btn { background-color: #FF7A59; border-color: #FF7A59; color: #fff; }
//           .recruiter-card .btn:hover { background-color: #FF6644; }
//           .testimonials { padding-top: 5rem; }
//           .testimonial-card { background-color: #f1f5f9; padding: 2.5rem; border-radius: 1rem; border: 1px solid #e2e8f0; color: #475569; max-width: 700px; margin: 0 auto; }
//           .testimonial-text { font-style: italic; font-size: 1.1rem; line-height: 1.6; }
//           .testimonial-author { font-weight: 500; color: #1a2b4b; margin-top: 1.5rem; }
//           .carousel-control-prev, .carousel-control-next { filter: none; color: #475569; width: 5%; opacity: 0.6; transition: opacity 0.3s ease; }
//           .carousel-control-prev:hover, .carousel-control-next:hover { opacity: 1; }
//           .footer { text-align: center; padding: 3rem 1rem; margin-top: 5rem; border-top: 1px solid #e2e8f0; background-color: #f1f5f9; }
//           .back-to-top { position: fixed; bottom: 2rem; right: 2rem; background-color: #FF7A59; color: white; border: none; border-radius: 50%; width: 50px; height: 50px; font-size: 1.5rem; box-shadow: 0 4px 10px rgba(0,0,0,0.2); transition: all 0.3s ease; cursor: pointer; z-index: 100; display: none; }
//           .back-to-top.show { display: block; }
//           .back-to-top:hover { background-color: #FF6644; transform: translateY(-3px); }
//           .fade-in-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }
//           @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
//           @media (max-width: 768px) {
//             .hero-section { padding: 4rem 1.5rem; }
//             .hero-title { font-size: 2.5rem; }
//             .hero-subtitle { font-size: 1rem; }
//             .section-title { font-size: 1.75rem; }
//             .step-number { width: 60px; height: 60px; font-size: 2rem; }
//             .back-to-top { bottom: 1rem; right: 1rem; width: 45px; height: 45px; font-size: 1.25rem; }
//           }
//         `}
//       </style>
//       <div className="bg-white text-black min-h-screen">
//         <div className="container mt-4">
//           <section className="hero-section fade-in-up" aria-label="Welcome section">
//             <h1 className="hero-title">
//               Welcome to <span className="glitch">FutureTrack</span>
//             </h1>
//             <p className="lead hero-subtitle">
//              <b> Empowering Students, TPOs, and Recruiters with Smart AI Tools</b>
//             </p>
//             <div className="highlight-cta" aria-label="Call to action highlight">
//               Your career journey starts here!
//             </div>
//             <img
//               src="/job.jpg"
//               alt="Students collaborating on college project"
//               className="img-fluid my-4 hero-img"
//               style={{ maxHeight: "600px" }}
//               loading="lazy"
//             />
//             <div className="d-flex justify-content-center gap-3 flex-wrap">
//               <Link to="/register" className="btn btn-primary btn-lg btn-animated" aria-label="Get started with registration">
//                 Get Started
//               </Link>
//               <Link to="/about" className="btn btn-outline-dark btn-lg btn-animated" aria-label="Learn more about AI Placement Portal">
//                 Learn More
//               </Link>
//             </div>
//           </section>
//           <section className="mt-5 fade-in-up" style={{ animationDelay: "0.3s" }} aria-label="Latest job openings">
//             <h2 className="text-center mb-4 section-title">🚀 Latest Job Openings</h2>
//             <div className="border p-2 jobs-ticker rounded" role="list" aria-live="polite" aria-atomic="true" tabIndex={0}>
//               {loading ? (
//                 <p className="text-center mb-0 text-secondary">Loading jobs...</p>
//               ) : jobs.length > 0 ? (
//                 <div className="jobs-ticker-content" aria-label="Scrolling list of latest job openings">
//                   {[...jobs, ...jobs].map((job, idx) => (
//                     <span
//                       key={`${job._id}-${idx}`}
//                       onClick={() => handleProtectedRedirect(`/jobs/${job._id}`)}
//                       title="Click to view details"
//                       role="button"
//                       tabIndex={0}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter" || e.key === " ") {
//                           handleProtectedRedirect(`/jobs/${job._id}`);
//                         }
//                       }}
//                       aria-label={`${job.title} at ${job.company} in ${job.location}`}
//                     >
//                       {job.title} @ {job.company} ({job.location})
//                     </span>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-center mb-0 text-secondary">No job postings available right now.</p>
//               )}
//             </div>
//           </section>
          // <section className="how-it-works fade-in-up" style={{ animationDelay: "0.5s" }} aria-label="How it works">
          //   <h2 className="text-center mb-4 section-title">🔍 How It Works</h2>
          //   <div className="row g-4 justify-content-center">
          //     <div className="col-md-4">
          //       <div className="step text-center">
          //         <div className="step-number">1</div>
          //         <div className="step-title">Sign Up & Create Profile</div>
          //         <p>Create your personalized profile to get tailored job recommendations.</p>
          //       </div>
          //     </div>
          //     <div className="col-md-4">
          //       <div className="step text-center">
          //         <div className="step-number">2</div>
          //         <div className="step-title">Explore & Apply</div>
          //         <p>Browse latest job openings and apply directly through the portal.</p>
          //       </div>
          //     </div>
          //     <div className="col-md-4">
          //       <div className="step text-center">
          //         <div className="step-number">3</div>
          //         <div className="step-title">Get AI Assistance</div>
          //         <p>Use AI tools for resume scoring, interview practice, and skill gap analysis.</p>
          //       </div>
          //     </div>
          //   </div>
          // </section>
//           <section className="features-section row text-center mt-5 fade-in-up" style={{ animationDelay: "0.7s" }} aria-label="Key features">
//             <h2 className="mb-4 w-100 section-title">💡 Key Features</h2>
//             <div className="col-md-4 mb-4">
//               <div className="card h-100 shadow-sm card-hover student-card" tabIndex={0} aria-label="Features for students">
//                 <div className="card-body d-flex flex-column">
//                   <h5 className="card-title">🧑‍🎓 For Students</h5>
//                   <p className="flex-grow-1">
//                     Resume Scoring, Interview Practice, Skill Gap Checker, and AI-Based Recommendations.
//                   </p>
//                   <button
//                     onClick={() => handleProtectedRedirect("/dashboard/student")}
//                     className="btn btn-sm btn-info btn-animated mt-auto"
//                     aria-label="Go to Student Dashboard"
//                   >
//                     Go to Student Dashboard
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-4 mb-4">
//               <div className="card h-100 shadow-sm border-success card-hover admin-card" tabIndex={0} aria-label="Features for admin and TPO">
//                 <div className="card-body d-flex flex-column">
//                   <h5 className="card-title">👨‍🏫 For Admin/TPO</h5>
//                   <p className="flex-grow-1">
//                     Batch Analysis, Auto Shortlisting, Company Uploads, and AI Insights for Placements.
//                   </p>
//                   <button
//                     onClick={() => handleProtectedRedirect("/dashboard/admin")}
//                     className="btn btn-sm btn-success btn-animated mt-auto"
//                     aria-label="Go to Admin Dashboard"
//                   >
//                     Go to Admin Dashboard
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-4 mb-4">
//               <div className="card h-100 shadow-sm border-warning card-hover recruiter-card" tabIndex={0} aria-label="Features for recruiters">
//                 <div className="card-body d-flex flex-column">
//                   <h5 className="card-title">💼 For Recruiters</h5>
//                   <p className="flex-grow-1">
//                     Post Jobs, Auto-Shortlist Candidates, View Resumes, and Download Reports.
//                   </p>
//                   <button
//                     onClick={() => handleProtectedRedirect("/dashboard/recruiter")}
//                     className="btn btn-sm btn-warning btn-animated mt-auto"
//                     aria-label="Go to Recruiter Dashboard"
//                   >
//                     Go to Recruiter Dashboard
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </section>
//           <section className="testimonials fade-in-up" style={{ animationDelay: "0.9s" }} aria-label="User testimonials">
//             <h2 className="text-center mb-4 section-title">💬 What Our Users Say</h2>
//             <div
//               id="testimonialCarousel"
//               className="carousel slide"
//               data-bs-ride="carousel"
//               aria-live="polite"
//             >
//               <div className="carousel-inner">
//                 <div className="carousel-item active">
//                   <div className="testimonial-card mx-auto">
//                     <p className="testimonial-text">
//                       "The AI Placement Portal helped me identify my skill gaps and practice interviews. I landed my dream job thanks to this platform!"
//                     </p>
//                     <p className="testimonial-author">- Priya S., Student</p>
//                   </div>
//                 </div>
//                 <div className="carousel-item">
//                   <div className="testimonial-card mx-auto">
//                     <p className="testimonial-text">
//                       "As a TPO, the batch analysis and auto shortlisting features saved me countless hours. Highly recommend!"
//                     </p>
//                     <p className="testimonial-author">- Rajesh K., TPO</p>
//                   </div>
//                 </div>
//                 <div className="carousel-item">
//                   <div className="testimonial-card mx-auto">
//                     <p className="testimonial-text">
//                       "Posting jobs and managing candidates is so much easier now. The AI insights are a game changer."
//                     </p>
//                     <p className="testimonial-author">- Anjali M., Recruiter</p>
//                   </div>
//                 </div>
//               </div>
//               <button
//                 className="carousel-control-prev"
//                 type="button"
//                 data-bs-target="#testimonialCarousel"
//                 data-bs-slide="prev"
//                 aria-label="Previous testimonial"
//               >
//                 <span className="carousel-control-prev-icon" aria-hidden="true"></span>
//               </button>
//               <button
//                 className="carousel-control-next"
//                 type="button"
//                 data-bs-target="#testimonialCarousel"
//                 data-bs-slide="next"
//                 aria-label="Next testimonial"
//               >
//                 <span className="carousel-control-next-icon" aria-hidden="true"></span>
//               </button>
//             </div>
//           </section>
//           <footer className="text-center py-4 mt-5 border-top fade-in-up" style={{ animationDelay: "1.1s" }}>
//             <p className="mb-0">© 2025 FutureTrack | All Rights Reserved</p>
//           </footer>
//           <button
//             className="back-to-top"
//             onClick={scrollToTop}
//             aria-label="Back to top"
//             title="Back to top"
//           >
//             ↑
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Home;




import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// NO Firebase imports

const Home = () => {
  // --- STATE FOR API JOBS ---
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- EXISTING STATE ---
  const navigate = useNavigate();

  // --- API FETCH LOGIC (Restored) ---
  const fetchJobs = async () => {
    try {
      // Fetch from your backend API
      const res = await fetch("https:/api/jobs");
      if (!res.ok) {
        throw new Error("Failed to fetch jobs");
      }
      const data = await res.json();
      // Set the jobs list, getting the latest (assuming backend sorts it)
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      // Fallback data in case the API isn't running
      setJobs([
        { _id: "1", jobRole: "Software Engineer", companyName: "TechCorp", location: "Mumbai" },
        { _id: "2", jobRole: "Data Scientist", companyName: "Data Inc.", location: "Bangalore" },
        { _id: "3", jobRole: "Product Manager", companyName: "Innovate Inc.", location: "Pune" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // --- Run fetchJobs on component load ---
  useEffect(() => {
    fetchJobs();
    // Optional: refetch every 30 seconds
    const interval = setInterval(fetchJobs, 30000); 
    return () => clearInterval(interval);
  }, []); // Empty array means this runs once on mount


  // --- EXISTING FUNCTIONS ---
  const handleProtectedRedirect = (dashboardPath) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate(`/login?redirect=${dashboardPath}`);
    } else {
      navigate(dashboardPath);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap');

          body {
            font-family: 'Inter', sans-serif;
            background-color: #ffffffff;
            color: #000000;
            line-height: 1.7;
          }

          .hero-title .glitch {
            position: relative;
            color: #890976ff;
            // animation: glitch-anim 2s infinite alternate-reverse;
          }

          @keyframes glitch-anim {
            0% { text-shadow: 2px 0px 0px #ff7a59, -2px 0px 0px #6be7c4; }
            20% { text-shadow: 2px -2px 0px #ff7a59, -2px 2px 0px #6be7c4; }
            40% { text-shadow: -2px 2px 0px #ff7a59, 2px -2px 0px #6be7c4; }
            60% { text-shadow: -2px -2px 0px #ff7a59, 2px 2px 0px #6be7c4; }
            80% { text-shadow: 2px 2px 0px #ff7a59, -2px -2px 0px #6be7c4; }
            100% { text-shadow: 2px 0px 0px #ff7a59, -2px 0px 0px #6be7c4; }
          }
          
          .container { max-width: 1280px; margin: 0 auto; padding: 0 1rem; }
          .hero-section { background: #f7f2f5ff; padding: 6rem 2rem; border-radius: 1.5rem; margin-top: 2rem; text-align: center; }
          .hero-title { font-size: 3.8rem; font-weight: 900; margin-bottom: 1rem; color: #1a2b4b; }
          .hero-subtitle { font-weight: 400; font-size: 1.25rem; max-width: 700px; margin: 0 auto; color: #6b7280; }
          .highlight-cta { background-color: #efbc06ff; color: #060303ff; padding: 0.75rem 2rem; border-radius: 9999px; font-weight: 600; display: inline-block; margin-top: 2rem; box-shadow: 0 4px 14px 0 rgba(0,0,0,0.1); transition: all 0.3s ease; }
          .highlight-cta:hover { background-color: #e91b6aff; transform: translateY(-2px); box-shadow: 0 6px 20px 0 rgba(0,0,0,0.15); }
          .hero-img { max-height: 400px; border-radius: 1rem; margin-top: 2.5rem; animation: float 4s ease-in-out infinite; }
          @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
          .btn-animated { transition: all 0.3s ease; padding: 0.75rem 2rem; border-radius: 9999px; font-size: 1rem; font-weight: 500; border: none; }
          .btn-animated:hover { transform: translateY(-3px); box-shadow: 0 6px 12px rgba(0,0,0,0.15); }
          .btn-primary { background-color: #efbc06ff; color: #070606ff; }
          .btn-primary:hover { background-color: #e91b6aff; }
          .btn-outline-dark { background-color: transparent; color: #1a2b4b; border: 2px solid #1a2b4b; }
          .btn-outline-dark:hover { background-color: #e91b6aff; color: #fff; }

          .section-title { font-weight: 800; color: #1a2b4b; font-size: 2.25rem; text-align: center; margin-bottom: 2.5rem; }

          /* --- STYLES FOR MARQUEE (from Marquee) --- */
          .marquee-container {
            font-family: 'Inter', sans-serif;
            background-color: #1a2b4b; /* Dark blue background */
            color: #ffffff;
            padding: 0.75rem 1rem;
            border-radius: 0.75rem; /* Match old ticker style */
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            min-height: 60px; /* Match old ticker style */
            display: flex;
            align-items: center;
          }
          
          .marquee-content {
            display: inline-block;
            white-space: nowrap;
            animation: marquee 30s linear infinite;
            padding-left: 100%; /* Start off-screen */
          }
          
          .marquee-content:hover {
            animation-play-state: paused;
          }

          .marquee-item {
            display: inline-block;
            margin-right: 3rem; /* Space between items */
            font-weight: 500;
          }

          .marquee-item-company {
            font-weight: 700;
            color: #f0f9ff;
          }

          .marquee-loading, .marquee-no-jobs {
            width: 100%;
            text-align: center;
            font-style: italic;
            color: #cbd5e1;
          }

          @keyframes marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }

          .marquee-job-link {
            color: #7dd3fc; /* Light blue */
            text-decoration: none;
            transition: color 0.3s;
            cursor: pointer;
            font-weight: 600;
          }
          .marquee-job-link:hover {
            color: #ffffff;
            text-decoration: underline;
          }
          .marquee-job-link-nolink {
            color: #f0f9ff; /* Same as company, but not interactive */
            cursor: default;
            font-weight: 600;
          }
          /* --- END OF MARQUEE STYLES --- */

          .how-it-works { padding-top: 5rem; }
          .step { color: #475569; padding: 2rem; background-color: #f1f5f9; border-radius: 1rem; transition: transform 0.3s ease, box-shadow 0.3s ease; height: 100%; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
          .step:hover { transform: translateY(-5px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -4px rgba(0,0,0,0.2); }
          .step-number { font-size: 2.5rem; font-weight: 900; color: #1a2b4b; background-color: #FFD84A; border-radius: 50%; width: 70px; height: 70px; display: flex; justify-content: center; align-items: center; margin: 0 auto 1.5rem; transition: all 0.3s ease; }
          .step:hover .step-number { background-color: #facc15; color: #000; transform: rotate(15deg) scale(1.1); }
          .step-title { font-weight: 700; font-size: 1.25rem; color: #1a2b4b; margin-bottom: 0.5rem; }
          .features-section { padding-top: 5rem; }
          .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; border-radius: 1rem; cursor: pointer; background-color: #f1f5f9; color: #1a2b4b; border: 1px solid #e2e8f0; height: 100%; display: flex; flex-direction: column; }
          .card-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -4px rgba(0,0,0,0.2); }
          .card-body { flex-grow: 1; display: flex; flex-direction: column; padding: 1.5rem; }
          .card-title { font-weight: 700; font-size: 1.25rem; }
          .student-card { border-top: 4px solid #7AA2FF; }
          .student-card .card-title { color: #7AA2FF; }
          .student-card .btn { background-color: #7AA2FF; border-color: #7AA2FF; color: #fff; }
          .student-card .btn:hover { background-color: #5b87f8; }
          .admin-card { border-top: 4px solid #6BE7C4; }
          .admin-card .card-title { color: #6BE7C4; }
          .admin-card .btn { background-color: #6BE7C4; border-color: #6BE7C4; color: #000; }
          .admin-card .btn:hover { background-color: #55d4b0; }
          .recruiter-card { border-top: 4px solid #FF7A59; }
          .recruiter-card .card-title { color: #FF7A59; }
          .recruiter-card .btn { background-color: #FF7A59; border-color: #FF7A59; color: #fff; }
          .recruiter-card .btn:hover { background-color: #FF6644; }
          .testimonials { padding-top: 5rem; }
          .testimonial-card { background-color: #f1f5f9; padding: 2.5rem; border-radius: 1rem; border: 1px solid #e2e8f0; color: #475569; max-width: 700px; margin: 0 auto; }
          .testimonial-text { font-style: italic; font-size: 1.1rem; line-height: 1.6; }
          .testimonial-author { font-weight: 500; color: #1a2b4b; margin-top: 1.5rem; }
          .carousel-control-prev, .carousel-control-next { filter: none; color: #475569; width: 5%; opacity: 0.6; transition: opacity 0.3s ease; }
          .carousel-control-prev:hover, .carousel-control-next:hover { opacity: 1; }
          .footer { text-align: center; padding: 3rem 1rem; margin-top: 5rem; border-top: 1px solid #e2e8f0; background-color: #f1f5f9; }
          .back-to-top { position: fixed; bottom: 2rem; right: 2rem; background-color: #FF7A59; color: white; border: none; border-radius: 50%; width: 50px; height: 50px; font-size: 1.5rem; box-shadow: 0 4px 10px rgba(0,0,0,0.2); transition: all 0.3s ease; cursor: pointer; z-index: 100; display: none; }
          .back-to-top.show { display: block; }
          .back-to-top:hover { background-color: #FF6644; transform: translateY(-3px); }
          .fade-in-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          @media (max-width: 768px) {
            .hero-section { padding: 4rem 1.5rem; }
            .hero-title { font-size: 2.5rem; }
            .hero-subtitle { font-size: 1rem; }
            .section-title { font-size: 1.75rem; }
            .step-number { width: 60px; height: 60px; font-size: 2rem; }
            .back-to-top { bottom: 1rem; right: 1rem; width: 45px; height: 45px; font-size: 1.25rem; }
          }
        `}
      </style>
      <div className="bg-white text-black min-h-screen">
        <div className="container mt-4">
          <section className="hero-section fade-in-up" aria-label="Welcome section">
            {/* ... (Hero content is unchanged) ... */}
            <h1 className="hero-title">
              Welcome to <span className="glitch">FutureTrack</span>
            </h1>
            <p className="lead hero-subtitle">
             <b> Empowering Students, TPOs, and Recruiters with Smart AI Tools</b>
            </p>
            <div className="highlight-cta" aria-label="Call to action highlight">
              Your career journey starts here!
            </div>
            <img
              src="/job.jpg"
              alt="Students collaborating on college project"
              className="img-fluid my-4 hero-img"
              style={{ maxHeight: "600px" }}
              loading="lazy"
            />
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/register" className="btn btn-primary btn-lg btn-animated" aria-label="Get started with registration">
                Get Started
              </Link>
              <Link to="/about" className="btn btn-outline-dark btn-lg btn-animated" aria-label="Learn more about AI Placement Portal">
                Learn More
              </Link>
            </div>
          </section>

          <section className="mt-5 fade-in-up" style={{ animationDelay: "0.3s" }} aria-label="Latest job openings">
            <h2 className="text-center mb-4 section-title">🚀 Latest Job Openings</h2>
            
            {/* --- THIS IS THE NEW REAL-TIME MARQUEE --- */}
            <div className="marquee-container">
              {loading ? ( // Use the 'loading' state
                <p className="marquee-loading">Loading latest jobs...</p>
              ) : jobs.length === 0 ? ( // Use the 'jobs' state
                <p className="marquee-no-jobs">No new job openings at this time.</p>
              ) : (
                <div className="marquee-content" style={{ animationDuration: `${jobs.length * 10}s` }}>
                  {/* First loop for display */}
                  {jobs.map((job) => (
                    <span key={job._id} className="marquee-item">
                      <span className="marquee-item-company">{job.companyName}</span> is hiring: 
                      <span 
                        className="marquee-job-link"
                        role="button" 
                        tabIndex={0}
                        // Use handleProtectedRedirect directly
                        onClick={() => handleProtectedRedirect(`/jobs/${job._id}`)} 
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleProtectedRedirect(`/jobs/${job._id}`)}
                        aria-label={`View details for ${job.jobRole} at ${job.companyName}`}
                      >
                        {` ${job.jobRole} at ${job.location}`}
                      </span>
                    </span>
                  ))}
                  {/* Duplicate content for seamless loop */}
                  {jobs.map((job) => (
                    <span key={`${job._id}-dup`} className="marquee-item" aria-hidden="true">
                      <span className="marquee-item-company">{job.companyName}</span> is hiring: 
                      <span 
                        className="marquee-job-link"
                        role="button" 
                        tabIndex={-1}
                        onClick={() => handleProtectedRedirect(`/jobs/${job._id}`)}
                      >
                        {` ${job.jobRole} at ${job.location}`}
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </div>
            {/* --- END OF REAL-TIME MARQUEE --- */}
            
          </section>

          <section className="how-it-works fade-in-up" style={{ animationDelay: "0.5s" }} aria-label="How it works">
            <h2 className="text-center mb-4 section-title">🔍 How It Works</h2>
            <div className="row g-4 justify-content-center">
              <div className="col-md-4">
                <div className="step text-center">
                  <div className="step-number">1</div>
                  <div className="step-title">Sign Up & Create Profile</div>
                  <p>Create your personalized profile to get tailored job recommendations.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="step text-center">
                  <div className="step-number">2</div>
                  <div className="step-title">Explore & Apply</div>
                  <p>Browse latest job openings and apply directly through the portal.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="step text-center">
                  <div className="step-number">3</div>
                  <div className="step-title">Get AI Assistance</div>
                  <p>Use AI tools for resume scoring, interview practice, and skill gap analysis.</p>
                </div>
              </div>
            </div>
          </section>

       <section className="features-section row text-center mt-5 fade-in-up" style={{ animationDelay: "0.7s" }} aria-label="Key features">            <h2 className="mb-4 w-100 section-title">💡 Key Features</h2>
             <div className="col-md-4 mb-4">
               <div className="card h-100 shadow-sm card-hover student-card" tabIndex={0} aria-label="Features for students">
                 <div className="card-body d-flex flex-column">
                   <h5 className="card-title">🧑‍🎓 For Students</h5>
                   <p className="flex-grow-1">
                    Resume Scoring, Interview Practice, Skill Gap Checker, and AI-Based Recommendations.
                </p>
                   <button
                    onClick={() => handleProtectedRedirect("/dashboard/student")}
                    className="btn btn-sm btn-info btn-animated mt-auto"
                    aria-label="Go to Student Dashboard"
                  >
                    Go to Student Dashboard
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm border-success card-hover admin-card" tabIndex={0} aria-label="Features for admin and TPO">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">👨‍🏫 For Admin/TPO</h5>
                  <p className="flex-grow-1">
                    Batch Analysis, Auto Shortlisting, Company Uploads, and AI Insights for Placements.
                  </p>
                  <button
                    onClick={() => handleProtectedRedirect("/dashboard/admin")}
                    className="btn btn-sm btn-success btn-animated mt-auto"
                    aria-label="Go to Admin Dashboard"
                  >
                    Go to Admin Dashboard
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm border-warning card-hover recruiter-card" tabIndex={0} aria-label="Features for recruiters">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">💼 For Recruiters</h5>
                  <p className="flex-grow-1">
                    Post jobs and internships for students from a dedicated recruiter dashboard.
                  </p>
                  <button
                    onClick={() => handleProtectedRedirect("/dashboard/recruiter")}
                    className="btn btn-sm btn-warning btn-animated mt-auto"
                    aria-label="Go to Recruiter Dashboard"
                  >
                    Go to Recruiter Dashboard
                  </button>
                </div>
              </div>
            </div>
          </section>
          <section className="testimonials fade-in-up" style={{ animationDelay: "0.9s" }} aria-label="User testimonials">
            <h2 className="text-center mb-4 section-title">💬 What Our Users Say</h2>
            <div
              id="testimonialCarousel"
              className="carousel slide"
              data-bs-ride="carousel"
              aria-live="polite"
            >
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <div className="testimonial-card mx-auto">
                    <p className="testimonial-text">
                      "The AI Placement Portal helped me identify my skill gaps and practice interviews. I landed my dream job thanks to this platform!"
                    </p>
                    <p className="testimonial-author">- Priya S., Student</p>
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="testimonial-card mx-auto">
                    <p className="testimonial-text">
                      "As a TPO, the batch analysis and auto shortlisting features saved me countless hours. Highly recommend!"
                    </p>
                    <p className="testimonial-author">- Rajesh K., TPO</p>
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="testimonial-card mx-auto">
                    <p className="testimonial-text">
                      "Posting jobs and managing candidates is so much easier now. The AI insights are a game changer."
                    </p>
                    <p className="testimonial-author">- Anjali M., Recruiter</p>
                  </div>
                </div>
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#testimonialCarousel"
                data-bs-slide="prev"
                aria-label="Previous testimonial"
              >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#testimonialCarousel"
                data-bs-slide="next"
                aria-label="Next testimonial"
              >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
              </button>
            </div>
          </section>
          <footer className="text-center py-4 mt-5 border-top fade-in-up" style={{ animationDelay: "1.1s" }}>
            <p className="mb-0">© 2025 FutureTrack | All Rights Reserved</p>
          </footer>
          <button
            className="back-to-top"
            onClick={scrollToTop}
            aria-label="Back to top"
            title="Back to top"
          >
            ↑
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;


