import { Link, useParams } from 'react-router-dom';

function scoreLevel(score) {
  if (score >= 90) {
    return 'Excellent';
  }
  if (score >= 80) {
    return 'Strong';
  }
  if (score >= 70) {
    return 'Needs improvement';
  }
  return 'Low';
}

export default function FeedbackPage({ resumes }) {
  const { resumeId } = useParams();
  const resume = resumes.find((item) => item.id === resumeId);

  if (!resume) {
    return (
      <div className="container">
        <section className="section">
          <div className="card">
            <h2>No resume yet</h2>
            <p>You do not have a scanned resume to review yet.</p>
            <Link className="btn btn-primary" to="/upload">Upload Resume</Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="container">
      <section className="hero">
        <div className="hero-card">
          <h1>Feedback: {resume.name}</h1>
          <p>
            This page shows mock ATS feedback for the selected resume.
          </p>
          <div className="metrics">
            <div className="metric">
              <h3>ATS Score</h3>
              <p><strong>{resume.score} / 100</strong></p>
            </div>
            <div className="metric">
              <h3>Role Match</h3>
              <p><strong>{resume.targetRole}</strong></p>
            </div>
            <div className="metric">
              <h3>Status</h3>
              <p><strong>{scoreLevel(resume.score)}</strong></p>
            </div>
          </div>
        </div>
        <aside className="card">
          <h3>Suggested improvements</h3>
          <ul>
            <li>Add 2-3 role-specific keywords in experience bullets.</li>
            <li>Use measurable impact statements with percentages.</li>
            <li>Keep section headers simple for parser readability.</li>
          </ul>
          <Link className="btn btn-outline" to="/dashboard">Back to Dashboard</Link>
        </aside>
      </section>
    </div>
  );
}
