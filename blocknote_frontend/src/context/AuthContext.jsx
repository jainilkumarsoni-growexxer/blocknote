// import { createContext, useContext, useEffect, useState } from "react";
// import { getToken, logout as clearTokens } from "../services/authService";
// import api from "../services/api";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // On app load, check if a token exists and fetch current user
//   useEffect(() => {
//     const token = getToken();
//     if (!token) {
//       setLoading(false);
//       return;
//     }
//     api
//       .get("/auth/me")
//       .then((res) => setUser(res.data.user))
//       .catch(() => {
//         clearTokens();
//         setUser(null);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   function login(userData) {
//     setUser(userData);
//   }

//   function logout() {
//     clearTokens();
//     setUser(null);
//   }

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
//   return ctx;
// }