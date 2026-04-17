// import { Routes, Route, Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// // import LoginPage from "../pages/LoginPage";
// import HomePage from "../pages/HomePage";
// import RegisterPage from "../pages/RegisterPage";
// import LoginPage from "../pages/LoginPage";
// // import DashboardPage from "../pages/DashboardPage";
// // import DocumentEditorPage from "../pages/DocumentEditorPage";
// // import ShareViewPage from "../pages/ShareViewPage";
// // import NotFoundPage from "../pages/NotFoundPage";

// // Wrapper: redirect to /dashboard if already logged in
// function GuestRoute({ children }) {
//   const { user, loading } = useAuth();
//   if (loading) return <PageLoader />;
//   if (user) return <Navigate to="/dashboard" replace />;
//   return children;
// }

// // Wrapper: redirect to /login if not logged in
// function ProtectedRoute({ children }) {
//   const { user, loading } = useAuth();
//   if (loading) return <PageLoader />;
//   if (!user) return <Navigate to="/login" replace />;
//   return children;
// }

// function PageLoader() {
//   return (
//     <div style={{
//       minHeight: "100vh",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       background: "#f5f5f3",
//     }}>
//       <div style={{
//         width: "20px",
//         height: "20px",
//         border: "2px solid #d3d1c7",
//         borderTopColor: "#2c2c2a",
//         borderRadius: "50%",
//         animation: "spin 0.7s linear infinite",
//       }} />
//       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//     </div>
//   );
// }

// export default function AppRoutes() {
//   return (
//     <Routes>
//       {/* Root → redirect to dashboard */}
//       {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
//       <Route path="/" element={<HomePage />} />

//       {/* Guest only — logged-in users bounce to dashboard */}
//       <Route
//         path="/login"
//         element={
//           <GuestRoute>
//             <LoginPage />
//           </GuestRoute>
//         }
//       />
      

//       {/* Protected — must be logged in 
//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute>
//             <DashboardPage />
//           </ProtectedRoute>
//         }
//       />*/}
//       {/*
//       <Route
//         path="/document/:id"
//         element={
//           <ProtectedRoute>
//             <DocumentEditorPage />
//           </ProtectedRoute>
//         }
//       />*/}

//       {/* Public — no auth needed */}
//       {/*<Route path="/share/:token" element={<ShareViewPage />} />*/}

//       {/* 404 */}
//       {/*<Route path="*" element={<NotFoundPage />} />*/}

//       <Route
//         path="/register"
//         element={
//           <GuestRoute>
//             <RegisterPage />
//           </GuestRoute>
//         }
//       />
//     </Routes>
//   );
// }




















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

// Layout (includes navbar, background, etc.)
// import { AppLayout } from '../components/layout/AppLayout';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes (no authentication required) */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* <Route path="/share/:token" element={<ShareViewPage />} /> */}

      {/* Protected routes (authentication required, wrapped in layout) */}
      {/* <Route element={<AppLayout />}> */}
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

      {/* 404 fallback */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
};