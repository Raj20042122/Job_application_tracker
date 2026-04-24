import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    jobTitle: "",
    location: "",
    weeklyGoal: 5
  });

  const [stats, setStats] = useState({
    Applied: 0,
    Offer: 0,
    Streak: 0,
    ResponseRate: "0%"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          api.get("/users/profile"),
          api.get("/jobs/stats")
        ]);
        
        const userData = profileRes.data;
        setProfile({
          name: userData.name || "",
          email: userData.email || "",
          jobTitle: userData.jobTitle || "",
          location: userData.location || "",
          weeklyGoal: userData.weeklyGoal || 5
        });

        // Calculate some dummy/real stats based on jobs/stats
        const jobStats = statsRes.data;
        const total = Object.values(jobStats).reduce((a, b) => a + b, 0);
        const responses = (jobStats.Interview || 0) + (jobStats.Rejected || 0) + (jobStats.Offer || 0);
        const responseRate = total > 0 ? Math.round((responses / total) * 100) + "%" : "0%";

        setStats({
          Applied: jobStats.Applied || 0,
          Offer: jobStats.Offer || 0,
          Streak: 3, // Dummy streak
          ResponseRate: responseRate
        });
      } catch (err) {
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/users/profile", {
        name: profile.name,
        jobTitle: profile.jobTitle,
        location: profile.location,
        weeklyGoal: Number(profile.weeklyGoal)
      });
      toast.success("Profile updated successfully");
      
      // Update local storage user name
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userObj = JSON.parse(userStr);
        userObj.name = profile.name;
        localStorage.setItem("user", JSON.stringify(userObj));
      }
      
      // trigger nav update
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center h-full">
        <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-[#6c63ff] rounded-full"></div>
      </div>
    );
  }

  const initials = profile.name ? profile.name.substring(0, 2).toUpperCase() : "U";

  return (
    <div className="max-w-5xl mx-auto w-full flex flex-col h-full">
      <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>
      
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Card */}
        <div className="w-full lg:w-[280px] bg-[#23293d] border border-white/5 rounded-2xl p-6 shadow-sm shrink-0 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-[#6c63ff] flex items-center justify-center text-3xl font-bold text-white mb-4">
            {initials}
          </div>
          <h2 className="text-xl font-bold text-white mb-1">{profile.name}</h2>
          <p className="text-slate-400 text-sm mb-3">{profile.email}</p>
          
          <div className="px-3 py-1 bg-[#6c63ff]/10 text-[#6c63ff] text-xs font-semibold rounded-full mb-6">
            Google account
          </div>

          <div className="grid grid-cols-2 gap-3 w-full mb-6">
            <div className="bg-[#1a1f2e] border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-white">{stats.Applied}</span>
              <span className="text-xs text-slate-400 mt-1">Applied</span>
            </div>
            <div className="bg-[#1a1f2e] border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-white">{stats.Offer}</span>
              <span className="text-xs text-slate-400 mt-1">Offer</span>
            </div>
            <div className="bg-[#1a1f2e] border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-white">{stats.Streak}</span>
              <span className="text-xs text-slate-400 mt-1">Streak</span>
            </div>
            <div className="bg-[#1a1f2e] border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-white">{stats.ResponseRate}</span>
              <span className="text-xs text-slate-400 mt-1">Response</span>
            </div>
          </div>

          <button className="w-full bg-[#1a1f2e] hover:bg-slate-800 border border-white/5 text-white rounded-xl py-2.5 text-sm font-medium transition-colors">
            Edit photo
          </button>
        </div>

        {/* Right Card */}
        <div className="flex-1 bg-[#23293d] border border-white/5 rounded-2xl p-6 shadow-sm w-full">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Personal Info</h3>
          
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="w-24 text-sm font-medium text-slate-400 shrink-0">Full name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="flex-1 bg-[#1a1f2e] border border-slate-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="w-24 text-sm font-medium text-slate-400 shrink-0">Email</label>
              <div className="flex-1 px-4 py-2.5 text-[#6c63ff] text-sm font-medium">
                {profile.email}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="w-24 text-sm font-medium text-slate-400 shrink-0">Job title</label>
              <input
                type="text"
                name="jobTitle"
                value={profile.jobTitle}
                onChange={handleChange}
                className="flex-1 bg-[#1a1f2e] border border-slate-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="w-24 text-sm font-medium text-slate-400 shrink-0">Location</label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
                className="flex-1 bg-[#1a1f2e] border border-slate-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="w-24 text-sm font-medium text-slate-400 shrink-0">Weekly goal</label>
              <input
                type="text"
                name="weeklyGoal"
                value={profile.weeklyGoal}
                onChange={handleChange}
                className="flex-1 bg-[#1a1f2e] border border-slate-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#6c63ff] hover:bg-[#5a52d5] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-70 flex items-center gap-2 shadow-lg shadow-[#6c63ff]/20"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
