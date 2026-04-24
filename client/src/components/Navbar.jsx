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
    <nav className="sticky top-0 z-50 bg-[#0B1120] border-b border-slate-800 shadow-lg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Left - Logo */}
          <div className="flex items-center gap-2 text-indigo-400">
            <Briefcase size={24} />
            <span className="text-xl font-bold text-white tracking-tight">JobTracker</span>
          </div>

          {/* Center - Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-indigo-300 ${
                    isActive
                      ? "text-indigo-400 border-b-2 border-indigo-400 py-5"
                      : "text-slate-400 py-5"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right - Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* Profile Dropdown */}
            <div className="relative ml-2" ref={dropdownRef}>
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 hover:bg-slate-800 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-700"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                  {username.substring(0, 2).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-300 hidden md:block">{username}</span>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0f172a] border border-slate-700 rounded-xl shadow-lg py-1 z-50">
                  <div className="px-4 py-3 border-b border-slate-700">
                    <p className="text-sm font-medium text-white truncate">{username}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{user.email || 'User'}</p>
                  </div>

                  <NavLink
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <User size={16} />
                    Profile
                  </NavLink>

                  <NavLink
                    to="/settings"
                    onClick={() => setShowDropdown(false)}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors border-b border-slate-700/50"
                  >
                    <User size={16} />
                    Settings
                  </NavLink>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
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
