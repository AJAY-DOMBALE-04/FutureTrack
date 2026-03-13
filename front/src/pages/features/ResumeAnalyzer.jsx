import React, { useState } from 'react';
import './ResumeAnalyzer.css'; 
// FIX: Import the useAuth hook with the .jsx extension
import { useAuth } from '../../context/AuthContext.jsx'; 

const ResumeAnalyzer = () => {
  // FIX: Get the authenticatedFetch function from the context
  const { authenticatedFetch } = useAuth();

  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [resumeDetails, setResumeDetails] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    summary: '',
    experience: [{ company: '', role: '', duration: '', description: '' }],
    education: [{ university: '', degree: '', year: '' }],
    skills: '',
    projects: [{ title: '', description: '' }], // Added projects for completeness
  });

  const templates = [
    { name: 'Modern', id: 'modern', image: 'https://placehold.co/200x280/a6c6e7/2c3e50?text=Modern' },
    { name: 'Professional', id: 'professional', image: 'https://placehold.co/200x280/b6d4e4/2c3e50?text=Professional' },
    { name: 'Creative', id: 'creative', image: 'https://placehold.co/200x280/c6e3d2/2c3e50?text=Creative' },
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError('');
      setResult(null);
    } else {
      setFile(null);
      setError("Please select a valid PDF file.");
    }
  };

  const handleAnalyze = async () => {
    if (!file || !jobDescription) {
      setError("Please select a PDF file and provide a job description.");
      return;
    }

    setLoading(true);
    setError('');

    // Prepare data to send to secure Flask backend
    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_description', jobDescription);

    try {
      // FIX: Replace 'fetch' with 'authenticatedFetch'
      // This automatically adds the token and base URL
      const response = await authenticatedFetch('/analyze-resume', {
        method: 'POST',
        body: formData 
        // No 'Content-Type' needed, authenticatedFetch handles it
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'No detailed error message from backend.' }));
        console.error('Backend API Error (Status:', response.status, '):', errorData);
        throw new Error(`Analysis failed. Status: ${response.status}. ${errorData.error || errorData.message}`);
      }

      const data = await response.json();
      
      if (data && (data.score !== undefined || data.Score !== undefined)) { // Accept score or Score
        setResult(data);
      } else {
        throw new Error("Backend returned an invalid analysis structure.");
      }

    } catch (err) {
      console.error('Final Analysis Error:', err);
      setError(err.message || "Failed to connect to the backend server (Is the server running?).");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateResume = async () => {
    if (!resumeDetails.name || !selectedTemplate) {
        setError("Please enter your name and select a template to generate the resume.");
        return;
    }
    setLoading(true);
    setError('');

    // Resume generation logic (HTML output for client-side download)
    const templateHTML = {
      'modern': (details) => `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${details.name} Resume (Modern)</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; color: #333; line-height: 1.6; }
            .resume-container { width: 21cm; min-height: 29.7cm; margin: 2cm auto; background: #fff; box-shadow: 0 0 15px rgba(0,0,0,0.1); display: flex; flex-direction: column; }
            .header { background-color: #4A90E2; color: #fff; padding: 2rem; text-align: center; }
            .header h1 { margin: 0; font-size: 2.5em; font-weight: 700; }
            .header p { margin: 0.5rem 0 0; font-size: 1em; }
            .contact-info { margin-top: 1rem; font-size: 0.9em; }
            .contact-info a { color: #fff; text-decoration: none; margin: 0 0.5rem; }
            .main-content { padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
            .section { margin-bottom: 1.5rem; }
            .section h2 { color: #4A90E2; border-bottom: 2px solid #4A90E2; padding-bottom: 0.5rem; margin-bottom: 1rem; font-size: 1.5em; font-weight: 600; }
            .section-item { margin-bottom: 1rem; }
            .section-item h3 { margin: 0 0 0.2rem; font-size: 1.2em; font-weight: 600; }
            .section-item p { margin: 0; font-size: 0.95em; }
            .section-item ul { list-style: disc; padding-left: 1.5rem; margin-top: 0.5rem; }
            .section-item li { margin-bottom: 0.2rem; }
            .skills-list { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; }
            .skills-list span { background-color: #e0f2fe; color: #4A90E2; padding: 0.3em 0.7em; border-radius: 5px; font-size: 0.9em; }
            @media print {
              body { background: none; }
              .resume-container { box-shadow: none; margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="resume-container">
            <div class="header">
              <h1>${details.name || 'Your Name'}</h1>
              <div class="contact-info">
                ${details.email ? `<span>${details.email}</span>` : ''}
                ${details.phone ? `<span>| ${details.phone}</span>` : ''}
                ${details.linkedin ? `<span>| <a href="${details.linkedin}" target="_blank">LinkedIn</a></span>` : ''}
                ${details.github ? `<span>| <a href="${details.github}" target="_blank">GitHub</a></span>` : ''}
              </div>
            </div>
            <div class="main-content">
              ${details.summary ? `
              <div class="section">
                <h2>Summary</h2>
                <p>${details.summary}</p>
              </div>` : ''}

              ${details.experience.filter(exp => exp.role).length > 0 ? `
              <div class="section">
                <h2>Experience</h2>
                ${details.experience.map(exp => exp.role ? `
                <div class="section-item">
                  <h3>${exp.role} ${exp.company ? `at ${exp.company}` : ''}</h3>
                  <p>${exp.duration}</p>
                  ${exp.description ? `<ul>${exp.description.split('\n').map(line => line.trim() ? `<li>${line.trim()}</li>` : '').join('')}</ul>` : ''}
                </div>` : '').join('')}
              </div>` : ''}

              ${details.education.filter(edu => edu.degree).length > 0 ? `
              <div class="section">
                <h2>Education</h2>
                ${details.education.map(edu => edu.degree ? `
                <div class="section-item">
                  <h3>${edu.degree}</h3>
                  <p>${edu.university} ${edu.year ? `(${edu.year})` : ''}</p>
                </div>` : '').join('')}
              </div>` : ''}

              ${details.skills ? `
              <div class="section">
                <h2>Skills</h2>
                <div class="skills-list">
                  ${details.skills.split(',').map(skill => skill.trim() ? `<span>${skill.trim()}</span>` : '').join('')}
                </div>
              </div>` : ''}

              ${details.projects.filter(proj => proj.title).length > 0 ? `
              <div class="section">
                <h2>Projects</h2>
                ${details.projects.map(proj => proj.title ? `
                <div class="section-item">
                  <h3>${proj.title}</h3>
                  ${proj.description ? `<ul>${proj.description.split('\n').map(line => line.trim() ? `<li>${line.trim()}</li>` : '').join('')}</ul>` : ''}
                </div>` : '').join('')}
              </div>` : ''}

            </div>
          </div>
        </body>
        </html>
      `,
      'professional': (details) => `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${details.name} Resume (Professional)</title>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Roboto', sans-serif; margin: 0; padding: 0; background-color: #f0f2f5; color: #222; line-height: 1.5; }
            .resume-container { width: 21cm; min-height: 29.7cm; margin: 2cm auto; background: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1); display: flex; }
            .sidebar { width: 30%; background-color: #2c3e50; color: #fff; padding: 2rem; }
            .sidebar h2 { color: #f39c12; font-size: 1.3em; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 0.5rem; margin-top: 1.5rem; margin-bottom: 1rem; }
            .sidebar h3 { color: #f39c12; font-size: 1em; margin-bottom: 0.5rem; }
            .sidebar p, .sidebar ul { font-size: 0.9em; margin: 0.5rem 0; padding: 0; list-style: none; }
            .sidebar a { color: #fff; text-decoration: none; display: block; margin-bottom: 0.3rem; }
            .sidebar .contact-item { display: flex; align-items: center; margin-bottom: 0.5rem; }
            .sidebar .contact-item svg { fill: #f39c12; margin-right: 0.5rem; width: 1em; height: 1em; }
            .main-content { width: 70%; padding: 2rem; }
            .main-content h1 { font-size: 2.2em; margin-top: 0; margin-bottom: 0.5rem; color: #2c3e50; }
            .main-content .job-title { color: #7f8c8d; font-size: 1.1em; margin-bottom: 1.5rem; }
            .section { margin-bottom: 1.5rem; }
            .section h2 { color: #2c3e50; border-bottom: 2px solid #2c3e50; padding-bottom: 0.5rem; margin-bottom: 1rem; font-size: 1.6em; font-weight: 500; }
            .section-item { margin-bottom: 1.2rem; }
            .section-item h3 { margin: 0 0 0.2rem; font-size: 1.1em; font-weight: 500; }
            .section-item .sub-info { font-size: 0.9em; color: #7f8c8d; margin-bottom: 0.5rem; }
            .section-item ul { list-style: disc; padding-left: 1.5rem; margin-top: 0.5rem; }
            .section-item li { margin-bottom: 0.2rem; }
            .skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin-top: 0.5rem; }
            @media print {
              body { background: none; }
              .resume-container { box-shadow: none; margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="resume-container">
            <div class="sidebar">
              <h2 style="text-align: center;">Contact</h2>
              ${details.phone ? `<p class="contact-item">📞 ${details.phone}</p>` : ''}
              ${details.email ? `<p class="contact-item">📧 ${details.email}</p>` : ''}
              ${details.linkedin ? `<p class="contact-item">🔗 <a href="${details.linkedin}" target="_blank">LinkedIn</a></p>` : ''}
              ${details.github ? `<p class="contact-item">🐙 <a href="${details.github}" target="_blank">GitHub</a></p>` : ''}
              
              ${details.skills ? `
              <h2>Skills</h2>
              <div class="skills-grid">
                ${details.skills.split(',').map(skill => skill.trim() ? `<p>• ${skill.trim()}</p>` : '').join('')}
              </div>` : ''}
            </div>
            <div class="main-content">
              <h1>${details.name || 'Your Name'}</h1>
              <p class="job-title">Software Engineer | Data Scientist | Project Manager</p> 
              ${details.summary ? `
              <div class="section">
                <h2>Profile</h2>
                <p>${details.summary}</p>
              </div>` : ''}

              ${details.experience.filter(exp => exp.role).length > 0 ? `
              <div class="section">
                <h2>Experience</h2>
                ${details.experience.map(exp => exp.role ? `
                <div class="section-item">
                  <h3>${exp.role}</h3>
                  <p class="sub-info">${exp.company} | ${exp.duration}</p>
                  ${exp.description ? `<ul>${exp.description.split('\n').map(line => line.trim() ? `<li>${line.trim()}</li>` : '').join('')}</ul>` : ''}
                </div>` : '').join('')}
              </div>` : ''}

              ${details.education.filter(edu => edu.degree).length > 0 ? `
              <div class="section">
                <h2>Education</h2>
                ${details.education.map(edu => edu.degree ? `
                <div class="section-item">
                  <h3>${edu.degree}</h3>
                  <p class="sub-info">${edu.university} | ${edu.year}</p>
                </div>` : '').join('')}
              </div>` : ''}

              ${details.projects.filter(proj => proj.title).length > 0 ? `
              <div class="section">
                <h2>Projects</h2>
                ${details.projects.map(proj => proj.title ? `
                <div class="section-item">
                  <h3>${proj.title}</h3>
                  ${proj.description ? `<ul>${proj.description.split('\n').map(line => line.trim() ? `<li>${line.trim()}</li>` : '').join('')}</ul>` : ''}
                </div>` : '').join('')}
              </div>` : ''}

            </div>
          </div>
        </body>
        </html>
      `,
      'creative': (details) => `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${details.name} Resume (Creative)</title>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Open Sans', sans-serif; margin: 0; padding: 0; background-color: #fce4ec; color: #444; line-height: 1.6; }
            .resume-container { width: 21cm; min-height: 29.7cm; margin: 2cm auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.15); }
            .header { background-color: #e91e63; color: #fff; padding: 2.5rem; text-align: center; }
            .header h1 { margin: 0; font-family: 'Montserrat', sans-serif; font-size: 3em; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
            .header p { margin: 0.5rem 0 0; font-size: 1.1em; font-weight: 500; }
            .contact-info { margin-top: 1.5rem; font-size: 1em; display: flex; justify-content: center; flex-wrap: wrap; gap: 1rem; }
            .contact-info a { color: #fff; text-decoration: none; display: flex; align-items: center; }
            .contact-info a svg { fill: #fff; margin-right: 0.5rem; width: 1.1em; height: 1.1em; }
            .main-content { padding: 2rem 3rem; display: flex; flex-direction: column; gap: 2rem; }
            .section { margin-bottom: 1rem; }
            .section h2 { color: #e91e63; font-family: 'Montserrat', sans-serif; font-size: 1.8em; font-weight: 600; border-bottom: 2px solid #e91e63; padding-bottom: 0.5rem; margin-bottom: 1.2rem; }
            .section-item { margin-bottom: 1.2rem; }
            .section-item h3 { margin: 0 0 0.2rem; font-family: 'Montserrat', sans-serif; font-size: 1.3em; font-weight: 600; color: #333; }
            .section-item .sub-info { font-size: 0.95em; color: #777; margin-bottom: 0.5rem; }
            .section-item ul { list-style: circle; padding-left: 1.8rem; margin-top: 0.5rem; }
            .section-item li { margin-bottom: 0.3rem; }
            .skills-tags { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 0.5rem; }
            .skills-tags span { background-color: #f8bbd0; color: #e91e63; padding: 0.4em 0.8em; border-radius: 20px; font-size: 0.9em; font-weight: 500; }
            @media print {
              body { background: none; }
              .resume-container { box-shadow: none; margin: 0; border-radius: 0; }
            }
          </style>
        </head>
        <body>
          <div class="resume-container">
            <div class="header">
              <h1>${details.name || 'Your Name'}</h1>
              <p>Passionate & Innovative Professional</p>
              <div class="contact-info">
                ${details.email ? `<a href="mailto:${details.email}" target="_blank">✉️ ${details.email}</a>` : ''}
                ${details.phone ? `<a href="tel:${details.phone}">📞 ${details.phone}</a>` : ''}
                ${details.linkedin ? `<a href="${details.linkedin}" target="_blank">🔗 LinkedIn</a>` : ''}
                ${details.github ? `<a href="${details.github}" target="_blank">🐙 GitHub</a>` : ''}
              </div>
            </div>
            <div class="main-content">
              ${details.summary ? `
              <div class="section">
                <h2>Profile</h2>
                <p>${details.summary}</p>
              </div>` : ''}

              ${details.experience.filter(exp => exp.role).length > 0 ? `
              <div class="section">
                <h2>Experience</h2>
                ${details.experience.map(exp => exp.role ? `
                <div class="section-item">
                  <h3>${exp.role}</h3>
                  <p class="sub-info">${exp.company} | ${exp.duration}</p>
                  ${exp.description ? `<ul>${exp.description.split('\n').map(line => line.trim() ? `<li>${line.trim()}</li>` : '').join('')}</ul>` : ''}
                </div>` : '').join('')}
              </div>` : ''}

              ${details.education.filter(edu => edu.degree).length > 0 ? `
              <div class="section">
                <h2>Education</h2>
                ${details.education.map(edu => edu.degree ? `
                <div class="section-item">
                  <h3>${edu.degree}</h3>
                  <p class="sub-info">${edu.university} | ${edu.year}</p>
                </div>` : '').join('')}
              </div>` : ''}

              ${details.skills ? `
              <div class="section">
                <h2>Skills</h2>
                <div class="skills-tags">
                  ${details.skills.split(',').map(skill => skill.trim() ? `<span>${skill.trim()}</span>` : '').join('')}
                </div>
              </div>` : ''}

              ${details.projects.filter(proj => proj.title).length > 0 ? `
              <div class="section">
                <h2>Projects</h2>
                ${details.projects.map(proj => proj.title ? `
                <div class="section-item">
                  <h3>${proj.title}</h3>
                  ${proj.description ? `<ul>${proj.description.split('\n').map(line => line.trim() ? `<li>${line.trim()}</li>` : '').join('')}</ul>` : ''}
                </div>` : '').join('')}
              </div>` : ''}

            </div>
          </div>
        </body>
        </html>
      `
    };

    const finalResumeHtml = templateHTML[selectedTemplate](resumeDetails);
    
    // Download as HTML file (can be printed to PDF from browser)
    const blob = new Blob([finalResumeHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resumeDetails.name || 'resume'}-${selectedTemplate}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setLoading(false);
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setResumeDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExport = (type) => {
    if (result) {
      // NOTE: This will require a new Flask endpoint, e.g., /api/export-analysis?type=pdf
      const message = type === 'pdf' ? "Calling backend for PDF export..." : "Calling backend for Excel export...";
      setError(message);
      setTimeout(() => setError(''), 3000);
    } else {
      setError("Please analyze a resume before exporting.");
    }
  };
  
  // Handlers for dynamic array fields (Experience/Education)
  const addExperience = () => setResumeDetails(prev => ({ ...prev, experience: [...prev.experience, { company: '', role: '', duration: '', description: '' }] }));
  const updateExperience = (index, field, value) => {
    const updated = [...resumeDetails.experience];
    updated[index][field] = value;
    setResumeDetails(prev => ({ ...prev, experience: updated }));
  };
  const removeExperience = (index) => setResumeDetails(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }));

  const addEducation = () => setResumeDetails(prev => ({ ...prev, education: [...prev.education, { university: '', degree: '', year: '' }] }));
  const updateEducation = (index, field, value) => {
    const updated = [...resumeDetails.education];
    updated[index][field] = value;
    setResumeDetails(prev => ({ ...prev, education: updated }));
  };
  const removeEducation = (index) => setResumeDetails(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }));

  const addProject = () => setResumeDetails(prev => ({ ...prev, projects: [...prev.projects, { title: '', description: '' }] }));
  const updateProject = (index, field, value) => {
    const updated = [...resumeDetails.projects];
    updated[index][field] = value;
    setResumeDetails(prev => ({ ...prev, projects: updated }));
  };
  const removeProject = (index) => setResumeDetails(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== index) }));


  return (
    <>
      {/* The link to the external CSS file is handled by the import statement at the top */}

      <div className="resume-page-container">
        <div className="hero-section">
          <h1>Resume Analyzer & Builder 🚀</h1>
          <p>Get instant, **AI-driven feedback** on your resume and generate a new one using our professional templates. Your data stays safe—the Gemini API key is securely managed on our backend.</p>
        </div>
        
        <div className="analyzer-container">
          <h2>📄 Analyze Your Resume</h2>
          
          <div className="row">
            {/* Left Column: File Upload */}
            <div className="col-md-6 d-flex flex-column align-items-center">
              <div className="file-input-wrapper">
                <label htmlFor="file-upload" className="file-input-area">
                  <input
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                    accept="application/pdf"
                  />
                  <span className="file-icon">📄</span>
                  <p className="file-label-text">
                    {file ? <strong>File ready: {file.name}</strong> : "Drag & drop a PDF file or click to browse"}
                  </p>
                </label>
              </div>
            </div>

            {/* Right Column: Job Description */}
            <div className="col-md-6">
              <div className="form-group" style={{ height: '100%' }}>
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  id="job-description"
                  className="job-description-textarea"
                  rows="8"
                  placeholder="Paste the job description here for a tailored, keyword-based analysis."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button
              onClick={handleAnalyze}
              className="action-button"
              disabled={loading || !file || !jobDescription}
            >
              {loading ? 'Analyzing...' : 'Analyze Resume'}
            </button>
            {loading && <div className="message info">Analyzing your resume...</div>}
            {error && <div className="message error">**Error:** {error}</div>}
          </div>


          {result && (
            <div className="result-card">
              <h4 style={{ color: '#1e40af' }}>
                <span>✨</span> Analysis Report
              </h4>
              <hr className="hr-styled" />
              
              <p className="score-display">
                Score: {result.score || result.Score}/100 
              </p>
              
              <p>
                <strong>Summary:</strong> {result.summary || 'A concise summary of your profile will appear here.'}
              </p>

              <h5>Strengths (Good Points):</h5>
              <ul>
                {result.strengths && result.strengths.map((item, i) => (
                  <li key={i} className="good-point">
                    {item}
                  </li>
                ))}
              </ul>

              <h5>Weaknesses & Suggestions:</h5>
              <ul>
                {result.weaknesses && result.weaknesses.map((item, i) => (
                  <li key={i} className="suggestion">
                    {item}
                  </li>
                ))}
                {result.suggestions && result.suggestions.map((item, i) => (
                  <li key={'sugg'+i} className="suggestion">
                    {item}
                  </li>
                ))}
              </ul>

              <div className="download-buttons">
                <button className="download-button pdf" onClick={() => handleExport('pdf')}>
                  ⬇️ Export Analysis (PDF)
                </button>
                <button className="download-button excel" onClick={() => handleExport('excel')}>
                  ⬇️ Export Analysis (Excel)
                </button>
              </div>
            </div>
          )}
        </div>

{/* --- Generator --- */}

        <div className="generator-container">
          <h2>✍️ Auto-Generate a Resume</h2>
          <p className="text-center-secondary">Choose a template and fill in your details to get a personalized resume. (Resume downloads as HTML file, ready to print to PDF).</p>
          
          <div className="template-grid">
            {templates.map(template => (
              <div 
                key={template.id} 
                className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <img src={template.image} alt={`${template.name} template`} />
                <p>{template.name}</p>
              </div>
            ))}
          </div>

          <div className="form-sections">
            
              <h5 className="form-section-title">Personal Details</h5>
            <div className="row">
                <div className="col-md-6 form-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" name="name" value={resumeDetails.name} onChange={handleDetailsChange} placeholder="John Doe" />
                </div>
                <div className="col-md-6 form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" value={resumeDetails.email} onChange={handleDetailsChange} placeholder="john.doe@example.com" />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 form-group">
                  <label htmlFor="phone">Phone</label>
                  <input type="text" id="phone" name="phone" value={resumeDetails.phone} onChange={handleDetailsChange} placeholder="(123) 456-7890" />
                </div>
                <div className="col-md-6 form-group">
                  <label htmlFor="linkedin">LinkedIn Profile URL</label>
                  <input type="text" id="linkedin" name="linkedin" value={resumeDetails.linkedin} onChange={handleDetailsChange} placeholder="https://linkedin.com/in/johndoe" />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 form-group">
                  <label htmlFor="github">GitHub Profile URL</label>
                  <input type="text" id="github" name="github" value={resumeDetails.github} onChange={handleDetailsChange} placeholder="https://github.com/johndoe" />
                </div>
                <div className="col-md-6 form-group">
                  <label htmlFor="skills">Key Skills (Comma Separated)</label>
                  <input type="text" id="skills" name="skills" value={resumeDetails.skills} onChange={handleDetailsChange} placeholder="JavaScript, React, Python, AWS" />
                </div>
              </div>
            
            <div className="form-group">
              <label htmlFor="summary">Professional Summary</label>
              <textarea id="summary" name="summary" value={resumeDetails.summary} onChange={handleDetailsChange} placeholder="A concise statement of your skills and goals." rows="4"></textarea>
            </div>

            {/* Experience Section */}
            <h5 className="form-section-title">Work Experience</h5>
            {resumeDetails.experience.map((exp, index) => (
              <div key={index} className="form-group array-item">
                <button type="button" className="remove-btn" onClick={() => removeExperience(index)}>✕</button>
                <h6>Job/Internship {index + 1}</h6>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <input type="text" value={exp.role} onChange={(e) => updateExperience(index, 'role', e.target.value)} placeholder="Role (e.g., Senior Developer)" />
                  </div>
                  <div className="col-md-6 form-group">
                    <input type="text" value={exp.company} onChange={(e) => updateExperience(index, 'company', e.target.value)} placeholder="Company Name" />
                  </div>
                </div>
                <div className="form-group">
                    <input type="text" value={exp.duration} onChange={(e) => updateExperience(index, 'duration', e.target.value)} placeholder="Duration (e.g., 6 months, 2020 - Present)" />
                </div>
                <div className="form-group">
                    <textarea value={exp.description} onChange={(e) => updateExperience(index, 'description', e.target.value)} placeholder="Job Description / Key Achievements (Use bullet points for clarity)" rows="3"></textarea>
                </div>
              </div>
            ))}
            <button type="button" className="add-array-btn" onClick={addExperience}>+ Add Experience</button>

            {/* Education Section */}
            <h5 className="form-section-title">Education</h5>
            {resumeDetails.education.map((edu, index) => (
              <div key={index} className="form-group array-item">
                <button type="button" className="remove-btn" onClick={() => removeEducation(index)}>✕</button>
                <h6>Degree {index + 1}</h6>
                <div className="row">
                    <div className="col-md-6 form-group">
                        <input type="text" value={edu.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} placeholder="Degree (e.g., B.Tech CSE)" />
                    </div>
                    <div className="col-md-6 form-group">
                        <input type="text" value={edu.university} onChange={(e) => updateEducation(index, 'university', e.target.value)} placeholder="University/College Name" />
                    </div>
                </div>
                <div className="form-group">
                    <input type="text" value={edu.year} onChange={(e) => updateEducation(index, 'year', e.target.value)} placeholder="Completion Year / Expected" />
                </div>
              </div>
            ))}
            <button type="button" className="add-array-btn" onClick={addEducation}>+ Add Education</button>

            {/* Projects Section (New) */}
            <h5 className="form-section-title">Projects</h5>
            {resumeDetails.projects.map((proj, index) => (
              <div key={index} className="form-group array-item">
                <button type="button" className="remove-btn" onClick={() => removeProject(index)}>✕</button>
                <h6>Project {index + 1}</h6>
                <div className="form-group">
                  <input type="text" value={proj.title} onChange={(e) => updateProject(index, 'title', e.target.value)} placeholder="Project Title" />
                </div>
                <div className="form-group">
                  <textarea value={proj.description} onChange={(e) => updateProject(index, 'description', e.target.value)} placeholder="Project description and technologies used (Use bullet points for clarity)" rows="3"></textarea>
                </div>
              </div>
            ))}
            <button type="button" className="add-array-btn" onClick={addProject}>+ Add Project</button>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
            <button
              onClick={handleGenerateResume}
              className="action-button"
              disabled={loading}
            >
              Generate & Download Resume
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeAnalyzer;

