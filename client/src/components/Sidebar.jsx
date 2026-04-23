import React from 'react';
import { NavLink } from 'react-router-dom';
import { Briefcase, LayoutDashboard, FileText, LogOut } from 'lucide-react';

const Sidebar = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const userString = localStorage.getItem("user") || "{}";
  const user = JSON.parse(userString);
  const username = user.name || "User";

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-[#0f172a] border-r border-[#334155] hidden md:flex flex-col z-50">
      <div className="h-20 flex items-center px-6 border-b border-[#334155] gap-3">
        <div className="bg-[#6366f1] p-2 rounded-xl">
          <Briefcase size={22} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-[#f1f5f9]">JobTracker</span>
      </div>

      <div className="flex-1 py-6 px-4 flex flex-col gap-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all ${
              isActive
                ? "bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/20"
                : "text-[#94a3b8] hover:bg-[#1e293b] hover:text-[#f1f5f9]"
            }`
          }
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink
          to="/analyzer"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all ${
              isActive
                ? "bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/20"
                : "text-[#94a3b8] hover:bg-[#1e293b] hover:text-[#f1f5f9]"
            }`
          }
        >
          <FileText size={20} />
          Resume Analyzer
        </NavLink>
      </div>

      <div className="p-4 border-t border-[#334155]">
        <div className="flex items-center gap-3 px-3 py-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-[#1e293b] border border-[#334155] flex items-center justify-center text-[#f1f5f9] font-bold text-sm">
            {username.substring(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-[#f1f5f9] truncate">{username}</p>
            <p className="text-xs text-[#94a3b8]">My Profile</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-[#94a3b8] hover:bg-[#1e293b] hover:text-[#f1f5f9] transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
