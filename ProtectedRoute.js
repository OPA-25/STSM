// import React from "react";
// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children }) {
//   const token = localStorage.getItem("token");

//   // If no token → block access
//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   // If token exists → allow access
//   return children;
// }


// import React from "react";
// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children }) {
//   const token = localStorage.getItem("token");

//   // If no token → block access
//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   // If token exists → allow access
//   return children;
// }


import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }
 
  if (adminOnly && role !== "ADMIN") {
    return <Navigate to="/" replace />; // block non-admin users
  }

  return children;
}
