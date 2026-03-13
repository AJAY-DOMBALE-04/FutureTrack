import React, { useState } from "react";
import { API_BASE_URL } from "../../config/api";

export default function OpportunityRecommender() {
  const [branch, setBranch] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [skills, setSkills] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [result, setResult] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [error, setError] = useState("");

  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

  const submit = async () => {
    // Basic validation check
    if (!branch || !cgpa || !skills) {
        setError("Please fill out Branch, CGPA, and Skills.");
        return;
    }
    
    setLoading(true);
    setError("");
    setResult(null);
    setAiSuggestions(null); // Clear previous AI results

    try {   
      // KEEPING ORIGINAL LOGIC INTACT for Server Data Fetch
      const res = await fetch(`${API_BASE_URL}/api/recommend-from-trends`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branch, cgpa, skills, year, top_k: 10 })
      });
      const data = await res.json();
      if (data.status === "ok") {
        setResult(data.result);
        // Automatically fetch AI suggestions after successful data fetch
        if (skills) {
          getAISuggestions(skills);
        }
      } else {
        setError(data.message || "Server error in core recommendation logic.");
      }
    } catch (e) {
      setError(`Network error in core recommendation: ${String(e)}`);
    } finally {
      setLoading(false);
    }
  };

  const getAISuggestions = async (currentSkills) => {
    if (!apiKey) {
      setAiSuggestions({ error: "Gemini API key is missing. Set REACT_APP_GEMINI_API_KEY in front/.env." });
      return;
    }

    setLoadingAI(true);
    setAiSuggestions(null);

    const prompt = `
      You are an expert career and learning path advisor. Based on the following skills: "${currentSkills}".
      Provide highly relevant and structured learning suggestions for a student pursuing a job related to those skills. 
      Specifically, detail the 'Top 3 Study Areas/Topics' and 'Top 3 Required Tools/Certifications' the student should focus on to succeed in roles matching these skills.
      Your response must be a single JSON object.

      {
        "study_areas": ["string"],
        "certifications": ["string"],
        "summary": "string"
      }
    `;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            study_areas: { type: "ARRAY", items: { type: "STRING" } },
            certifications: { type: "ARRAY", items: { type: "STRING" } },
            summary: { type: "STRING" }
          },
        },
      },
      systemInstruction: {
        parts: [{ text: "You are an expert career and learning path advisor." }]
      },
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (rawText) {
          const aiResult = JSON.parse(rawText);
          setAiSuggestions(aiResult);
      } else {
          throw new Error("Invalid response structure from Gemini API.");
      }

    } catch (err) {
      console.error('Gemini API Error:', err);
      setAiSuggestions({ error: "AI analysis failed. Check console for details." });
    } finally {
      setLoadingAI(false);
    }
  };

  const th = { textAlign: "left", padding: "12px 16px", fontWeight: 700, borderBottom: "2px solid #e5e7eb", color: "#1f2937", background: "#f9fafb" };
  const td = { padding: "12px 16px", verticalAlign: "top", borderBottom: "1px solid #e5e7eb", color: "#4b5563" };


  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap');
          
          .recommender-page {
            font-family: 'Inter', sans-serif;
            background-color: #ffffff;
            color: #1f2937;
            padding: 2rem 1rem;
            min-height: 100vh;
            max-width: 1200px;
            margin: 0 auto;
          }
          .recommender-card {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 1rem;
            padding: 2rem;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
            margin-bottom: 2rem;
          }
          .title-section h2 {
            font-weight: 800;
            font-size: 2rem;
            color: #1f2937;
            margin-bottom: 0.5rem;
          }
          .title-section p {
            color: #4b5563;
            margin-bottom: 2rem;
          }
          .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
          }
          .form-group label {
            font-weight: 600;
            display: block;
            margin-bottom: 0.25rem;
            color: #3b82f6; /* Blue accent for labels */
          }
          .form-group input, .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 1rem;
            box-sizing: border-box;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
          }
          .form-group input:focus, .form-group textarea:focus {
            outline: none;
            border-color: #10b981; /* Green accent on focus */
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
          }
          .action-button-main {
            padding: 0.8rem 2rem;
            background-color: #facc15; /* Yellow accent for primary action */
            color: #000000;
            font-weight: 700;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
            box-shadow: 0 4px #eab308;
            margin-top: 2rem;
          }
          .action-button-main:hover:not(:disabled) {
            background-color: #eab308;
            transform: translateY(2px);
            box-shadow: 0 2px #d99908;
          }
          .action-button-main:disabled {
            background-color: #9ca3af;
            box-shadow: none;
            cursor: not-allowed;
          }

          /* Result Styles */
          .results-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 2rem;
            margin-top: 2rem;
          }
          .stat-card {
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 0.75rem;
            padding: 1.5rem;
            margin-bottom: 1rem;
            font-size: 1.1rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
          }
          .stat-card strong {
            color: #10b981;
            font-weight: 700;
          }
          .ai-card {
            background-color: #ecfdf5; /* Light green background */
            border: 2px solid #10b981;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 6px 12px rgba(16, 185, 129, 0.15);
            animation: fadeIn 0.5s ease-out;
            color: #065f46;
          }
          .ai-card h3 {
            color: #059669;
            border-bottom: 1px solid #a7f3d0;
            padding-bottom: 0.5rem;
            margin-top: 0;
            font-weight: 700;
          }
          .ai-card ul {
            list-style: none;
            padding-left: 0;
          }
          .ai-card li {
            position: relative;
            padding-left: 1.5rem;
            margin-bottom: 0.5rem;
          }
          .ai-card li::before {
            content: '➤';
            position: absolute;
            left: 0;
            color: #10b981;
            font-weight: bold;
          }

          /* Table Styles */
          .table-responsive {
            overflow-x: auto;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
          }
          table {
            min-width: 1000px;
          }
          table th {
             color: #1f2937;
          }

          /* Media Queries */
          @media (max-width: 900px) {
            .results-grid {
              grid-template-columns: 1fr;
            }
            .recommender-card {
              padding: 1.5rem;
            }
          }
        `}
      </style>
      
      <div className="recommender-page">
        <div className="title-section">
          <h2 style={{ color: '#3b82f6' }}>🎯 AI Opportunity Recommender</h2>
          <p>Analyze historical placement trends to find the best career path based on your profile.</p>
        </div>

        {/* Input Form */}
        <div className="recommender-card">
          <div className="form-grid">
            <div className="form-group">
              <label>Branch</label>
              <input value={branch} onChange={(e)=>setBranch(e.target.value)} placeholder="e.g., CSE, ECE" />
            </div>
            <div className="form-group">
              <label>CGPA</label>
              <input type="number" step="0.01" value={cgpa} onChange={(e)=>setCgpa(e.target.value)} placeholder="e.g., 8.5" />
            </div>
            <div className="form-group">
              <label>Graduation Year</label>
              <input type="number" value={year} onChange={(e)=>setYear(e.target.value)} placeholder={new Date().getFullYear()} />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label>Skills (comma separated)</label>
            <textarea rows={3} value={skills} onChange={(e)=>setSkills(e.target.value)} placeholder="e.g., python, sql, machine learning" />
          </div>

          <button onClick={submit} className="action-button-main" disabled={loading}>{loading ? "Searching Trends..." : "Get Recommendation"}</button>
        </div>
        
        {error && <div className="message error" style={{ margin: "20px 0" }}>⚠️ Error: {error}</div>}

        {/* Results Section */}
        {result && (
          <div className="results-grid">
            
            {/* Left Column: Core Data Results */}
            <div>
              <h3 style={{ color: '#10b981', fontWeight: 700, fontSize: '1.5rem' }}>📈 Analysis Summary</h3>
              
              {/* Stats Cards */}
              <div className="form-grid" style={{ gap: '1rem' }}>
                <div className="stat-card">
                  <div style={{ color: '#4b5563' }}>Matched Students:</div>
                  <strong>{result.stats.matched_count ?? 0}</strong> ({(result.stats.matched_pct * 100).toFixed(1) ?? 0}%)
                </div>
                <div className="stat-card">
                  <div style={{ color: '#4b5563' }}>Average Package:</div>
                  <strong>{result.stats.avg_package ?? 0} LPA</strong>
                </div>
                <div className="stat-card">
                  <div style={{ color: '#4b5563' }}>Top Predicted Role:</div>
                  <strong>{result.roles_for_skills?.[0] ?? 'N/A'}</strong>
                </div>
              </div>

              {/* Roles & Companies */}
              <div style={{ display: "flex", gap: 18, marginTop: 24 }}>
                <div style={{ flex: 1 }} className="stat-card">
                  <h4 style={{ color: '#facc15', marginTop: 0, fontWeight: 700 }}>🎯 Predicted Roles</h4>
                  {result.roles_for_skills && result.roles_for_skills.length > 0 ? (
                    <ul style={{ paddingLeft: 20 }}>
                      {result.roles_for_skills.map((r, i) => <li key={i} style={{ marginBottom: 4, color: '#4b5563' }}>{r}</li>)}
                    </ul>
                  ) : <div style={{ color: '#ef4444' }}>No strong role match found.</div>}
                </div>

                <div style={{ flex: 1 }} className="stat-card">
                  <h4 style={{ color: '#facc15', marginTop: 0, fontWeight: 700 }}>🏢 Top Recruiting Companies</h4>
                  {result.companies_for_skills && result.companies_for_skills.length > 0 ? (
                    <ul style={{ paddingLeft: 20 }}>
                      {result.companies_for_skills.map((c,i) => <li key={i} style={{ marginBottom: 4, color: '#4b5563' }}>{c}</li>)}
                    </ul>
                  ) : <div style={{ color: '#ef4444' }}>No companies found.</div>}
                </div>
              </div>


              {/* Top Matched Students Table */}
              <div style={{ marginTop: 30 }}>
                <h3 style={{ color: '#3b82f6', fontWeight: 700, fontSize: '1.5rem', marginBottom: 12 }}>Top Matched Student Profiles</h3>
                {(!result.matched_students || result.matched_students.length === 0) ? (
                  <div className="stat-card" style={{ color: '#ef4444' }}>No matched students found in historical data.</div>
                ) : (
                  <div className="table-responsive">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th style={th}>#</th>
                          <th style={th}>Name</th>
                          <th style={th}>Roll</th>
                          <th style={th}>Branch</th>
                          <th style={th}>Role</th>
                          <th style={th}>Company</th>
                          <th style={th}>Package</th>
                          <th style={th}>Skills</th>
                          <th style={th}>Year</th>
                          <th style={th}>Overlap</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.matched_students.map((s, i) => (
                          <tr key={i} style={{ borderTop: "1px solid #eee" }}>
                            <td style={td}>{i+1}</td>
                            <td style={td}>{s.StudentName}</td>
                            <td style={td}>{s.RollNumber}</td>
                            <td style={td}>{s.Branch}</td>
                            <td style={td}>{s.JobRole}</td>
                            <td style={td}>{s.Company}</td>
                            <td style={td}>{s.Package} LPA</td>
                            <td style={td}>{s.Skills}</td>
                            <td style={td}>{s.Year}</td>
                            <td style={td}>{s.overlap}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: AI Suggestions (Gemini) */}
            <div style={{ position: 'sticky', top: '20px', height: 'fit-content' }}>
              <div className="ai-card">
                <h3 style={{ color: '#10b981' }}>🤖 AI Learning Path Suggestions</h3>
                
                {loadingAI && <div style={{ textAlign: 'center', color: '#065f46' }}>Fetching tailored suggestions...</div>}
                
                {aiSuggestions && aiSuggestions.error && (
                    <div style={{ color: '#ef4444', fontWeight: 600 }}>{aiSuggestions.error}</div>
                )}

                {aiSuggestions && !aiSuggestions.error && (
                  <div>
                    <p>{aiSuggestions.summary}</p>
                    
                    <h4 style={{ fontWeight: 600, fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Top Study Areas:</h4>
                    <ul>
                      {aiSuggestions.study_areas.map((area, i) => <li key={i}>{area}</li>)}
                    </ul>

                    <h4 style={{ fontWeight: 600, fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Required Tools/Certifications:</h4>
                    <ul>
                      {aiSuggestions.certifications.map((cert, i) => <li key={i}>{cert}</li>)}
                    </ul>
                    
                    <small style={{ display: 'block', marginTop: '1.5rem', color: '#374151' }}>*Powered by Gemini AI, based on your entered skills.</small>
                  </div>
                )}

                {!result && !loadingAI && (
                    <div style={{ color: '#4b5563', textAlign: 'center', marginTop: '1rem' }}>
                        Click 'Get Recommendation' to see your personalized AI study path here.
                    </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
}
