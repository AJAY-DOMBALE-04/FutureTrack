// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Navbar() {
//   const { user, role, signOutUser } = useAuth();
//   const navigate = useNavigate();
//   const [menuOpen, setMenuOpen] = useState(false);

//   const handleLogout = async () => {
//     await signOutUser();
//     navigate("/login");
//   };

//   return (
//     <nav className="navbar">
//       {/* Brand */}
//       <div className="nav-left">
//         <Link to="/" className="brand">
//           <span className="green">Future</span>Track
//         </Link>
//       </div>

//       {/* Hamburger (mobile only) */}
//       <button
//         className="hamburger-btn"
//         onClick={() => setMenuOpen(!menuOpen)}
//       >
//         ☰
//       </button>

//       {/* Desktop Menu */}
//       <div className="nav-right desktop-menu">
//         <MenuItems user={user} role={role} handleLogout={handleLogout} />
//       </div>

//       {/* Mobile dropdown */}
//       {menuOpen && (
//         <div className="mobile-menu">
//           <MenuItems
//             user={user}
//             role={role}
//             handleLogout={handleLogout}
//             isMobile
//             onClickItem={() => setMenuOpen(false)}
//           />
//         </div>
//       )}
//     </nav>
//   );
// }

// /* ---------- REUSABLE MENU COMPONENT ---------- */
// const MenuItems = ({ user, role, handleLogout, isMobile, onClickItem }) => {
//   const linkClass = isMobile ? "mobile-link" : "nav-link";

//   return (
//     <>
//       <Link to="/" className={linkClass} onClick={onClickItem}>Home</Link>
//       <Link to="/about" className={linkClass} onClick={onClickItem}>About</Link>
//       <Link to="/company-list" className={linkClass} onClick={onClickItem}>Company</Link>

//       {!user ? (
//         <Link
//           to="/login"
//           className={isMobile ? "mobile-auth-btn" : "auth-btn"}
//           onClick={onClickItem}
//         >
//           Login / Register
//         </Link>
//       ) : (
//         <>
//           {role === "student" && (
//             <Link
//               to="/dashboard/student"
//               className={linkClass}
//               onClick={onClickItem}
//             >
//               Student Dashboard
//             </Link>
//           )}

//           {role === "admin" && (
//             <Link
//               to="/dashboard/admin"
//               className={linkClass}
//               onClick={onClickItem}
//             >
//               Admin Dashboard
//             </Link>
//           )}

//           {role === "recruiter" && (
//             <Link
//               to="/dashboard/recruiter"
//               className={linkClass}
//               onClick={onClickItem}
//             >
//               Recruiter Dashboard
//             </Link>
//           )}

//           <Link to="/profile" className={linkClass} onClick={onClickItem}>
//             {user.photoURL ? (
//               <img src={user.photoURL} alt="profile" className="profile-img" />
//             ) : (
//               <span className="avatar">
//                 {user.displayName ? user.displayName[0].toUpperCase() : "U"}
//               </span>
//             )}
//             Profile
//           </Link>

//           <button
//             className={isMobile ? "mobile-logout-btn" : "logout-btn"}
//             onClick={handleLogout}
//           >
//             Logout
//           </button>
//         </>
//       )}
//     </>
//   );
// };

// /* ---------- PURE CSS (NO INLINE STYLES) ---------- */
// const css = `
// .navbar {
//   width: 100%;
//   padding: 10px 20px;
//   background-color: #0f172a;
//   color: white;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   position: sticky;
//   top: 0;
//   z-index: 100;
// }

// .brand {
//   text-decoration: none;
//   font-size: 22px;
//   font-weight: 700;
//   color: white;
// }
// .green { color: #0ea5a4; }

// .hamburger-btn {
//   display: none;
//   font-size: 28px;
//   background: none;
//   border: none;
//   color: white;
//   cursor: pointer;
// }

// .nav-right {
//   display: flex;
//   gap: 18px;
//   align-items: center;
// }

// .nav-link {
//   color: #e2e8f0;
//   text-decoration: none;
//   font-size: 15px;
//   font-weight: 500;
// }

// .auth-btn {
//   background: #0ea5a4;
//   padding: 6px 12px;
//   border-radius: 6px;
//   color: white;
//   font-weight: 600;
//   text-decoration: none;
// }

// .logout-btn {
//   background: #ef4444;
//   border: none;
//   padding: 6px 10px;
//   border-radius: 6px;
//   color: white;
// }

// /* MOBILE MENU */
// .mobile-menu {
//   width: 100%;
//   background: #0f172a;
//   padding: 20px;
//   display: flex;
//   flex-direction: column;
//   gap: 16px;
// }

// .mobile-link {
//   color: #e2e8f0;
//   font-size: 18px;
//   text-decoration: none;
// }

// .mobile-auth-btn {
//   background: #0ea5a4;
//   padding: 12px;
//   border-radius: 8px;
//   text-align: center;
//   color: white;
// }

// .mobile-logout-btn {
//   background: #ef4444;
//   padding: 12px;
//   border-radius: 8px;
//   border: none;
//   color: white;
//   width: 100%;
// }

