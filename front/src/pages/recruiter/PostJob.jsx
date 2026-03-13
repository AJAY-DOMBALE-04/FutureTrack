import React, { useState } from "react";
import { API_BASE_URL } from "../../config/api";
import { authorizedFetch } from "../../config/authFetch";

const API_BASE = API_BASE_URL;
const initialForm = {
  companyName: "",
  jobRole: "",
  location: "",
  applicationLink: "",
  companyDescription: "",
  eligibleBranches: [],
};

const PostJob = () => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });

  const branches = [
    "Computer Science", "Mechanical", "Electrical",
    "Civil", "Electronics"
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBranchToggle = (branch) => {
    setForm((prev) => ({
      ...prev,
      eligibleBranches: prev.eligibleBranches.includes(branch)
        ? prev.eligibleBranches.filter((b) => b !== branch)
        : [...prev.eligibleBranches, branch],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    try {
      const res = await authorizedFetch(`${API_BASE}/api/recruiter/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Failed to post job.");
      }

      setForm(initialForm);
      setStatus({
        type: "success",
        message: data?.message || "Job posted successfully.",
      });
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err.message === "Failed to fetch"
            ? `Could not reach the backend at ${API_BASE}. Check that the Flask server is running.`
            : err.message,
      });
    }
  };

  return (
    <div className="container mt-4">
      <h2>Post Job or Internship</h2>

      {status.message && (
        <div
          className={`alert ${status.type === "success" ? "alert-success" : "alert-danger"}`}
          role="alert"
        >
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={form.companyName}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-2"
          type="text"
          name="jobRole"
          placeholder="Job Role"
          value={form.jobRole}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-2"
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-2"
          type="text"
          name="applicationLink"
          placeholder="Application Link"
          value={form.applicationLink}
          onChange={handleChange}
          required
        />

        <textarea
          className="form-control mb-2"
          name="companyDescription"
          placeholder="Company Description"
          value={form.companyDescription}
          onChange={handleChange}
          required
        />

        <label><b>Eligible Branches:</b></label>
        <div className="mb-3">
          {branches.map((b) => (
            <div key={b}>
              <input
                type="checkbox"
                checked={form.eligibleBranches.includes(b)}
                onChange={() => handleBranchToggle(b)}
              />
              <span> {b}</span>
            </div>
          ))}
        </div>

        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default PostJob;
