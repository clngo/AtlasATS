import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

export default function BillboardPage({ publicResumes }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return publicResumes;
    }
    return publicResumes.filter((resume) => {
      const haystack = `${resume.name} ${resume.targetRole} ${resume.sharedBy}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [publicResumes, query]);

  return (
    <div className="container">
      <section className="hero">
        <div className="hero-card">
          <h1>Public resume billboard</h1>
          <p>
            Browse opt-in high-scoring resumes to learn ATS-friendly formatting and
            language patterns.
          </p>
          <div className="flex">
            <Link className="btn btn-primary" to="/upload">Share My Resume</Link>
          </div>
        </div>
        <aside className="card">
          <form className="form" aria-label="Search public resumes" onSubmit={(event) => event.preventDefault()}>
            <div>
              <label htmlFor="search-public">Search by role or name</label>
              <input
                id="search-public"
                name="search-public"
                type="search"
                placeholder="e.g., Data Analyst"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <button className="btn btn-outline" type="submit">Search</button>
          </form>
        </aside>
      </section>

      <section className="section">
        <h2>Featured resumes</h2>
        <div className="table-wrap">
          <table className="table" aria-label="Featured public resumes">
            <thead>
              <tr>
                <th>Resume</th>
                <th>Target role</th>
                <th>ATS Score</th>
                <th>Shared by</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((resume) => (
                <tr key={resume.id}>
                  <td>{resume.name}</td>
                  <td>{resume.targetRole}</td>
                  <td>{resume.score}</td>
                  <td>{resume.sharedBy}</td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="4">No public resume matches your search.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
