import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthStore } from "../store/AuthStore";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuthStore();
    if (isLoading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
