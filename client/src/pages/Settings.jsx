import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  User,
  Bell,
  Download,
  Trash2,
  Save,
  CheckCircle2,
  Shield,
  Briefcase,
  MapPin,
  Target,
  FileSpreadsheet,
  AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [weeklyGoal, setWeeklyGoal] = useState(5);
  const [savingProfile, setSavingProfile] = useState(false);

  // Preferences
  const [settings, setSettings] = useState({
    followUpReminders: true,
    interviewAlerts: true,
    weeklySummary: false,
    goalAlert: true
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Danger Zone
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setJobTitle(user.jobTitle || "");
      setLocation(user.location || "");
      setWeeklyGoal(user.weeklyGoal || 5);
      if (user.settings) {
        setSettings((prev) => ({ ...prev, ...user.settings }));
      }
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.put("/users/profile", {
        name: name.trim(),
        jobTitle: jobTitle.trim(),
        location: location.trim(),
        weeklyGoal: Number(weeklyGoal)
      });
      updateUser(res.data);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleToggle = async (key) => {
    const updated = !settings[key];
    setSettings((prev) => ({ ...prev, [key]: updated }));

    try {
      await api.put("/users/settings", { settingKey: key, value: updated });
    } catch (err) {
      setSettings((prev) => ({ ...prev, [key]: !updated }));
      toast.error("Failed to update preference");
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await api.get("/jobs", { params: { limit: "all" } });
      const jobs = res.data.data || [];

      if (jobs.length === 0) {
        return toast.error("No applications to export");
      }

      const headers = ["Title", "Company", "Status", "Salary", "Location", "Recruiter", "Date", "Link", "Notes"];
      const rows = [headers.join(",")];

      jobs.forEach((j) => {
        const row = [
          `"${(j.title || "").replace(/"/g, '""')}"`,
          `"${(j.company || "").replace(/"/g, '""')}"`,
          `"${j.status || ""}"`,
          `"${(j.salary || "").replace(/"/g, '""')}"`,
          `"${(j.location || "").replace(/"/g, '""')}"`,
          `"${(j.recruiter?.name || "").replace(/"/g, '""')}"`,
          `"${new Date(j.createdAt || j.date).toLocaleDateString()}"`,
          `"${(j.link || "").replace(/"/g, '""')}"`,
          `"${(j.notes || "").replace(/"/g, '""')}"`
        ];
        rows.push(row.join(","));
      });

      const csvContent = rows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `jobtracker_export_${new Date().toISOString().substring(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV export downloaded");
    } catch (err) {
      toast.error("Failed to export data");
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== "DELETE") {
      return toast.error("Please type DELETE to confirm");
    }
    setDeleting(true);
    try {
      await api.delete("/auth/account");
      toast.success("Account and data deleted");
      logout();
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to delete account");
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Account Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your career profile, notification rules, and exported data
        </p>
      </div>

      {/* Profile Section */}
      <div className="jt-card p-6 sm:p-7">
        <div className="flex items-center gap-3 pb-5 border-b border-white/[0.06] mb-6">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <User size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Career Profile</h3>
            <p className="text-xs text-slate-400">Personal details used to customize your workspace</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="jt-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="jt-input opacity-60 cursor-not-allowed bg-black/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Target Role / Job Title
              </label>
              <div className="relative">
                <Briefcase size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. Staff Software Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="jt-input pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Primary Location
              </label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="jt-input pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Target Weekly Apps Goal
              </label>
              <div className="relative">
                <Target size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={weeklyGoal}
                  onChange={(e) => setWeeklyGoal(e.target.value)}
                  className="jt-input pl-9"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={savingProfile}
              className="jt-btn-primary py-2 px-4 text-xs flex items-center gap-1.5"
            >
              <Save size={14} />
              <span>{savingProfile ? "Saving..." : "Save Profile"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Notifications & Preferences */}
      <div className="jt-card p-6 sm:p-7">
        <div className="flex items-center gap-3 pb-5 border-b border-white/[0.06] mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Bell size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Application Notifications</h3>
            <p className="text-xs text-slate-400">Configure reminder alerts and interview notifications</p>
          </div>
        </div>

        <div className="divide-y divide-white/[0.04]">
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-xs font-semibold text-white">Upcoming Interview Reminders</p>
              <p className="text-[11px] text-slate-400">Alert me prior to scheduled interviews and assessments</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle("interviewAlerts")}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                settings.interviewAlerts ? "bg-indigo-600" : "bg-white/10"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.interviewAlerts ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-xs font-semibold text-white">Follow-up Suggestions</p>
              <p className="text-[11px] text-slate-400">Remind me to follow up if an application has no response after 7 days</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle("followUpReminders")}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                settings.followUpReminders ? "bg-indigo-600" : "bg-white/10"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.followUpReminders ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-xs font-semibold text-white">Weekly Pipeline Digest</p>
              <p className="text-[11px] text-slate-400">Generate weekly velocity summary and goal tracking</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle("weeklySummary")}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                settings.weeklySummary ? "bg-indigo-600" : "bg-white/10"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.weeklySummary ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Data Export */}
      <div className="jt-card p-6 sm:p-7">
        <div className="flex items-center gap-3 pb-5 border-b border-white/[0.06] mb-5">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Download size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Data Portability</h3>
            <p className="text-xs text-slate-400">Download a full backup of your applications history</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <div className="flex items-center gap-3">
            <FileSpreadsheet size={20} className="text-emerald-400" />
            <div>
              <p className="text-xs font-semibold text-white">Export to CSV Spreadsheet</p>
              <p className="text-[11px] text-slate-400">Compatible with Google Sheets, Excel, and Notion</p>
            </div>
          </div>
          <button
            onClick={handleExportCSV}
            className="jt-btn-secondary py-2 px-4 text-xs flex items-center gap-2 self-start sm:self-auto"
          >
            <Download size={14} />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="jt-card p-6 sm:p-7 border-rose-500/20 bg-rose-950/10">
        <div className="flex items-center gap-3 pb-4 border-b border-rose-500/20 mb-4 text-rose-400">
          <AlertTriangle size={18} />
          <h3 className="text-sm font-bold">Danger Zone</h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-white">Delete Account & Stored Data</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Permanently delete your profile and all tracked job applications. This cannot be undone.
            </p>
          </div>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="py-2 px-4 rounded-xl text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/80 border border-rose-500/30 transition-all self-start sm:self-auto"
          >
            Delete Account
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="jt-card p-6 max-w-md w-full border border-rose-500/30 shadow-2xl">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2 text-rose-400">
                <AlertTriangle size={16} />
                Confirm Account Deletion
              </h4>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                This action is permanent and will delete all your applications, interview notes, and analytics.
                Type <strong className="text-rose-400 font-mono">DELETE</strong> below to confirm.
              </p>
              <input
                type="text"
                placeholder="Type DELETE"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                className="jt-input mb-4 font-mono text-xs"
              />
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteInput("");
                  }}
                  className="jt-btn-secondary py-2 px-4 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleteInput !== "DELETE" || deleting}
                  className="py-2 px-4 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-50 transition-all"
                >
                  {deleting ? "Deleting..." : "Permanently Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
