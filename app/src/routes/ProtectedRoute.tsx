import { Navigate, Outlet } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { LoadingIndicator } from "@/components/LoadingIndicator";

interface ProtectedRouteProps {
  children?: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token, loading, user } = useAuth();

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const currentPath = window.location.pathname;

  if (currentPath.startsWith("/cmh") && user?.role !== "Doctor") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children ?? <Outlet />}</>;
}
