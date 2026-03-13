// ✅ src/pages/admin/SkillGapAnalysis.jsx
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api";
import { authorizedFetch } from "../../config/authFetch";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const API_BASE = API_BASE_URL;

export default function SkillGapAnalysis() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch company list
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/jobs`);
        const data = await res.json();
        setCompanies(data);
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };
    fetchCompanies();
  }, []);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleAnalyze = async () => {
    if (!selectedCompany) {
      alert("Please select a company first!");
      return;
    }
    if (files.length === 0) {
      alert("Please upload at least one resume PDF!");
      return;
    }

    setLoading(true);
    setMessage("Analyzing skill gaps...");

    try {
      const formData = new FormData();
      formData.append("companyName", selectedCompany);
      files.forEach((file) => formData.append("resumes", file));

      const res = await authorizedFetch(`${API_BASE}/api/skill-gap-analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to analyze resumes");

      setResults(data.results || []);
      setMessage(`✅ Analysis complete! ${data.results.length} resumes processed.`);
    } catch (err) {
      console.error("Skill gap error:", err);
      setMessage("❌ Error analyzing resumes: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🧠 Skill Gap Analysis</h2>
      <p style={styles.desc}>
        Select a company, upload resumes, and analyze missing skills based on the job role description.
      </p>

      {/* Select company */}
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

      {/* File upload */}
      <div style={styles.section}>
        <label style={styles.label}>Upload Student Resumes (PDF only):</label>
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileChange}
          style={styles.inputFile}
        />
      </div>

      <div style={styles.actions}>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? "Analyzing..." : "Run Skill Gap Analysis"}
        </button>
      </div>

      {message && <p style={styles.message}>{message}</p>}

      {/* Results Table */}
      {results.length > 0 && (
        <div style={styles.resultBox}>
          <h4>📊 Analysis Results</h4>
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Match %</th>
                <th>Missing Skills</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{r.email}</td>
                  <td>{r.matchScore}%</td>
                  <td>{r.missingSkills.join(", ") || "None"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 📈 Bar Chart Visualization */}
          <div style={{ marginTop: "30px", height: "350px" }}>
            <h5 style={{ textAlign: "center", marginBottom: "10px" }}>
              Skill Match Percentage per Resume
            </h5>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="email"
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                  style={{ fontSize: "12px" }}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="matchScore" fill="#0ea5a4" radius={[6, 6, 0, 0]}>
                  <LabelList dataKey="matchScore" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

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
