// src/pages/admin/PlacementAnalytics.jsx
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api";
import { authorizedFetch } from "../../config/authFetch";

export default function PlacementAnalytics() {
  const API_BASE = API_BASE_URL;
  const JOBS_API = `${API_BASE}/api/jobs`;

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobsError, setJobsError] = useState(null);
  const [sheetLinks, setSheetLinks] = useState(() => {
    try {
      const raw = localStorage.getItem("placement_sheet_links");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [analysisResults, setAnalysisResults] = useState({});
  const [zoomedJob, setZoomedJob] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({}); // { [jobId]: { loading: bool, error: string } }

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setLoadingJobs(true);
    setJobsError(null);
    try {
      const res = await fetch(JOBS_API);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      setJobsError(err.message || "Failed to fetch jobs");
    } finally {
      setLoadingJobs(false);
    }
  }

  function saveLinksToStorage(newLinks) {
    try {
      localStorage.setItem("placement_sheet_links", JSON.stringify(newLinks));
    } catch {}
  }

  function onLinkChange(jobId, value) {
    const next = { ...sheetLinks, [jobId]: value };
    setSheetLinks(next);
    saveLinksToStorage(next);
    setAnalysisResults((prev) => {
      const copy = { ...prev };
      delete copy[jobId];
      return copy;
    });
  }

  function clearSheetLink(jobId) {
    const next = { ...sheetLinks };
    delete next[jobId];
    setSheetLinks(next);
    saveLinksToStorage(next);
    setAnalysisResults((prev) => {
      const copy = { ...prev };
      delete copy[jobId];
      return copy;
    });
  }

  // Analyze Google Sheet (only google sheet url expected)
  async function analyzeSheet(jobId) {
    const url = (sheetLinks && sheetLinks[jobId]) ? sheetLinks[jobId].trim() : "";
    if (!url) {
      setAnalysisResults((p) => ({
        ...p,
        [jobId]: { status: "error", message: "Please provide a Google Sheet link." },
      }));
      return;
    }

    setAnalysisResults((p) => ({
      ...p,
      [jobId]: { status: "loading", message: "Analyzing Google Sheet..." },
    }));

    try {
      const res = await authorizedFetch(`${API_BASE}/api/analyze-google-sheet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Server returned ${res.status}`);

      setAnalysisResults((p) => ({
        ...p,
        [jobId]: {
          status: "ok",
          total: data.total,
          perBranch: data.perBranch,
          message: "✅ Analysis complete",
        },
      }));
    } catch (err) {
      setAnalysisResults((p) => ({
        ...p,
        [jobId]: { status: "error", message: err.message || "Failed to analyze" },
      }));
    }
  }

  // New: Delete job (admin)
  async function deleteJob(jobId) {
    if (!jobId) return;
    const confirmed = window.confirm("Are you sure you want to delete this job? This cannot be undone.");
    if (!confirmed) return;

    // mark loading for this job
    setDeleteStatus((s) => ({ ...s, [jobId]: { loading: true, error: null } }));

    try {
      const res = await authorizedFetch(`${JOBS_API}/${jobId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        let errText = "";
        try {
          const j = await res.json();
          errText = j.error || j.message || JSON.stringify(j);
        } catch {
          errText = `Server returned ${res.status}`;
        }
        throw new Error(errText);
      }

      // successful delete — remove job from UI
      setJobs((prev) => prev.filter((j) => (j._id || j.id || j.jobId) !== jobId));
      setDeleteStatus((s) => ({ ...s, [jobId]: { loading: false, error: null } }));

      // Also clear any stored sheet link or analysis for this job
      const nextLinks = { ...sheetLinks };
      delete nextLinks[jobId];
      setSheetLinks(nextLinks);
      saveLinksToStorage(nextLinks);

      setAnalysisResults((prev) => {
        const copy = { ...prev };
        delete copy[jobId];
        return copy;
      });
    } catch (err) {
      console.error("🔥 Delete job error:", err);
      setDeleteStatus((s) => ({ ...s, [jobId]: { loading: false, error: err.message || "Failed to delete" } }));
      alert(`Delete failed: ${err.message || "See console for details."}`);
    }
  }

  function formatPostedAt(isoString) {
    try {
      return new Date(isoString).toLocaleString();
    } catch {
      return "N/A";
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Placement Analytics</h1>
      {loadingJobs ? (
        <div style={styles.message}>Loading jobs...</div>
      ) : jobsError ? (
        <div style={{ ...styles.message, color: "crimson" }}>Error: {jobsError}</div>
      ) : jobs.length === 0 ? (
        <div style={styles.message}>No jobs posted yet.</div>
      ) : (
        <div style={styles.grid}>
          {jobs.map((job) => {
            // job id may be in _id (Mongo) or id (Firebase). normalize
            const id = job._id || job.id || job.jobId || job._doc?.id;
            const linkValue = sheetLinks[id] || "";
            const result = analysisResults[id];
            const del = deleteStatus[id] || { loading: false, error: null };

            return (
              <div
                key={id}
                style={styles.card}
                // clicking card zooms
                onClick={() => setZoomedJob(job)}
              >
                <div style={styles.cardTop}>
                  <div style={styles.imageBox}>
                    {job.companyImagePath ? (
                      <img
                        src={job.companyImagePath}
                        alt={job.companyName}
                        style={styles.companyImage}
                      />
                    ) : (
                      <div style={styles.placeholder}>No Image</div>
                    )}
                  </div>
                  <div style={styles.infoBox}>
                    <h2 style={styles.companyName}>{job.companyName}</h2>
                    <div style={styles.metaRow}>
                      <span style={styles.role}>{job.jobRole}</span>
                      <span style={styles.dot}>•</span>
                      <span style={styles.location}>{job.location}</span>
                    </div>
                    <div style={styles.postMeta}>Posted: {formatPostedAt(job.postedAt)}</div>
                  </div>
                </div>

                <div style={styles.description}>{job.companyDescription}</div>
                <div style={styles.branchesLine}>
                  <strong>Eligible Branches:</strong>{" "}
                  {Array.isArray(job.eligibleBranches)
                    ? job.eligibleBranches.join(", ")
                    : job.eligibleBranches || "All"}
                </div>

                <div style={styles.applicationRow}>
                  <a
                    href={job.applicationLink || "#"}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.applyBtn}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {job.applicationLink ? "Open Application Link" : "No Application Link"}
                  </a>
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  {/* Delete button for admin */}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteJob(id); }}
                    style={{
                      ...styles.deleteBtn,
                      opacity: del.loading ? 0.7 : 1,
                      cursor: del.loading ? "not-allowed" : "pointer",
                    }}
                    disabled={del.loading}
                    title="Delete job"
                  >
                    {del.loading ? "Deleting..." : "Delete"}
                  </button>

                  {/* Quick re-analyze if a link exists */}
                  <button
                    onClick={(e) => { e.stopPropagation(); analyzeSheet(id); }}
                    style={styles.analyzeBtnSmall}
                    title="Analyze Google Sheet for this job"
                  >
                    Analyze Sheet
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); clearSheetLink(id); }}
                    style={styles.clearBtnSmall}
                    title="Clear saved sheet link"
                  >
                    Clear Link
                  </button>
                </div>

                {del.error && (
                  <div style={{ color: "crimson", marginTop: 8 }}>Delete error: {del.error}</div>
                )}

                <hr style={{ margin: "16px 0", border: "none", borderTop: "1px solid #eee" }} />

                <div style={styles.sheetSection}>
                  <label style={styles.label}>Google Sheet Link</label>
                  <div style={styles.sheetRow}>
                    <input
                      type="text"
                      placeholder="Paste Google Sheet link"
                      value={linkValue}
                      onChange={(e) => onLinkChange(id, e.target.value)}
                      style={styles.input}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); analyzeSheet(id); }}
                      style={styles.analyzeBtn}
                    >
                      Analyze
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); clearSheetLink(id); }}
                      style={styles.clearBtn}
                    >
                      Clear
                    </button>
                  </div>

                  {linkValue && (
                    <div style={styles.linkShow}>
                      Saved:{" "}
                      <a href={linkValue} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                        View Sheet
                      </a>
                    </div>
                  )}

                  <div style={styles.analysisArea}>
                    {result ? (
                      result.status === "loading" ? (
                        <div style={styles.smallMessage}>Analyzing Google Sheet...</div>
                      ) : result.status === "error" ? (
                        <div style={{ ...styles.smallMessage, color: "crimson" }}>
                          ❌ {result.message}
                        </div>
                      ) : (
                        <div>
                          <div style={styles.smallMessage}>{result.message}</div>
                          <div style={{ marginTop: 8 }}>
                            <strong>Total Students:</strong> {result.total ?? 0}
                          </div>
                          <div style={{ marginTop: 8 }}>
                            <strong>By Branch:</strong>
                            <ul style={{ marginTop: 6, lineHeight: 1.6 }}>
                              {Object.entries(result.perBranch).map(([b, c]) => (
                                <li key={b}>
                                  {b}: {c}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )
                    ) : (
                      <div style={styles.smallMessage}>No analysis yet.</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {zoomedJob && (
        <div style={styles.modalOverlay} onClick={() => setZoomedJob(null)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: 10 }}>{zoomedJob.companyName}</h2>
            <p><b>Role:</b> {zoomedJob.jobRole}</p>
            <p><b>Location:</b> {zoomedJob.location}</p>
            <p><b>Description:</b> {zoomedJob.companyDescription}</p>
            <p><b>Eligible Branches:</b> {Array.isArray(zoomedJob.eligibleBranches) ? zoomedJob.eligibleBranches.join(", ") : zoomedJob.eligibleBranches}</p>
            <button style={styles.closeModalBtn} onClick={() => setZoomedJob(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: 24, minHeight: "100vh", background: "#f3f4f6" },
  heading: { textAlign: "center", fontSize: 26, marginBottom: 18 },
  message: { textAlign: "center", fontSize: 16 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: 22,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 18,
    boxShadow: "0 6px 18px rgba(2,6,23,0.08)",
    border: "1px solid #e5e7eb",
    lineHeight: 1.6,
    transition: "transform 0.15s ease",
    cursor: "pointer",
  },
  cardTop: { display: "flex", gap: 14, marginBottom: 12 },
  imageBox: {
    width: 90,
    height: 90,
    borderRadius: 8,
    overflow: "hidden",
    background: "#f8fafc",
    border: "1px solid #eef2f7",
  },
  companyImage: { width: "100%", height: "100%", objectFit: "cover" },
  placeholder: { color: "#9ca3af", fontSize: 12 },
  infoBox: { flex: 1 },
  companyName: { margin: 0, fontSize: 18, color: "#0b5ed7" },
  metaRow: { display: "flex", gap: 8, fontSize: 13, color: "#475569" },
  dot: { color: "#cbd5e1" },
  postMeta: { color: "#94a3b8", fontSize: 12, marginTop: 4 },
  description: { color: "#334155", fontSize: 14, marginTop: 8, marginBottom: 10 },
  branchesLine: { color: "#0f172a", fontSize: 13, marginBottom: 8 },
  applicationRow: { marginTop: 10 },
  applyBtn: {
    padding: "8px 12px",
    background: "#2563eb",
    color: "#fff",
    borderRadius: 8,
    textDecoration: "none",
    fontSize: 13,
  },
  deleteBtn: {
    padding: "8px 12px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 8,
  },
  analyzeBtnSmall: {
    padding: "8px 12px",
    background: "#059669",
    color: "#fff",
    border: "none",
    borderRadius: 8,
  },
  clearBtnSmall: {
    padding: "8px 10px",
    background: "#6b7280",
    color: "#fff",
    border: "none",
    borderRadius: 8,
  },
  sheetSection: { marginTop: 8 },
  label: { fontSize: 13, fontWeight: 600 },
  sheetRow: { display: "flex", gap: 8, marginTop: 4 },
  input: {
    flex: 1,
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #e6eef8",
  },
  analyzeBtn: {
    padding: "8px 12px",
    background: "#059669",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  clearBtn: {
    padding: "8px 10px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  linkShow: { marginTop: 8, fontSize: 13 },
  analysisArea: { marginTop: 8 },
  smallMessage: { fontSize: 13, color: "#64748b" },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalCard: {
    background: "#fff",
    padding: 24,
    borderRadius: 12,
    maxWidth: "600px",
    width: "90%",
    boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
    lineHeight: 1.6,
  },
  closeModalBtn: {
    marginTop: 16,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 12px",
    cursor: "pointer",
  },
};
