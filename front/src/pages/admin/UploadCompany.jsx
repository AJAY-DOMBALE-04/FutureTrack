import React, { useState } from "react";
import { API_BASE_URL } from "../../config/api";
import { authorizedFetch } from "../../config/authFetch";

const UploadCompany = () => {
  const [companyName, setCompanyName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [location, setLocation] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [applicationLink, setApplicationLink] = useState("");
  const [companyImage, setCompanyImage] = useState(null);
  const [eligibleBranches, setEligibleBranches] = useState([]);
  const [message, setMessage] = useState("");

  const API_URL = API_BASE_URL;

  const handleBranchChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setEligibleBranches((prev) => [...prev, value]);
    } else {
      setEligibleBranches((prev) => prev.filter((b) => b !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const formData = new FormData();
    formData.append("companyName", companyName);
    formData.append("jobRole", jobRole);
    formData.append("location", location);
    formData.append("companyDescription", companyDescription);
    formData.append("applicationLink", applicationLink);
    if (companyImage) {
      formData.append("companyImage", companyImage);
    }

    // ✅ Append all selected branches
    eligibleBranches.forEach((branch) =>
      formData.append("eligibleBranches", branch)
    );

    try {
      const response = await authorizedFetch(`${API_URL}/api/jobs`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload job posting");
      }

      const data = await response.json();
      setMessage(data.message || "Job posted successfully!");
      setCompanyName("");
      setJobRole("");
      setLocation("");
      setCompanyDescription("");
      setApplicationLink("");
      setCompanyImage(null);
      setEligibleBranches([]);
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error posting job. Please try again.");
    }
  };

  return (
    <div className="upload-container">
      <style>
        {`
          .upload-container {
            max-width: 700px;
            margin: 2rem auto;
            background: #ffffff;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            font-family: 'Inter', sans-serif;
          }
          h2 {
            text-align: center;
            color: #1e3a8a;
            margin-bottom: 1.5rem;
            font-weight: 800;
          }
          form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          label {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 0.25rem;
          }
          input, textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.2s ease;
          }
          input:focus, textarea:focus {
            border-color: #3b82f6;
            outline: none;
            box-shadow: 0 0 0 2px rgba(59,130,246,0.1);
          }
          textarea {
            resize: vertical;
            min-height: 100px;
          }
          .branches-container {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-top: 0.5rem;
          }
          .branch-option {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            font-size: 0.95rem;
          }
          button {
            background-color: #2563eb;
            color: #ffffff;
            border: none;
            padding: 0.85rem;
            font-size: 1rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 1rem;
          }
          button:hover {
            background-color: #1d4ed8;
            transform: translateY(-2px);
          }
          .message {
            margin-top: 1rem;
            text-align: center;
            font-weight: 600;
            color: #16a34a;
          }
          .error {
            color: #dc2626;
          }
        `}
      </style>

      <h2>Upload Company Details</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Job Role</label>
          <input
            type="text"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Company Description</label>
          <textarea
            value={companyDescription}
            onChange={(e) => setCompanyDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label>Application Link</label>
          <input
            type="url"
            value={applicationLink}
            onChange={(e) => setApplicationLink(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Company Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCompanyImage(e.target.files[0])}
          />
        </div>

        {/* ✅ Branch Selection Section */}
        <div>
          <label>Eligible Branches</label>
          <div className="branches-container">
            {["Computer Science", "Electronics", "Civil", "Electrical", "Mechanical"].map(
              (branch) => (
                <label key={branch} className="branch-option">
                  <input
                    type="checkbox"
                    value={branch}
                    checked={eligibleBranches.includes(branch)}
                    onChange={handleBranchChange}
                  />
                  {branch}
                </label>
              )
            )}
          </div>
        </div>

        <button type="submit">Post Job</button>
      </form>

      {message && <div className={`message ${message.includes("Error") ? "error" : ""}`}>{message}</div>}
    </div>
  );
};

export default UploadCompany;
