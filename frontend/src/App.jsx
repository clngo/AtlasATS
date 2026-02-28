import { useMemo, useState, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import UploadPage from './pages/UploadPage.jsx';
import BillboardPage from './pages/BillboardPage.jsx';
import FeedbackPage from './pages/FeedbackPage.jsx';
import { initialResumes } from './data/mockData.js';

function formatDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function scoreForRole(role) {
  const roleScore = {
    'UX Designer': 84,
    'Product Manager': 87,
    'Data Analyst': 90,
    'Marketing Manager': 78,
    'Product Analyst': 80,
  };
  return roleScore[role] ?? 75;
}

export default function App() {
  const [theme, setTheme] = useState('light');
  const [resumes, setResumes] = useState(initialResumes);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  const publicResumes = useMemo(() => resumes.filter((resume) => resume.isPublic), [resumes]);

  function toggleTheme() {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }

  function addResume({ fileName, targetRole, isPublic }) {
    const id = `r${Date.now()}`;
    const baseName = fileName?.replace(/\.[^/.]+$/, '') || `${targetRole} Resume`;
    const newResume = {
      id,
      name: baseName,
      targetRole,
      date: formatDate(new Date()),
      score: scoreForRole(targetRole),
      sharedBy: 'Jamie T.',
      isPublic,
    };

    setResumes((current) => [newResume, ...current]);
    return id;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<AppLayout theme={theme} onToggleTheme={toggleTheme} />}
      >
        <Route index element={<HomePage />} />
        <Route path="dashboard" element={<DashboardPage resumes={resumes} />} />
        <Route
          path="upload"
          element={<UploadPage addResume={addResume} />}
        />
        <Route
          path="billboard"
          element={<BillboardPage publicResumes={publicResumes} />}
        />
        <Route
          path="feedback"
          element={<FeedbackPage resumes={resumes} />}
        />
        <Route
          path="feedback/:resumeId"
          element={<FeedbackPage resumes={resumes} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
