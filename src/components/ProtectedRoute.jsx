import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <p style={{ padding: "2rem", textAlign: "center" }}>Loading...</p>;
  if (!user) return <Navigate to={adminOnly ? "/admin/login" : "/login"} replace state={{ from: location.pathname }} />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}
