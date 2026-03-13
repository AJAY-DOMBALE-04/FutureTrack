// ⭐ Dribbble-Style Premium UI Profile Page

import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProfilePage() {
  const navigate = useNavigate();
  const CLOUD_NAME = "dbl7zuox6";
  const UPLOAD_PRESET = "student_photos";

  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  // Load user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) navigate("/login");
      else {
        setUserId(u.uid);
        loadProfile(u.uid, u.email);
      }
    });
    return () => unsub();
  }, []);

  const loadProfile = async (uid, email) => {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (snap.exists()) setProfile(snap.data());
    else {
      const blank = {
        displayName: auth.currentUser?.displayName || "",
        collegeEmail: email,
        branch: "",
        passoutYear: "",
        summary: "",
        profilePhotoUrl: "",
        role: "student",
      };
      await setDoc(ref, blank);
      setProfile(blank);
    }
  };

  const onChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const saveProfile = async () => {
    setBusy(true);
    let url = profile.profilePhotoUrl;

    try {
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", UPLOAD_PRESET);

        const up = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          fd
        );
        url = up.data.secure_url;
      }

      await updateDoc(doc(db, "users", userId), {
        displayName: profile.displayName,
        branch: profile.branch,
        passoutYear: profile.passoutYear,
        summary: profile.summary,
        profilePhotoUrl: url,
      });

      setProfile({ ...profile, profilePhotoUrl: url });
      setMsg({ type: "success", text: "Profile updated!" });
      setEditing(false);
    } catch (e) {
      setMsg({ type: "error", text: "Update failed." });
    }

    setBusy(false);
  };

  const reset = async () => {
    sendPasswordResetEmail(auth, profile.collegeEmail);
    setMsg({ type: "success", text: "Password reset sent!" });
  };

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (!profile)
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}>Loading...</div>
      </div>
    );

  return (
    <div style={styles.page}>
      <div style={styles.glassCard}>
        <h2 style={styles.title}>My Profile</h2>

        {msg && (
          <div
            style={{
              ...styles.alert,
              background: msg.type === "error" ? "#ffe5e5" : "#e6fffa",
              color: msg.type === "error" ? "#b91c1c" : "#0f766e",
            }}
          >
            {msg.text}
          </div>
        )}

        <div style={styles.grid}>
          {/* Left */}
          <div style={styles.left}>
            <div style={styles.avatarGlow}>
              <img
                src={
                  profile.profilePhotoUrl ||
                  "https://api.dicebear.com/8.x/initials/svg?seed=User"
                }
                style={styles.avatar}
                alt="profile"
              />
            </div>

            {editing && (
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                style={styles.fileInput}
              />
            )}

            <button
              style={styles.btnPrimary}
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>

            <button style={styles.btnDanger} onClick={logout}>
              Logout
            </button>

            <button style={styles.btnWarning} onClick={reset}>
              Reset Password
            </button>
          </div>

          {/* Right */}
          <div style={styles.right}>
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input
                name="displayName"
                value={profile.displayName}
                disabled={!editing}
                onChange={onChange}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input value={profile.collegeEmail} disabled style={styles.input} />
            </div>

            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Branch</label>
                <select
                  name="branch"
                  value={profile.branch}
                  disabled={!editing}
                  onChange={onChange}
                  style={styles.input}
                >
                  <option value="">Select</option>
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
                  value={profile.passoutYear}
                  disabled={!editing}
                  onChange={onChange}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Summary / Bio</label>
              <textarea
                name="summary"
                value={profile.summary}
                disabled={!editing}
                onChange={onChange}
                style={styles.textarea}
              />
            </div>

            {editing && (
              <button style={styles.btnPrimary} onClick={saveProfile}>
                {busy ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ⭐ Dribbble Design Styles */
const styles = {
  page: {
    minHeight: "100vh",
    padding: "30px 12px",
    background:
      "linear-gradient(135deg, #e0f7fa, #f1f5ff, #fff1f2, #f0f9ff)",
  },

  glassCard: {
    maxWidth: 900,
    margin: "0 auto",
    padding: 28,
    borderRadius: 25,
    backdropFilter: "blur(14px)",
    background: "rgba(255,255,255,0.65)",
    border: "1px solid rgba(255,255,255,0.4)",
    boxShadow:
      "0 25px 50px rgba(0,0,0,0.1), inset 0 0 40px rgba(255,255,255,0.3)",
  },

  title: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: 800,
    color: "#0f172a",
  },

  alert: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 18,
    fontWeight: 600,
  },

  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 30,
  },

  /* Left Section */
  left: {
    width: "100%",
    maxWidth: 260,
    textAlign: "center",
  },

  avatarGlow: {
    width: 150,
    height: 150,
    margin: "0 auto 14px",
    borderRadius: "50%",
    padding: 4,
    background: "linear-gradient(135deg,#a5f3fc,#e0e7ff,#fecdd3)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.18)",
  },

  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
  },

  btnPrimary: {
    marginTop: 10,
    width: "100%",
    background: "#0ea5a4",
    color: "white",
    padding: "10px 12px",
    borderRadius: 12,
    fontWeight: 700,
    border: "none",
    fontSize: 15,
  },

  btnDanger: {
    marginTop: 10,
    width: "100%",
    background: "#ef4444",
    color: "white",
    padding: "10px 12px",
    borderRadius: 12,
    fontWeight: 700,
    border: "none",
    fontSize: 15,
  },

  btnWarning: {
    marginTop: 10,
    width: "100%",
    background: "#f59e0b",
    color: "white",
    padding: "10px 12px",
    borderRadius: 12,
    fontWeight: 700,
    border: "none",
    fontSize: 15,
  },

  /* Right Section */
  right: {
    flex: 1,
    minWidth: 260,
  },

  field: {
    marginBottom: 16,
  },

  label: {
    display: "block",
    marginBottom: 6,
    color: "#475569",
    fontWeight: 600,
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: 12,
    border: "1px solid #dbeafe",
    background: "rgba(255,255,255,0.8)",
    fontSize: 15,
  },

  textarea: {
    width: "100%",
    padding: 12,
    minHeight: 100,
    borderRadius: 12,
    border: "1px solid #dbeafe",
    background: "rgba(255,255,255,0.85)",
    fontSize: 15,
  },

  row: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
};
