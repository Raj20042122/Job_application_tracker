import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";

import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

function App() {
  const token = localStorage.getItem("token");
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: darkMode ? '!bg-[#1e293b] !text-[#f1f5f9] !border !border-[#334155]' : '',
        }}
      />
      
      {token ? (
        <div className={`min-h-screen font-sans flex flex-col ${darkMode ? 'bg-[#0f172a] text-[#f1f5f9]' : 'bg-gray-50 text-gray-900'}`}>
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          <div className="flex-1 flex flex-col transition-all">
            <main className="flex-1 p-4 md:p-6 w-full max-w-[1600px] mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/analyzer" element={<ResumeAnalyzer />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <div className={`min-h-screen font-sans ${darkMode ? 'bg-[#0f172a] text-[#f1f5f9]' : 'bg-gray-50 text-gray-900'}`}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
