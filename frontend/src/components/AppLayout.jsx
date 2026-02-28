import { NavLink, Outlet } from 'react-router-dom';

function navClass({ isActive }) {
  return isActive ? 'is-active' : '';
}

export default function AppLayout({ theme, onToggleTheme }) {
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
            <NavLink to="/dashboard" className={navClass}>
              Dashboard
            </NavLink>
            <NavLink to="/upload" className={navClass}>
              Upload
            </NavLink>
            <NavLink to="/billboard" className={navClass}>
              Billboard
            </NavLink>
          </nav>
          <button
            className="btn btn-outline theme-btn"
            type="button"
            aria-label="Toggle dark mode"
            aria-pressed={theme === 'dark'}
            onClick={onToggleTheme}
          >
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
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
