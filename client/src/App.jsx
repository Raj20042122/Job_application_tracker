import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";

function App() {
  const token = localStorage.getItem("token");

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: '!bg-[#1e293b] !text-[#f1f5f9] !border !border-[#334155]',
        }}
      />
      
      {token ? (
        <div className="min-h-screen bg-[#0f172a] text-[#f1f5f9] font-sans flex">
          <Sidebar />
          <div className="flex-1 md:pl-64 flex flex-col min-h-screen transition-all">
            <main className="flex-1 p-6 md:p-10 w-full max-w-[1600px] mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/analyzer" element={<ResumeAnalyzer />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-[#0f172a] text-[#f1f5f9] font-sans">
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
