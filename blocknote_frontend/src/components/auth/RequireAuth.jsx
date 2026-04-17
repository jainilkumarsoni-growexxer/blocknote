// // src/components/auth/RequireAuth.jsx
// import { Navigate, useLocation } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import { Spinner } from '../ui';

// export const RequireAuth = ({ children }) => {
//   const { verifyAuth } = useAuth();
//   const [isChecking, setIsChecking] = useState(true);
//   const [isAllowed, setIsAllowed] = useState(false);
//   const location = useLocation();

//   useEffect(() => {
//     const check = async () => {
//       const authenticated = await verifyAuth();
//       setIsAllowed(authenticated);
//       setIsChecking(false);
//     };
//     check();
//   }, [verifyAuth]);

//   if (isChecking) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <Spinner className="h-8 w-8" />
//       </div>
//     );
//   }

//   if (!isAllowed) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return children;
// };















// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import { Spinner } from '../ui';

// export const RequireAuth = ({ children }) => {
//   const { isAuthenticated, isInitialized } = useAuth();
//   const location = useLocation();

//   // Wait until we know whether there's an active session flag
//   if (!isInitialized) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <Spinner className="h-8 w-8" />
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     // Redirect to login, but remember where they were trying to go
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return children;
// };










import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from '../ui';
import api from '../../services/api';

export const RequireAuth = ({ children }) => {
  const { isAuthenticated, login } = useAuth(); // login is not used directly here
  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Make a lightweight request to verify cookies are valid
        await api.get('/documents'); // any protected endpoint
        setIsAllowed(true);
      } catch (error) {
        setIsAllowed(false);
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, []);

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!isAllowed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};