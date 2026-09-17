import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080B11] flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
          <div className="absolute w-6 h-6 rounded-full bg-indigo-500/10 blur-sm"></div>
        </div>
        <p className="mt-4 text-xs font-medium text-slate-400 tracking-wider uppercase">Loading Workspace...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
