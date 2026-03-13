// // ✅ src/pages/AuthPage.jsx (Multi-role: Student, Recruiter, Admin)
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth, db } from "../firebase";
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   updateProfile,
// } from "firebase/auth";
// import { doc, setDoc, getDoc } from "firebase/firestore";
// import axios from "axios";

// export default function AuthPage() {
//   const navigate = useNavigate();
//   const [isLogin, setIsLogin] = useState(true);
//   const [busy, setBusy] = useState(false);
//   const [msg, setMsg] = useState(null);

//   // 🔹 Cloudinary setup
//   const CLOUD_NAME = "dbl7zuox6"; // e.g., placeme123
//   const UPLOAD_PRESET = "student_photos"; // your unsigned upload preset name

//   // 🔹 Form state
//   const [form, setForm] = useState({
//     username: "",
//     rollNumber: "",
//     collegeEmail: "",
//     branch: "",
//     passoutYear: "",
//     password: "",
//     confirmPassword: "",
//     role: "student", // default role
//   });
//   const [file, setFile] = useState(null);

//   const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const resetForm = () => {
//     setForm({
//       username: "",
//       rollNumber: "",
//       collegeEmail: "",
//       branch: "",
//       passoutYear: "",
//       password: "",
//       confirmPassword: "",
//       role: "student",
//     });
//     setFile(null);
//     setMsg(null);
//   };

//   const toggle = () => {
//     setIsLogin(!isLogin);
//     resetForm();
//   };

//   // 🔹 REGISTER handler
//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setMsg(null);
//     const {
//       username,
//       rollNumber,
//       collegeEmail,
//       branch,
//       passoutYear,
//       password,
//       confirmPassword,
//       role,
//     } = form;

//     if (!username || !collegeEmail || !password) {
//       setMsg({ type: "error", text: "Please fill all required fields." });
//       return;
//     }
//     if (password.length < 6) {
//       setMsg({
//         type: "error",
//         text: "Password must be at least 6 characters.",
//       });
//       return;
//     }
//     if (password !== confirmPassword) {
//       setMsg({ type: "error", text: "Passwords do not match." });
//       return;
//     }

//     setBusy(true);
//     try {
//       // Create Firebase Auth account
//       const cred = await createUserWithEmailAndPassword(
//         auth,
//         collegeEmail,
//         password
//       );
//       const uid = cred.user.uid;

//       // Upload to Cloudinary
//       let photoUrl = "";
//       if (file) {
//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append("upload_preset", UPLOAD_PRESET);
//         const uploadRes = await axios.post(
//           `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
//           formData
//         );
//         photoUrl = uploadRes.data.secure_url;
//       }

//       // Update Firebase Auth display info
//       await updateProfile(cred.user, {
//         displayName: username,
//         photoURL: photoUrl || null,
//       });

//       // Create Firestore user document
//       const userDoc = {
//         displayName: username,
//         rollNumber: rollNumber || "",
//         collegeEmail,
//         branch: branch || "",
//         passoutYear: passoutYear || "",
//         profilePhotoUrl: photoUrl || "",
//         summary: "",
//         role,
//         createdAt: new Date().toISOString(),
//       };
//       await setDoc(doc(db, "users", uid), userDoc);

//       setMsg({ type: "success", text: "Registration successful!" });
//       setTimeout(() => navigate(`/dashboard/${role}`), 1000);
//     } catch (err) {
//       console.error("Register error:", err);
//       setMsg({ type: "error", text: err.message || "Registration failed." });
//     } finally {
//       setBusy(false);
//     }
//   };

//   // 🔹 LOGIN handler
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setMsg(null);
//     const { collegeEmail, password } = form;
//     if (!collegeEmail || !password) {
//       setMsg({ type: "error", text: "Please enter email and password." });
//       return;
//     }

//     setBusy(true);
//     try {
//       const cred = await signInWithEmailAndPassword(auth, collegeEmail, password);
//       const uid = cred.user.uid;
//       const snap = await getDoc(doc(db, "users", uid));

