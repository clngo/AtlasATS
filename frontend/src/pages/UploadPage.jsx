import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roleOptions } from '../data/mockData.js';

export default function UploadPage({ addResume }) {
  const [fileName, setFileName] = useState('');
  const [targetRole, setTargetRole] = useState(roleOptions[0]);
  const [isPublic, setIsPublic] = useState(true);
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    const createdId = addResume({ fileName, targetRole, isPublic });
    navigate(`/feedback/${createdId}`);
  }

  return (
    <div className="container hero hero-center">
      <div className="hero-card">
        <h1>Upload your resume</h1>
        <p>
          Run a mock ATS scan to generate score and feedback details. This data is
          stored in frontend state until you reload the page.
        </p>
        <form className="form" aria-label="Resume upload form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="resume-file">Resume file</label>
            <input
              id="resume-file"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(event) => {
                const selected = event.target.files?.[0];
                setFileName(selected ? selected.name : '');
              }}
            />
          </div>
          <div>
            <label htmlFor="role">Target role</label>
            <select
              id="role"
              name="role"
              value={targetRole}
              onChange={(event) => setTargetRole(event.target.value)}
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="public-share">Billboard visibility</label>
            <select
              id="public-share"
              name="public-share"
              value={isPublic ? 'public' : 'private'}
              onChange={(event) => setIsPublic(event.target.value === 'public')}
            >
              <option value="public">Public (show on billboard)</option>
              <option value="private">Private (dashboard only)</option>
            </select>
          </div>
          <button className="btn btn-primary" type="submit">Run ATS Scan</button>
        </form>
      </div>
    </div>
  );
}
