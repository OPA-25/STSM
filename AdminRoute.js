 import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");

  return role === "ADMIN"
    ? children
    : <Navigate to="/" />;
};

export default AdminRoute;
