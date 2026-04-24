import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Briefcase, Moon, Sun, LogOut, Menu, X, User } from 'lucide-react';

const Navbar = ({ darkMode, setDarkMode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const navLinks = [
    { name: "Dashboard", path: "/" },
    { name: "Resume Analyzer", path: "/analyzer" }
  ];

  const userString = localStorage.getItem("user") || "{}";
  const user = JSON.parse(userString);
  const username = user.name || "User";

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-[#090e17]/70 backdrop-blur-xl border-b border-white/5 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Left - Logo */}
          <div className="flex items-center gap-2 text-[#6366f1]">
            <div className="bg-gradient-to-br from-[#6366f1] to-[#a855f7] p-1.5 rounded-lg text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              <Briefcase size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight ml-1">JobTracker</span>
          </div>

          {/* Center - Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6 h-full">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-[13px] font-semibold transition-all duration-300 h-full flex items-center relative ${
                    isActive
                      ? "text-white"
                      : "text-[#9CA3AF] hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] shadow-[0_-2px_10px_rgba(99,102,241,0.5)]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right - Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-[#9CA3AF] hover:text-white transition-colors rounded-full hover:bg-white/5"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            {/* Profile Dropdown */}
            <div className="relative ml-2 flex items-center h-full" ref={dropdownRef}>
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2.5 hover:bg-white/5 py-1.5 px-2 rounded-xl transition-all border border-transparent hover:border-white/10"
              >
                <div className="w-7 h-7 rounded-full bg-[#1e293b] text-[#E5E7EB] border border-white/10 flex items-center justify-center font-bold text-[11px] tracking-wider">
                  {username.substring(0, 2).toUpperCase()}
                </div>
                <span className="text-[13px] font-semibold text-white hidden md:block">{username.toUpperCase()}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 top-[60px] w-56 bg-[#0F172A] border border-[rgba(255,255,255,0.06)] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] py-2 z-50">
                  <div className="px-5 py-3 border-b border-white/5 mb-1">
                    <p className="text-[14px] font-semibold text-white truncate">{username}</p>
                    <p className="text-[12px] font-medium text-[#94a3b8] mt-0.5 truncate">{user.email || 'User'}</p>
                  </div>

                  <div className="px-2">
                    <NavLink
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-[#f1f5f9] hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <User size={16} className="text-[#94a3b8]" />
                      Profile
                    </NavLink>

                    <NavLink
                      to="/settings"
                      onClick={() => setShowDropdown(false)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-[#f1f5f9] hover:bg-white/5 rounded-lg transition-colors mb-1"
                    >
                      <User size={16} className="text-[#94a3b8]" />
                      Settings
                    </NavLink>
                  </div>

                  <div className="px-2 border-t border-white/5 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 mt-1 text-[13px] font-medium text-[#ef4444] hover:bg-[#ef4444]/10 rounded-lg transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-400 hover:text-white"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0B1120] absolute w-full shadow-xl">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {/* User Info in Mobile Menu */}
            <div className="px-3 py-3 border-b border-slate-800 mb-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-base">
                {username.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-white truncate">{username}</p>
                <p className="text-xs text-slate-400">{user.email || 'User'}</p>
              </div>
            </div>

            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "bg-indigo-900/40 text-indigo-400"
                      : "text-slate-400 hover:bg-slate-800"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <div className="border-t border-slate-800 my-2 pt-2">
              <NavLink
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive ? "bg-indigo-900/40 text-indigo-400" : "text-slate-400 hover:bg-slate-800"
                  }`
                }
              >
                Profile
              </NavLink>
              <NavLink
                to="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive ? "bg-indigo-900/40 text-indigo-400" : "text-slate-400 hover:bg-slate-800"
                  }`
                }
              >
                Settings
              </NavLink>
            </div>

            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-2 px-3 py-2 mt-2 rounded-md text-base font-medium text-red-400 hover:bg-slate-800 hover:text-red-300"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
