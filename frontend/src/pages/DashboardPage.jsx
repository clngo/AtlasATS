import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchUserResumes } from "../api/resumes.js";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function DashboardPage({ token, user }) {
  const [query, setQuery] = useState("");
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setError("");

    fetchUserResumes(token)
      .then((payload) => {
        setResumes(payload.resumes);
      })
      .catch((requestError) => {
        setError(requestError.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token]);

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
          <h1>Welcome back, {user?.name || "Jamie Tran"}.</h1>
          <p>
            Your saved resume scans live on the server now. Search by name, review scores,
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
        {isLoading ? <div className="card status-card">Loading saved resumes...</div> : null}
        {error ? <div className="card status-card error-card">{error}</div> : null}
        {!isLoading && !error ? (
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
                    <td>{formatDate(resume.createdAt)}</td>
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
        ) : null}
      </section>
    </div>
  );
}
