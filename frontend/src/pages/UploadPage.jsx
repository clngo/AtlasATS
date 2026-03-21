import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createResume } from "../api/resumes.js";
import { roleOptions } from "../data/mockData.js";

export default function UploadPage({ token }) {
  const [fileName, setFileName] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [targetRole, setTargetRole] = useState(roleOptions[0]);
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const derivedResumeName = resumeName.trim() || fileName?.replace(/\.[^/.]+$/, "") || `${targetRole} Resume`;

    try {
      const payload = await createResume(token, {
        name: derivedResumeName,
        targetRole,
        isPublic,
      });
      navigate(`/feedback/${payload.resume.id}`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container hero hero-center">
      <div className="hero-card">
        <h1>Upload your resume</h1>
        <p>
          Run a server-backed mock ATS scan to generate a score and save it to your account.
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
                const nextFileName = selected ? selected.name : "";
                setFileName(nextFileName);
                if (!resumeName.trim() && nextFileName) {
                  setResumeName(nextFileName.replace(/\.[^/.]+$/, ""));
                }
              }}
            />
          </div>
          <div>
            <label htmlFor="resume-name">Resume name</label>
            <input
              id="resume-name"
              name="resume-name"
              type="text"
              placeholder="e.g., Product Manager Resume"
              value={resumeName}
              onChange={(event) => setResumeName(event.target.value)}
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
              value={isPublic ? "public" : "private"}
              onChange={(event) => setIsPublic(event.target.value === "public")}
            >
              <option value="public">Public (show on billboard)</option>
              <option value="private">Private (dashboard only)</option>
            </select>
          </div>
          {error ? <p className="form-error">{error}</p> : null}
          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving Resume..." : "Run ATS Scan"}
          </button>
        </form>
      </div>
    </div>
  );
}