// .profile-img {
//   width: 28px;
//   height: 28px;
//   border-radius: 50%;
//   margin-right: 6px;
// }

// .avatar {
//   width: 28px;
//   height: 28px;
//   border-radius: 50%;
//   background: #334155;
//   color: white;
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;
//   margin-right: 6px;
// }

// /* RESPONSIVE */
// @media (max-width: 768px) {
//   .desktop-menu { display: none; }
//   .hamburger-btn { display: block; }
// }
// @media (min-width: 769px) {
//   .mobile-menu { display: none; }
// }
// `;

// // inject CSS
// const style = document.createElement("style");
// style.innerHTML = css;
// document.head.appendChild(style);




import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, role, signOutUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOutUser();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="nav-left">
        <Link to="/" className="brand">
          <span className="green">Future</span>Track
        </Link>
      </div>

      {/* Hamburger (mobile only) */}
      <button
        className="hamburger-btn"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {/* Desktop Menu */}
      <div className="nav-right desktop-menu">
        <MenuItems user={user} role={role} handleLogout={handleLogout} />
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mobile-menu">
          <MenuItems
            user={user}
            role={role}
            handleLogout={handleLogout}
            isMobile
            onClickItem={() => setMenuOpen(false)}
          />
        </div>
      )}
    </nav>
  );
}

/* ---------- REUSABLE MENU COMPONENT ---------- */
const MenuItems = ({ user, role, handleLogout, isMobile, onClickItem }) => {
  const linkClass = isMobile ? "mobile-link" : "nav-link";

  return (
    <>
      <Link to="/" className={linkClass} onClick={onClickItem}>Home</Link>
      <Link to="/about" className={linkClass} onClick={onClickItem}>About</Link>
      <Link to="/company-list" className={linkClass} onClick={onClickItem}>Company</Link>

      {!user ? (
        <Link
          to="/login"
          className={isMobile ? "mobile-auth-btn" : "auth-btn"}
          onClick={onClickItem}
        >
          Login / Register
        </Link>
      ) : (
        <>
          {role === "student" && (
            <Link
              to="/dashboard/student"
              className={linkClass}
              onClick={onClickItem}
            >
              Student Dashboard
            </Link>
          )}

          {role === "admin" && (
            <Link
              to="/dashboard/admin"
              className={linkClass}
              onClick={onClickItem}
            >
              Admin Dashboard
            </Link>
          )}

          {role === "recruiter" && (
            <Link
              to="/dashboard/recruiter"
              className={linkClass}
              onClick={onClickItem}
            >
              Recruiter Dashboard
            </Link>
          )}

          <Link to="/profile" className={linkClass} onClick={onClickItem}>
            {user.photoURL ? (
              <img src={user.photoURL} alt="profile" className="profile-img" />
            ) : (
              <span className="avatar">
                {user.displayName ? user.displayName[0].toUpperCase() : "U"}
              </span>
            )}
            Profile
          </Link>

          <button
            className={isMobile ? "mobile-logout-btn" : "logout-btn"}
            onClick={handleLogout}
          >
            Logout
          </button>
        </>
      )}
    </>
  );
};

/* ---------- PURE CSS (NO INLINE STYLES) ---------- */
const css = `
/* Make navbar always visible */
.navbar {
  width: 100%;
  padding: 10px 20px;
  background-color: #0f172a;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;   /* ← CHANGED */
  top: 0;            /* ← ADDED */
  left: 0;           /* ← ADDED */
  right: 0;          /* ← ADDED */
  z-index: 1000;     /* ↑ Increased so it stays above all content */
}

/* Add top padding so page content isn't hidden behind navbar */
body {
  padding-top: 70px; 
}

.brand {
  text-decoration: none;
  font-size: 22px;
  font-weight: 700;
  color: white;
}
.green { color: #0ea5a4; }

.hamburger-btn {
  display: none;
  font-size: 28px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

.nav-right {
  display: flex;
  gap: 18px;
  align-items: center;
}

.nav-link {
  color: #e2e8f0;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
}

.auth-btn {
  background: #0ea5a4;
  padding: 6px 12px;
  border-radius: 6px;
  color: white;
  font-weight: 600;
  text-decoration: none;
}

.logout-btn {
  background: #ef4444;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  color: white;
}

/* MOBILE MENU */
.mobile-menu {
  width: 100%;
  background: #0f172a;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mobile-link {
  color: #e2e8f0;
  font-size: 18px;
  text-decoration: none;
}

.mobile-auth-btn {
  background: #0ea5a4;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  color: white;
}

.mobile-logout-btn {
  background: #ef4444;
  padding: 12px;
  border-radius: 8px;
  border: none;
  color: white;
  width: 100%;
}

.profile-img {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-right: 6px;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #334155;
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 6px;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .desktop-menu { display: none; }
  .hamburger-btn { display: block; }
}
@media (min-width: 769px) {
  .mobile-menu { display: none; }
}
`;

// inject CSS
const style = document.createElement("style");
style.innerHTML = css;
document.head.appendChild(style);
