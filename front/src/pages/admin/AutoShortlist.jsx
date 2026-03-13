// ✅ src/pages/admin/AutoShortlist.jsx

import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api";
import { authorizedFetch } from "../../config/authFetch";

const API_BASE = API_BASE_URL;

const AutoShortlist = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [threshold, setThreshold] = useState(60);
  const [files, setFiles] = useState([]);
  const [shortlist, setShortlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Fetch companies from backend (already uploaded by admin)
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/jobs`);
        if (!res.ok) throw new Error("Failed to fetch company list");
        const data = await res.json();
        setCompanies(data);
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };
    fetchCompanies();
  }, []);

  // ✅ Handle file selection
  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  // ✅ Handle shortlisting process
  const handleShortlist = async () => {
    if (!selectedCompany) {
      alert("Please select a company first!");
      return;
    }

    if (files.length === 0) {
      alert("Please upload at least one resume (PDF).");
      return;
    }

    setLoading(true);
    setMessage("Analyzing resumes...");

    try {
      const formData = new FormData();
      formData.append("threshold", threshold);
      formData.append("companyName", selectedCompany);

      files.forEach((file) => {
        formData.append("resumes", file);
      });

      const res = await authorizedFetch(`${API_BASE}/api/shortlist-resumes`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to analyze resumes");

      setShortlist(data.shortlisted || []);
      setMessage(`✅ Shortlisting complete! ${data.shortlisted.length} students matched.`);
    } catch (err) {
      console.error("Shortlisting error:", err);
      setMessage("❌ Error analyzing resumes: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={styles.container}>
      <h2 style={styles.heading}>🎯 Auto-Shortlist Students</h2>
      <p style={styles.desc}>
        Select a company, set the match threshold, and upload multiple resumes (PDF).
        The AI will match them against the company job description.
      </p>

      {/* ✅ Select company */}
      <div style={styles.section}>
        <label style={styles.label}>Select Company:</label>
        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          style={styles.select}
        >
          <option value="">-- Choose Company --</option>
          {companies.map((c) => (
            <option key={c._id || c.id} value={c.companyName}>
              {c.companyName}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Threshold input */}
      <div style={styles.section}>
        <label style={styles.label}>Match Threshold (%):</label>
        <input
          type="number"
          min="0"
          max="100"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* ✅ File upload */}
      <div style={styles.section}>
        <label style={styles.label}>Upload Resumes (PDF only):</label>
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileChange}
          style={styles.inputFile}
        />
      </div>

      {/* ✅ Action button */}
      <div style={styles.actions}>
        <button
          className="btn btn-primary"
          onClick={handleShortlist}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Run Shortlisting"}
        </button>
      </div>

      {/* ✅ Status message */}
      {message && <p style={styles.message}>{message}</p>}

      {/* ✅ Display shortlist results */}
      {shortlist.length > 0 && (
        <div style={styles.resultBox}>
          <h4>✅ Shortlisted Students</h4>
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Match %</th>
              </tr>
            </thead>
            <tbody>
              {shortlist.map((s, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{s.email || "N/A"}</td>
                  <td>{s.matchScore || 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ✅ Inline CSS styles
const styles = {
  container: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  heading: {
    color: "#0ea5a4",
    marginBottom: "10px",
  },
  desc: {
    fontSize: "15px",
    color: "#334155",
  },
  section: {
    marginTop: "15px",
  },
  label: {
    display: "block",
    fontWeight: "600",
    marginBottom: "5px",
  },
  select: {
    padding: "8px",
    width: "100%",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  input: {
    padding: "8px",
    width: "100%",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  inputFile: {
    display: "block",
    marginTop: "5px",
  },
  actions: {
    marginTop: "20px",
  },
  message: {
    marginTop: "15px",
    fontWeight: "bold",
    color: "#475569",
  },
  resultBox: {
    marginTop: "25px",
  },
};

export default AutoShortlist;
