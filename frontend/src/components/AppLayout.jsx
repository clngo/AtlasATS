import { NavLink, Outlet } from "react-router-dom";

function navClass({ isActive }) {
  return isActive ? "is-active" : "";
}

export default function AppLayout({ isAuthenticated, onLogout, theme, onToggleTheme, user }) {
  return (
    <div className="page">
      <header className="header">
        <div className="container nav">
          <div className="brand">
            <span>Atlas ATS</span>
            <small>Resume Readiness</small>
          </div>
          <nav className="nav-links" aria-label="Primary">
            <NavLink to="/" className={navClass} end>
              Home
            </NavLink>
            {isAuthenticated ? (
              <NavLink to="/dashboard" className={navClass}>
                Dashboard
              </NavLink>
            ) : null}
            {isAuthenticated ? (
              <NavLink to="/upload" className={navClass}>
                Upload
              </NavLink>
            ) : null}
            <NavLink to="/billboard" className={navClass}>
              Billboard
            </NavLink>
            {!isAuthenticated ? (
              <NavLink to="/login" className={navClass}>
                Log In
              </NavLink>
            ) : null}
            {!isAuthenticated ? (
              <NavLink to="/register" className={navClass}>
                Register
              </NavLink>
            ) : null}
          </nav>
          <div className="nav-actions">
            {isAuthenticated ? <span className="user-chip">{user?.name}</span> : null}
            {isAuthenticated ? (
              <button className="btn btn-outline" type="button" onClick={onLogout}>
                Log Out
              </button>
            ) : null}
            <button
              className="btn btn-outline theme-btn"
              type="button"
              aria-label="Toggle dark mode"
              aria-pressed={theme === "dark"}
              onClick={onToggleTheme}
            >
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">Atlas ATS React MVP</div>
      </footer>
    </div>
  );
}
