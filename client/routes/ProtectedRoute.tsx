import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  role?: "user" | "provider" | "admin";
}

export default function ProtectedRoute({
  children,
  role,
}: ProtectedRouteProps) {
  const location = useLocation();
  const token = localStorage.getItem("authToken");
  const storedRole = localStorage.getItem("userRole");
 console.log("ProtectedRoute: token =", token, "storedRole =", storedRole, "required role =", role);
  // ❌ No token → redirect to login
  if (!token) {
    return <Navigate to="/login-user" state={{ from: location }} replace />;
  }

  // ❌ Role mismatch → redirect home
  if (role && storedRole !== role) {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return children;
}