//       if (snap.exists()) {
//         const data = snap.data();
//         const role = data.role || "student";
//         setMsg({ type: "success", text: `Login successful as ${role}.` });
//         setTimeout(() => navigate(`/dashboard/${role}`), 800);
//       } else {
//         setMsg({
//           type: "error",
//           text: "User data not found. Contact admin.",
//         });
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       setMsg({ type: "error", text: err.message || "Login failed." });
//     } finally {
//       setBusy(false);
//     }
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.card}>
//         <h2 style={styles.title}>
//           {isLogin ? "Welcome Back" : "Create an Account"}
//         </h2>

//         <form
//           onSubmit={isLogin ? handleLogin : handleRegister}
//           style={styles.form}
//         >
//           {!isLogin && (
//             <>
//               <div style={styles.row}>
//                 <label style={styles.label}>Full Name</label>
//                 <input
//                   name="username"
//                   value={form.username}
//                   onChange={onChange}
//                   style={styles.input}
//                   placeholder="Your name"
//                   required
//                 />
//               </div>

//               <div style={styles.row}>
//                 <label style={styles.label}>Profile Photo (optional)</label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => setFile(e.target.files[0])}
//                   style={styles.inputFile}
//                 />
//               </div>

//               <div style={styles.row}>
//                 <label style={styles.label}>Select Role</label>
//                 <select
//                   name="role"
//                   value={form.role}
//                   onChange={onChange}
//                   style={styles.input}
//                   required
//                 >
//                   <option value="student">Student</option>
//                   <option value="recruiter">Recruiter</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>
//             </>
//           )}

//           <div style={styles.row}>
//             <label style={styles.label}>College Email</label>
//             <input
//               name="collegeEmail"
//               value={form.collegeEmail}
//               onChange={onChange}
//               style={styles.input}
//               placeholder="you@college.edu"
//               type="email"
//               required
//             />
//           </div>

//           {!isLogin && form.role === "student" && (
//             <>
//               <div style={styles.row}>
//                 <label style={styles.label}>Roll Number</label>
//                 <input
//                   name="rollNumber"
//                   value={form.rollNumber}
//                   onChange={onChange}
//                   style={styles.input}
//                   placeholder="e.g., CS2023001"
//                 />
//               </div>

//               <div style={{ display: "flex", gap: 12 }}>
//                 <div style={{ flex: 1 }}>
//                   <label style={styles.label}>Branch</label>
//                   <select
//                     name="branch"
//                     value={form.branch}
//                     onChange={onChange}
//                     style={styles.input}
//                   >
//                     <option value="">Select branch</option>
//                     <option>Computer Science</option>
//                     <option>Electronics</option>
//                     <option>Mechanical</option>
//                     <option>Civil</option>
//                     <option>Electrical</option>
//                   </select>
//                 </div>

//                 <div style={{ flex: 1 }}>
//                   <label style={styles.label}>Passout Year</label>
//                   <input
//                     name="passoutYear"
//                     value={form.passoutYear}
//                     onChange={onChange}
//                     style={styles.input}
//                     placeholder="e.g., 2025"
//                   />
//                 </div>
//               </div>
//             </>
//           )}

//           <div style={styles.row}>
//             <label style={styles.label}>Password</label>
//             <input
//               name="password"
//               value={form.password}
//               onChange={onChange}
//               style={styles.input}
//               placeholder="at least 6 characters"
//               type="password"
//               required
//             />
//           </div>

//           {!isLogin && (
//             <div style={styles.row}>
//               <label style={styles.label}>Confirm Password</label>
//               <input
//                 name="confirmPassword"
//                 value={form.confirmPassword}
//                 onChange={onChange}
//                 style={styles.input}
//                 placeholder="confirm password"
//                 type="password"
//                 required
//               />
//             </div>
//           )}

