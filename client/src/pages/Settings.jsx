import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Toggle = ({ label, subtitle, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-700/50 last:border-0">
      <div>
        <div className="text-white font-medium text-sm mb-0.5">{label}</div>
        <div className="text-slate-400 text-xs">{subtitle}</div>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-none ${
          checked ? "bg-[#6c63ff]" : "bg-white/10"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow ring-0 transition duration-150 ease-in-out ${
            checked ? "translate-x-[20px]" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    followUpReminders: true,
    interviewAlerts: true,
    weeklySummary: false,
    goalAlert: true,
    darkMode: true,
    compactView: false,
    shareAnalytics: true,
    twoFactorAuth: false
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/users/settings");
        if (res.data) {
          setSettings(prev => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = async (key) => {
    const newValue = !settings[key];
    // Optimistic update
    setSettings(prev => ({ ...prev, [key]: newValue }));

    try {
      await api.put("/users/settings", { settingKey: key, value: newValue });
    } catch (err) {
      // Revert on error
      setSettings(prev => ({ ...prev, [key]: !newValue }));
      toast.error("Failed to update setting");
    }
  };

  const handleExportData = async () => {
    try {
      const res = await api.get("/jobs"); // Get all jobs to export
      const jobs = res.data.data || res.data;
      
      if (jobs.length === 0) {
        return toast.error("No data to export");
      }

      const headers = ["Title", "Company", "Status", "Date", "Link", "Notes"];
      const csvRows = [];
      csvRows.push(headers.join(","));

      jobs.forEach(job => {
        const values = [
          `"${job.title}"`,
          `"${job.company}"`,
          `"${job.status}"`,
          `"${new Date(job.createdAt).toLocaleDateString()}"`,
          `"${job.link || ""}"`,
          `"${(job.notes || "").replace(/"/g, '""')}"`
        ];
        csvRows.push(values.join(","));
      });

      const csvData = csvRows.join("\n");
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute("download", "jobtracker_export.csv");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Data exported successfully");
    } catch (err) {
      toast.error("Failed to export data");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete("/auth/account");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    } catch (err) {
      toast.error("Failed to delete account");
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center h-full">
        <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-[#6c63ff] rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col h-full pb-8">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      <div className="space-y-6">
        
        {/* Notifications */}
        <div className="bg-[#23293d] border border-white/5 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notifications</h3>
          <Toggle 
            label="Follow-up reminders" 
            subtitle="Remind when to follow up on applications"
            checked={settings.followUpReminders}
            onChange={() => handleToggle('followUpReminders')}
          />
          <Toggle 
            label="Interview alerts" 
            subtitle="Notify 1 hour before scheduled interviews"
            checked={settings.interviewAlerts}
            onChange={() => handleToggle('interviewAlerts')}
          />
          <Toggle 
            label="Weekly summary email" 
            subtitle="Get a weekly digest of your job search"
            checked={settings.weeklySummary}
            onChange={() => handleToggle('weeklySummary')}
          />
          <Toggle 
            label="Goal achievement alert" 
            subtitle="Notify when weekly application goal is hit"
            checked={settings.goalAlert}
            onChange={() => handleToggle('goalAlert')}
          />
        </div>

        {/* Appearance */}
        <div className="bg-[#23293d] border border-white/5 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Appearance</h3>
          <Toggle 
            label="Dark mode" 
            subtitle="Use dark theme across the app"
            checked={settings.darkMode}
            onChange={() => handleToggle('darkMode')}
          />
          <Toggle 
            label="Compact view" 
            subtitle="Show more applications per page"
            checked={settings.compactView}
            onChange={() => handleToggle('compactView')}
          />
        </div>

        {/* Privacy */}
        <div className="bg-[#23293d] border border-white/5 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Privacy</h3>
          <Toggle 
            label="Share analytics" 
            subtitle="Help improve JobTracker with usage data"
            checked={settings.shareAnalytics}
            onChange={() => handleToggle('shareAnalytics')}
          />
          <Toggle 
            label="Two-factor authentication" 
            subtitle="Extra security for your account"
            checked={settings.twoFactorAuth}
            onChange={() => handleToggle('twoFactorAuth')}
          />
        </div>

        {/* Danger Zone */}
        <div className="bg-[#23293d] border border-red-500/30 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-4">Danger Zone</h3>
          
          <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
            <span className="text-white text-sm font-medium">Export all data</span>
            <button 
              onClick={handleExportData}
              className="px-4 py-1.5 border border-red-500/50 text-red-400 text-sm font-medium rounded-lg hover:bg-red-500/10 transition-colors"
            >
              Export CSV
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-white text-sm font-medium">Delete account</span>
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-1.5 border border-red-500/50 text-red-400 text-sm font-medium rounded-lg hover:bg-red-500/10 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1e293b] rounded-2xl shadow-xl w-full max-w-md border border-[#334155] overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Account</h3>
              <p className="text-slate-400 text-sm mb-6">
                Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 bg-[#0f172a] text-white rounded-xl font-medium border border-[#334155] hover:bg-[#334155] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Settings;
