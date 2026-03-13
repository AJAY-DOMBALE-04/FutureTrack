// // ✅ src/context/AuthContext.jsx
// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useCallback, // <-- 1. IMPORT useCallback
// } from "react";
// import { auth, db } from "../firebase";
// import {
//   onAuthStateChanged,
//   signOut as firebaseSignOut,
// } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";

// // --- 2. DEFINE YOUR BACKEND API URL ---
// const API_BASE_URL = 'http://localhost:5000/api'; // Or your production URL

// // 🔹 Create Context
// const AuthContext = createContext(null);

// // 🔹 Hook for easy access
// export const useAuth = () => useContext(AuthContext);

// // 🔹 Provider
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // Firebase user
//   const [userData, setUserData] = useState(null); // Firestore data (with role)
//   const [loading, setLoading] = useState(true);

//   // ✅ Watch for authentication changes (Your code - perfect)
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
//       if (firebaseUser) {
//         setUser(firebaseUser);
//         try {
//           const snap = await getDoc(doc(db, "users", firebaseUser.uid));
//           if (snap.exists()) {
//             setUserData(snap.data());
//           } else {
//             setUserData(null);
//           }
//         } catch (err) {
//           console.error("Error fetching Firestore user data:", err);
//           setUserData(null);
//         }
//       } else {
//         setUser(null);
//         setUserData(null);
//       }
//       setLoading(false);
//     });

//     return () => unsub();
//   }, []);

//   // ✅ Logout function (Your code - perfect)
//   const signOutUser = async () => {
//     await firebaseSignOut(auth);
//     setUser(null);
//     setUserData(null);
//   };

//   // --- 3. CREATE THE 'authenticatedFetch' FUNCTION ---
//   const authenticatedFetch = useCallback(
//     async (endpoint, options = {}) => {
//       // Get the current Firebase user from state
//       if (!user) {
//         throw new Error('You are not authenticated.');
//       }

//       // Get the Firebase ID Token. This is the JWT your
//       // backend's @token_required decorator will verify.
//       const token = await user.getIdToken();

//       // Prepare the headers
//       const headers = new Headers(options.headers || {});
//       headers.append('Authorization', `Bearer ${token}`);

//       // Smartly handle Content-Type for FormData (file uploads) vs JSON
//       if (!(options.body instanceof FormData)) {
//         if (!headers.has('Content-Type')) {
//           headers.append('Content-Type', 'application/json');
//         }
//       }

//       // Build the full URL
//       const fullUrl = `${API_BASE_URL}${endpoint}`;
//       const finalOptions = {
//         ...options,
//         headers: headers,
//       };

//       // Call the real fetch
//       return fetch(fullUrl, finalOptions);
//     },
//     [user] // Dependency: This function will update if the user object changes
//   );
//   // --- END OF NEW FUNCTION ---

//   // ✅ Derived values (Updated)
//   const value = {
//     user,
//     userData,
//     role: userData?.role || null,
//     isAdmin: userData?.role === "admin",
//     isStudent: userData?.role === "student",
//     isRecruiter: userData?.role === "recruiter",
//     loading,
//     signOutUser,
//     authenticatedFetch, // <-- 4. ADD THE FUNCTION TO THE VALUE
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading ? children : (
//         <div style={styles.loading}>
//           <div>Loading user data...</div>
//         </div>
//       )}
//     </AuthContext.Provider>
//   );
// };

// // ✅ Simple styles for loading screen (Your code - perfect)
// const styles = {
//   loading: {
//     minHeight: "100vh",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "18px",
//     fontWeight: "bold",
//     color: "#0ea5a4",
//   },
// };





// ✅ src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { auth, db } from "../firebase";
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { API_BASE_URL } from "../config/api";

const API_BASE = `${API_BASE_URL}/api`;


// 🔹 Create Context
// 🔹 Create Context
const AuthContext = createContext(null);

// 🔹 Hook for easy access
export const useAuth = () => useContext(AuthContext);

// 🔹 Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase user
  const [userData, setUserData] = useState(null); // Firestore data (with role & branch)
  const [loading, setLoading] = useState(true);

  // ✅ Restore from localStorage on load
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("userData");
      const savedUser = savedData ? JSON.parse(savedData) : null;
      if (savedUser) {
        setUserData(savedUser);
      }
    } catch (e) {
      console.warn("⚠️ Failed to parse userData from localStorage:", e);
    }
  }, []);

  // ✅ Watch for Firebase Auth state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(userRef);

          if (snap.exists()) {
            const data = snap.data();
            setUserData(data);

            // 🔹 Save to localStorage for persistence
            localStorage.setItem("userData", JSON.stringify(data));
            if (data.branch)
              localStorage.setItem("branch", data.branch);
            if (data.role)
              localStorage.setItem("role", data.role);
          } else {
            console.warn("⚠️ Firestore user not found.");
            setUserData(null);
          }
        } catch (err) {
          console.error("Error fetching Firestore user data:", err);
          setUserData(null);
        }
      } else {
        // 🔹 User signed out — clear everything
        setUser(null);
        setUserData(null);
        localStorage.removeItem("userData");
        localStorage.removeItem("branch");
        localStorage.removeItem("role");
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  // ✅ Logout function
  const signOutUser = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setUserData(null);
    localStorage.removeItem("userData");
    localStorage.removeItem("branch");
    localStorage.removeItem("role");
  };

  // ✅ Authenticated fetch function (JWT to backend)
  const authenticatedFetch = useCallback(
    async (endpoint, options = {}) => {
      if (!user) {
        throw new Error("You are not authenticated.");
      }

      const token = await user.getIdToken();
      const headers = new Headers(options.headers || {});
      headers.append("Authorization", `Bearer ${token}`);

      // If body is not FormData, add Content-Type
      if (!(options.body instanceof FormData)) {
        if (!headers.has("Content-Type")) {
          headers.append("Content-Type", "application/json");
        }
      }

      const fullUrl = `${API_BASE}${endpoint}`;
      const finalOptions = {
        ...options,
        headers,
      };

      return fetch(fullUrl, finalOptions);
    },
    [user]
  );

  // ✅ Context Value
  const value = {
    user,
    userData,
    role: userData?.role || localStorage.getItem("role") || null,
    branch: userData?.branch || localStorage.getItem("branch") || null,
    isAdmin: (userData?.role || localStorage.getItem("role")) === "admin",
    isStudent: (userData?.role || localStorage.getItem("role")) === "student",
    isRecruiter: (userData?.role || localStorage.getItem("role")) === "recruiter",
    loading,
    signOutUser,
    authenticatedFetch,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? (
        children
      ) : (
        <div style={styles.loading}>
          <div>Loading user data...</div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

// ✅ Simple loading style
const styles = {
  loading: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#0ea5a4",
  },
};
