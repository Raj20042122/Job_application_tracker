import React from "react";
import { Menu, Plus, Bell, Search, Sparkles } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = ({ onOpenSidebar, onOpenAddJob }) => {
  const location = useLocation();
  const { user } = useAuth();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case "/":
        return "Dashboard";
      case "/applications":
        return "Applications";
      case "/calendar":
        return "Interview Calendar";
      case "/analytics":
        return "Analytics & Insights";
      case "/analyzer":
        return "ATS Resume Analyzer";
      case "/settings":
        return "Account Settings";
      default:
        if (pathname.startsWith("/applications/")) return "Application Details";
        return "Workspace";
    }
  };

  return (
    <header className="h-16 px-4 sm:px-8 border-b border-white/[0.06] bg-[#080B11]/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between">
      {/* Left: Mobile trigger & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>{getPageTitle(location.pathname)}</span>
          </h1>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Weekly Goal Progress Pill */}
        {user?.weeklyGoal && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Goal: {user.weeklyGoal} apps/week</span>
          </div>
        )}

        {/* Quick Add Button */}
        <button
          onClick={onOpenAddJob}
          className="jt-btn-primary py-2 px-3.5 text-xs flex items-center gap-1.5 shadow-indigo-500/15"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span className="hidden sm:inline">Add Application</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
