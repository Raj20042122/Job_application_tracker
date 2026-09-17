import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Plus,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ onOpenAddJob, isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Applications", path: "/applications", icon: Briefcase },
    { name: "Calendar", path: "/calendar", icon: Calendar },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Resume Analyzer", path: "/analyzer", icon: FileText },
    { name: "Settings", path: "/settings", icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "US";
    const parts = name.trim().split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#0B0E17] border-r border-white/[0.06] flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-[0_0_16px_rgba(99,102,241,0.5)]">
              <Briefcase size={16} strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white block">JobTracker</span>
              <span className="text-[10px] text-indigo-400 font-mono tracking-wider uppercase block">PRO OS</span>
            </div>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="p-4 shrink-0">
          <button
            onClick={() => {
              if (onClose) onClose();
              onOpenAddJob();
            }}
            className="jt-btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2 tracking-wide font-semibold shadow-indigo-500/20"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>New Application</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? "bg-indigo-600/10 text-white border border-indigo-500/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        size={17}
                        className={`transition-colors ${
                          isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom User Profile & Logout */}
        <div className="p-3 border-t border-white/[0.06] shrink-0 bg-[#0A0D15]">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.03] transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-white/10 object-cover shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                  {getInitials(user?.name)}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user?.name || "User"}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || ""}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
