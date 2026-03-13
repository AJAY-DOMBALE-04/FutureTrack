// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// // ------------------------------------
// // AUTHENTICATION IMPORTS (FIXED PATHS)
// // ------------------------------------
// import { AuthProvider } from './context/AuthContext';         
// import AuthPage from './pages/AuthPage';                       
// import ProfilePage from './pages/ProfilePage';                  

// // CORE COMPONENTS
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import About from './pages/About';
// import CompanyListPage from './pages/CompanyListPage'; 
// import Footer from './components/Footer';

// // DASHBOARDS
// import StudentDashboard from './pages/dashboards/StudentDashboard';
// import AdminDashboard from './pages/dashboards/AdminDashboard';
// import RecruiterDashboard from './pages/dashboards/RecruiterDashboard';

// // FEATURE PAGES
// import ResumeAnalyzer from './pages/features/ResumeAnalyzer';
// import Opportunities from './pages/features/Opportunities';
// import LearningPath from './pages/features/LearningPath';
// import PlacementStatus from './pages/features/PlacementStatus';

// // ADMIN PAGES
// import ManageStudents from './pages/admin/ManageStudents';
// import UploadCompany from './pages/admin/UploadCompany';
// import PlacementAnalytics from './pages/admin/PlacementAnalytics';
// import AutoShortlist from './pages/admin/AutoShortlist';
// import SkillGapAnalysis from './pages/admin/SkillGapAnalysis';
// import AIModelMonitor from './pages/admin/AIModelMonitor';

// // RECRUITER PAGES
// import PostJob from './pages/recruiter/PostJob';
// import ViewShortlisted from './pages/recruiter/ViewShortlisted';
// import ViewResumes from './pages/recruiter/ViewResumes';
// import Reports from './pages/recruiter/Reports';


// function App() {
//   return (
//     <Router> {/* Router must be the highest-level component */}
//       <AuthProvider> {/* AuthProvider must be INSIDE the Router */}
//         <Navbar />
//         <div className="container">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/company-list" element={<CompanyListPage />} />

//             {/* AUTHENTICATION ROUTES */}
//             <Route path="/login" element={<AuthPage />} />       
//             <Route path="/register" element={<AuthPage />} />    
//             <Route path="/profile" element={<ProfilePage />} /> 

//             {/* DASHBOARD ROUTES */}
//             <Route path="/dashboard/student" element={<StudentDashboard />} />
//             <Route path="/dashboard/admin" element={<AdminDashboard />} />
//             <Route path="/dashboard/recruiter" element={<RecruiterDashboard />} />
            
//             {/* FEATURE ROUTES */}
//             <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
//             <Route path="/opportunities" element={<Opportunities />} />
//             <Route path="/learning-path" element={<LearningPath />} />
//             <Route path="/placement-status" element={<PlacementStatus />} />

//             {/* ADMIN ROUTES */}
//             <Route path="/admin/manage-students" element={<ManageStudents />} />
//             <Route path="/admin/upload-company" element={<UploadCompany />} />
//             <Route path="/admin/placement-analytics" element={<PlacementAnalytics />} />
//             <Route path="/admin/auto-shortlist" element={<AutoShortlist />} />
//             <Route path="/admin/skill-gap-analysis" element={<SkillGapAnalysis />} />
//             <Route path="/admin/ai-models" element={<AIModelMonitor />} />

//             {/* RECRUITER ROUTES */}
//             <Route path="/recruiter/post-job" element={<PostJob />} />
//             <Route path="/recruiter/view-shortlisted" element={<ViewShortlisted />} />
//             <Route path="/recruiter/resumes" element={<ViewResumes />} />
//             <Route path="/recruiter/reports" element={<Reports />} />

//           </Routes>
//         </div>
//         <Footer />  
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;







// ✅ src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ------------------------------------
// AUTHENTICATION IMPORTS
// ------------------------------------
import { AuthProvider } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";

// CORE COMPONENTS
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import CompanyListPage from "./pages/CompanyListPage";
import Footer from "./components/Footer";

// DASHBOARDS
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import RecruiterDashboard from "./pages/dashboards/RecruiterDashboard";

// FEATURE PAGES
import ResumeAnalyzer from "./pages/features/ResumeAnalyzer";
import Opportunities from "./pages/features/Opportunities";
import LearningPath from "./pages/features/LearningPath";
import PlacementStatus from "./pages/features/PlacementStatus";

// ADMIN PAGES
import ManageStudents from "./pages/admin/ManageStudents";
import UploadCompany from "./pages/admin/UploadCompany";
import PlacementAnalytics from "./pages/admin/PlacementAnalytics";
import AutoShortlist from "./pages/admin/AutoShortlist";
import SkillGapAnalysis from "./pages/admin/SkillGapAnalysis";


// RECRUITER PAGES
import PostJob from "./pages/recruiter/PostJob";

// ✅ Protected Route Component
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />

        <div className="container">
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/company-list" element={<CompanyListPage />} />

            {/* AUTH ROUTES */}
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />

            {/* ✅ PROTECTED PROFILE (any logged-in user can access) */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={["student", "admin", "recruiter"]}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* ✅ DASHBOARDS */}
            <Route
              path="/dashboard/student"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/recruiter"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />

            {/* ✅ FEATURE PAGES — accessible only to students */}
            <Route
              path="/resume-analyzer"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <ResumeAnalyzer />
                </ProtectedRoute>
              }
            />

            <Route
              path="/opportunities"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <Opportunities />
                </ProtectedRoute>
              }
            />

            <Route
              path="/learning-path"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <LearningPath />
                </ProtectedRoute>
              }
            />

            <Route
              path="/placement-status"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <PlacementStatus />
                </ProtectedRoute>
              }
            />

            {/* ✅ ADMIN ROUTES */}
            <Route
              path="/admin/manage-students"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ManageStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/upload-company"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UploadCompany />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/placement-analytics"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <PlacementAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/auto-shortlist"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AutoShortlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/skill-gap-analysis"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <SkillGapAnalysis />
                </ProtectedRoute>
              }
            />
          
              
            

            {/* ✅ RECRUITER ROUTES */}
            <Route
              path="/recruiter/post-job"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <PostJob />
                </ProtectedRoute>
              }
            />
            
            
          </Routes>
        </div>

        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
