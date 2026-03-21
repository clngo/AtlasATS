import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute({ isAuthenticated, isCheckingAuth }) {
  const location = useLocation();

  if (isCheckingAuth) {
    return (
      <div className="container">
        <section className="section">
          <div className="card">
            <h2>Checking session...</h2>
            <p>Validating your login before loading this page.</p>
          </div>
        </section>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
