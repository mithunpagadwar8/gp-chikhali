import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const AdminProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { loading, isAdmin } = useAuth();

  if (loading) return <div className="p-6">Checking admin access...</div>;

  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
};

export default AdminProtectedRoute;
