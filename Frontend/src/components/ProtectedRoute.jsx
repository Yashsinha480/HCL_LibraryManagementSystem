import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const loginPath = roles?.includes("admin") ? "/login/admin" : "/login/student";
    return <Navigate to={loginPath} replace state={{ from: location.pathname }} />;
  }

  if (roles && !roles.includes(user?.role)) {
    const fallback = user?.role === "admin" ? "/admin" : "/student";
    return <Navigate to={fallback} replace />;
  }

  return children;
}

export default ProtectedRoute;
