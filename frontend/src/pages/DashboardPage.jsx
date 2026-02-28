import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

export default function DashboardPage({ resumes }) {
  const [query, setQuery] = useState('');

  const filteredResumes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return resumes;
    }
    return resumes.filter((resume) => resume.name.toLowerCase().includes(normalized));
  }, [resumes, query]);

  return (
    <div className="container">
      <section className="hero">
        <div className="hero-card">
          <h1>Welcome back, Jamie Tran.</h1>
          <p>
            Your latest resume scans are saved below. Search by name, review scores,
            and open detailed feedback.
          </p>
          <div className="flex">
            <Link className="btn btn-primary" to="/upload">Start New Upload</Link>
          </div>
        </div>
        <aside className="card">
          <form className="form" aria-label="Search saved resumes" onSubmit={(event) => event.preventDefault()}>
            <div>
              <label htmlFor="search-name">Search by resume name</label>
              <input
                id="search-name"
                name="search-name"
                type="search"
                placeholder="e.g., UX Designer Resume"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <button className="btn btn-outline" type="submit">Search</button>
          </form>
        </aside>
      </section>

      <section className="section">
        <h2>Saved Resumes</h2>
        <div className="table-wrap">
          <table className="table" aria-label="Saved resume reviews">
            <thead>
              <tr>
                <th>Resume</th>
                <th>Target role</th>
                <th>Date</th>
                <th>ATS Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredResumes.map((resume) => (
                <tr key={resume.id}>
                  <td>{resume.name}</td>
                  <td>{resume.targetRole}</td>
                  <td>{resume.date}</td>
                  <td>{resume.score}</td>
                  <td>
                    <Link className="btn btn-outline" to={`/feedback/${resume.id}`}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredResumes.length === 0 ? (
                <tr>
                  <td colSpan="5">No resume matches that name.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
