import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPublicResumes } from "../api/resumes.js";

export default function BillboardPage() {
  const [query, setQuery] = useState("");
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setError("");

    fetchPublicResumes()
      .then((payload) => {
        setResumes(payload.resumes);
      })
      .catch((requestError) => {
        setError(requestError.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return resumes;
    }
    return resumes.filter((resume) => {
      const haystack = `${resume.name} ${resume.targetRole} ${resume.sharedBy}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [resumes, query]);

  return (
    <div className="container">
      <section className="hero">
        <div className="hero-card">
          <h1>Public resume billboard</h1>
          <p>
            Browse opt-in high-scoring resumes stored on the server to learn ATS-friendly
            formatting and language patterns.
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
        {isLoading ? <div className="card status-card">Loading public resumes...</div> : null}
        {error ? <div className="card status-card error-card">{error}</div> : null}
        {!isLoading && !error ? (
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
        ) : null}
      </section>
    </div>
  );
}