//           {msg && (
//             <div
//               style={{
//                 ...styles.message,
//                 backgroundColor:
//                   msg.type === "error" ? "#fee2e2" : "#e6ffef",
//                 color: msg.type === "error" ? "#991b1b" : "#065f46",
//               }}
//             >
//               {msg.text}
//             </div>
//           )}

//           <button
//             type="submit"
//             style={{ ...styles.btn, opacity: busy ? 0.7 : 1 }}
//             disabled={busy}
//           >
//             {busy
//               ? "Please wait..."
//               : isLogin
//               ? "Login"
//               : "Register & Continue"}
//           </button>
//         </form>

//         <div style={styles.footerLine}>
//           <small>
//             {isLogin ? "New here?" : "Already have an account?"}{" "}
//             <span onClick={toggle} style={styles.toggleLink}>
//               {isLogin ? "Register" : "Login"}
//             </span>
//           </small>
//         </div>
//       </div>
//     </div>
//   );
// }

// // 🎨 Styles
// const styles = {
//   page: {
//     minHeight: "100vh",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "linear-gradient(180deg,#f1f5f9, #eef2ff)",
//     padding: 24,
//     fontFamily: "'Inter', system-ui, -apple-system",
//   },
//   card: {
//     width: 520,
//     maxWidth: "95%",
//     background: "#fff",
//     borderRadius: 12,
//     padding: 22,
//     boxShadow: "0 10px 30px rgba(2,6,23,0.08)",
//     border: "1px solid #e6eef8",
//   },
//   title: { marginBottom: 12, fontSize: 22, color: "#0f172a" },
//   form: { display: "flex", flexDirection: "column", gap: 12 },
//   row: { display: "flex", flexDirection: "column", gap: 6 },
//   label: { fontSize: 13, fontWeight: 600, color: "#334155" },
//   input: {
//     padding: "10px 12px",
//     borderRadius: 8,
//     border: "1px solid #dbeafe",
//     fontSize: 14,
//   },
//   inputFile: { padding: "6px 8px" },
//   btn: {
//     marginTop: 8,
//     padding: "10px 14px",
//     borderRadius: 10,
//     border: "none",
//     background: "#0ea5a4",
//     color: "#fff",
//     fontWeight: 700,
//     cursor: "pointer",
//   },
//   footerLine: { marginTop: 12, textAlign: "center", color: "#475569" },
//   toggleLink: { color: "#0ea5a4", cursor: "pointer", fontWeight: 700 },
//   message: { padding: 10, borderRadius: 8, fontWeight: 600 },
// };





