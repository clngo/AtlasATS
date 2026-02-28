import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <>
      <div className="container hero">
        <div className="hero-card">
          <h1>Make your resume ATS-ready in minutes.</h1>
          <p>
            Atlas ATS scans your resume for immediate feedback. Get a clear score,
            keyword coverage, and formatting checks so you can apply with confidence.
          </p>
          <div className="flex">
            <Link className="btn btn-primary" to="/upload">Upload Resume</Link>
            <Link className="btn btn-outline" to="/dashboard">View Dashboard</Link>
          </div>
        </div>
        <div className="card">
          <h3>Applicant Tracking System</h3>
          <p>
            ATS software parses your resume and looks for job-specific keywords, clean
            structure, and readable formatting.
          </p>
          <ul>
            <li>Keyword coverage by role.</li>
            <li>Parsing accuracy for sections and contact data.</li>
            <li>Actionable fixes before you apply.</li>
          </ul>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <h2>How Atlas ATS works</h2>
          <div className="grid grid-3">
            <div className="card">
              <h3>1. Upload your resume</h3>
              <p>PDF or DOCX resumes are parsed for structure and keyword density.</p>
            </div>
            <div className="card">
              <h3>2. Get your ATS score</h3>
              <p>Receive a clear score and useful feedback categories.</p>
            </div>
            <div className="card">
              <h3>3. Improve instantly</h3>
              <p>Adjust wording and headings based on your feedback summary.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
