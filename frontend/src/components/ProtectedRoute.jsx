import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="mx-auto max-w-6xl px-4 py-20 text-center text-slatewash">Loading...</div>;
  }

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
