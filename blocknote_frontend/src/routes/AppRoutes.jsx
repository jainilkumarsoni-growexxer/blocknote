
import { Routes, Route } from 'react-router-dom';

// Public pages
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ShareViewPage } from '../pages/ShareViewPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Protected pages
import { DashboardPage } from '../pages/DashboardPage';
import { DocumentEditorPage } from '../pages/DocumentEditorPage';

// Auth guard
import { RequireAuth } from '../components/auth/RequireAuth';


export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes (no authentication required) */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route>
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="/documents/:id"
          element={
            <RequireAuth>
              <DocumentEditorPage />
            </RequireAuth>
          }
        /> 
      </Route>

      <Route path="/share/:token" element={<ShareViewPage />} />
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  );
};