// ✅ src/pages/AuthPage.jsx (Multi-role: Student, Recruiter, Admin)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { API_BASE_URL } from "../config/api";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  deleteUser,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import axios from "axios";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  // 🔹 Cloudinary setup
  const CLOUD_NAME = "dbl7zuox6";
  const UPLOAD_PRESET = "student_photos";

  // 🔹 Form state
  const [form, setForm] = useState({
    username: "",
    rollNumber: "",
    collegeEmail: "",
    branch: "",
    passoutYear: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [file, setFile] = useState(null);

  const getRegisterErrorMessage = (err) => {
    const code = err?.code || "";
    const raw = (err?.message || "").toLowerCase();

    if (code === "auth/email-already-in-use") {
      return "This email is already registered. Please login instead.";
    }
    if (code === "permission-denied" || raw.includes("insufficient permissions")) {
      return "Account profile could not be saved due to Firestore permissions. Ask admin to update Firestore rules for users/{uid}.";
    }
    if (code === "auth/invalid-email") {
      return "Please enter a valid email address.";
    }
    if (code === "auth/weak-password") {
      return "Password is too weak. Use at least 6 characters.";
    }

    return err?.message || "Registration failed.";
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({
      username: "",
      rollNumber: "",
      collegeEmail: "",
      branch: "",
      passoutYear: "",
      password: "",
      confirmPassword: "",
      role: "student",
    });
    setFile(null);
    setMsg(null);
  };

  const toggle = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  // 🔹 REGISTER handler
  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg(null);
    const {
      username,
      rollNumber,
      collegeEmail,
      branch,
      passoutYear,
      password,
      confirmPassword,
      role,
    } = form;

    if (!username || !collegeEmail || !password) {
      setMsg({ type: "error", text: "Please fill all required fields." });
      return;
    }
    if (password.length < 6) {
      setMsg({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    if (password !== confirmPassword) {
      setMsg({ type: "error", text: "Passwords do not match." });
      return;
    }

    setBusy(true);
    let createdUser = null;
    try {
      const validationResponse = await fetch(`${API_BASE_URL}/api/auth/validate-registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collegeEmail: collegeEmail.trim(),
          role,
        }),
      });
      const validationData = await validationResponse.json();
      if (!validationResponse.ok || !validationData.allowed) {
        throw new Error(validationData.message || "Registration is not allowed for this email.");
      }

      // 🔹 1. Create Firebase Auth account
      const cred = await createUserWithEmailAndPassword(
        auth,
        collegeEmail.trim(),
        password
      );
      createdUser = cred.user;
      const uid = cred.user.uid;

      // 🔹 2. Upload to Cloudinary
      let photoUrl = "";
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          formData
        );
        photoUrl = uploadRes.data.secure_url;
      }

      // 🔹 3. Update Firebase user display info
      await updateProfile(cred.user, {
        displayName: username,
        photoURL: photoUrl || null,
      });

      // 🔹 4. Create Firestore document
      const userDoc = {
        displayName: username,
        rollNumber: rollNumber || "",
        collegeEmail: collegeEmail.trim(),
        branch: branch || "",
        passoutYear: passoutYear || "",
        profilePhotoUrl: photoUrl || "",
        summary: "",
        role,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, "users", uid), userDoc);

      // ✅ 5. Store user info in localStorage for later use
      localStorage.setItem("user", JSON.stringify(userDoc));
      localStorage.setItem("branch", branch || "");
      localStorage.setItem("role", role || "student");

      setMsg({ type: "success", text: "Registration successful!" });
      setTimeout(() => navigate(`/dashboard/${role}`), 1000);
    } catch (err) {
      const code = err?.code || "";
      const raw = (err?.message || "").toLowerCase();

      // Roll back partially created auth account when Firestore write is blocked.
      if (createdUser && (code === "permission-denied" || raw.includes("insufficient permissions"))) {
        try {
          await deleteUser(createdUser);
        } catch (cleanupErr) {
          console.error("Register cleanup error:", cleanupErr);
        }
      }

      console.error("Register error:", err);
      setMsg({ type: "error", text: getRegisterErrorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  // 🔹 LOGIN handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg(null);
    const { collegeEmail, password } = form;
    if (!collegeEmail || !password) {
      setMsg({ type: "error", text: "Please enter email and password." });
      return;
    }

    setBusy(true);
    try {
      // 🔹 1. Login via Firebase Auth
      const cred = await signInWithEmailAndPassword(auth, collegeEmail, password);
      const uid = cred.user.uid;

      // 🔹 2. Get Firestore user data
      const snap = await getDoc(doc(db, "users", uid));

      if (snap.exists()) {
        const data = snap.data();
        const role = data.role || "student";

        // ✅ Store data locally for branch filtering
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("branch", data.branch || "");
        localStorage.setItem("role", role);

        setMsg({ type: "success", text: `Login successful as ${role}.` });
        setTimeout(() => navigate(`/dashboard/${role}`), 800);
      } else {
        setMsg({
          type: "error",
          text: "User data not found. Contact admin.",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      setMsg({ type: "error", text: err.message || "Login failed." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h2>

        <form
          onSubmit={isLogin ? handleLogin : handleRegister}
          style={styles.form}
        >
          {!isLogin && (
            <>
              <div style={styles.row}>
                <label style={styles.label}>Full Name</label>
                <input
                  name="username"
                  value={form.username}
                  onChange={onChange}
                  style={styles.input}
                  placeholder="Your name"
                  required
                />
              </div>

              <div style={styles.row}>
                <label style={styles.label}>Profile Photo (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={styles.inputFile}
                />
              </div>

              <div style={styles.row}>
                <label style={styles.label}>Select Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={onChange}
                  style={styles.input}
                  required
                >
                  <option value="student">Student</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}

          <div style={styles.row}>
            <label style={styles.label}>College Email</label>
            <input
              name="collegeEmail"
              value={form.collegeEmail}
              onChange={onChange}
              style={styles.input}
              placeholder="you@college.edu"
              type="email"
              required
            />
          </div>

          {!isLogin && form.role === "student" && (
            <>
              <div style={styles.row}>
                <label style={styles.label}>Roll Number</label>
                <input
                  name="rollNumber"
                  value={form.rollNumber}
                  onChange={onChange}
                  style={styles.input}
                  placeholder="e.g., CS2023001"
                />
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Branch</label>
                  <select
                    name="branch"
                    value={form.branch}
                    onChange={onChange}
                    style={styles.input}
                  >
                    <option value="">Select branch</option>
                    <option>Computer Science</option>
                    <option>Electronics</option>
                    <option>Mechanical</option>
                    <option>Civil</option>
                    <option>Electrical</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Passout Year</label>
                  <input
                    name="passoutYear"
                    value={form.passoutYear}
                    onChange={onChange}
                    style={styles.input}
                    placeholder="e.g., 2025"
                  />
                </div>
              </div>
            </>
          )}

          <div style={styles.row}>
            <label style={styles.label}>Password</label>
            <input
              name="password"
              value={form.password}
              onChange={onChange}
              style={styles.input}
              placeholder="at least 6 characters"
              type="password"
              required
            />
          </div>

          {!isLogin && (
            <div style={styles.row}>
              <label style={styles.label}>Confirm Password</label>
              <input
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={onChange}
                style={styles.input}
                placeholder="confirm password"
                type="password"
                required
              />
            </div>
          )}

          {msg && (
            <div
              style={{
                ...styles.message,
                backgroundColor:
                  msg.type === "error" ? "#fee2e2" : "#e6ffef",
                color: msg.type === "error" ? "#991b1b" : "#065f46",
              }}
            >
              {msg.text}
            </div>
          )}

          <button
            type="submit"
            style={{ ...styles.btn, opacity: busy ? 0.7 : 1 }}
            disabled={busy}
          >
            {busy
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Register & Continue"}
          </button>
        </form>

        <div style={styles.footerLine}>
          <small>
            {isLogin ? "New here?" : "Already have an account?"}{" "}
            <span onClick={toggle} style={styles.toggleLink}>
              {isLogin ? "Register" : "Login"}
            </span>
          </small>
        </div>
      </div>
    </div>
  );
}

// 🎨 Styles
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(180deg,#f1f5f9, #eef2ff)",
    padding: 24,
    fontFamily: "'Inter', system-ui, -apple-system",
  },
  card: {
    width: 520,
    maxWidth: "95%",
    background: "#fff",
    borderRadius: 12,
    padding: 22,
    boxShadow: "0 10px 30px rgba(2,6,23,0.08)",
    border: "1px solid #e6eef8",
  },
  title: { marginBottom: 12, fontSize: 22, color: "#0f172a" },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  row: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: "#334155" },
  input: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #dbeafe",
    fontSize: 14,
  },
  inputFile: { padding: "6px 8px" },
  btn: {
    marginTop: 8,
    padding: "10px 14px",
    borderRadius: 10,
    border: "none",
    background: "#0ea5a4",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  footerLine: { marginTop: 12, textAlign: "center", color: "#475569" },
  toggleLink: { color: "#0ea5a4", cursor: "pointer", fontWeight: 700 },
  message: { padding: 10, borderRadius: 8, fontWeight: 600 },
};
