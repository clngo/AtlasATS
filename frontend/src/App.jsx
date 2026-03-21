import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { fetchCurrentUser, loginUser, registerUser } from "./api/auth.js";
import AppLayout from "./components/AppLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import BillboardPage from "./pages/BillboardPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import FeedbackPage from "./pages/FeedbackPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import UploadPage from "./pages/UploadPage.jsx";

const SESSION_STORAGE_KEY = "atlas-auth-token";

export default function App() {
  const [theme, setTheme] = useState("light");
  const [token, setToken] = useState(() => sessionStorage.getItem(SESSION_STORAGE_KEY) || "");
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(Boolean(sessionStorage.getItem(SESSION_STORAGE_KEY)));

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setIsCheckingAuth(false);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return;
    }

    sessionStorage.setItem(SESSION_STORAGE_KEY, token);
    setIsCheckingAuth(true);

    fetchCurrentUser(token)
      .then((payload) => {
        setUser(payload.user);
      })
      .catch(() => {
        setToken("");
        setUser(null);
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      })
      .finally(() => {
        setIsCheckingAuth(false);
      });
  }, [token]);

  const isAuthenticated = Boolean(token && user);

  function toggleTheme() {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }

  function storeAuth(payload) {
    setToken(payload.token);
    setUser(payload.user);
  }

  async function handleRegister(credentials) {
    const payload = await registerUser(credentials);
    storeAuth(payload);
  }

  async function handleLogin(credentials) {
    const payload = await loginUser(credentials);
    storeAuth(payload);
  }

  function handleLogout() {
    setToken("");
    setUser(null);
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppLayout
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
            theme={theme}
            onToggleTheme={toggleTheme}
            user={user}
          />
        }
      >
        <Route index element={<HomePage isAuthenticated={isAuthenticated} />} />
        <Route
          path="login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />
          }
        />
        <Route
          path="register"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage onRegister={handleRegister} />
          }
        />
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} isCheckingAuth={isCheckingAuth} />}>
          <Route path="dashboard" element={<DashboardPage token={token} user={user} />} />
          <Route path="upload" element={<UploadPage token={token} />} />
          <Route path="feedback" element={<FeedbackPage token={token} />} />
          <Route path="feedback/:resumeId" element={<FeedbackPage token={token} />} />
        </Route>
        <Route path="billboard" element={<BillboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
