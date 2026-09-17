import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Pages
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import CalendarPage from "./pages/Calendar";
import Analytics from "./pages/Analytics";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#10141E",
              color: "#F1F5F9",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "0.75rem",
              fontSize: "0.8125rem",
              boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.6)"
            }
          }}
        />

        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />

          {/* Protected Application Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="applications" element={<Applications />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="analyzer" element={<ResumeAnalyzer />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
