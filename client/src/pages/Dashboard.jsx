import React, { useState, useEffect, useCallback } from "react";
import { Link, useOutletContext } from "react-router-dom";
import api from "../services/api";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ExternalLink,
  Search,
  Filter,
  Plus,
  ArrowRight,
  AlertCircle,
  Eye,
  Edit2,
  Trash2,
  Sparkles
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import toast from "react-hot-toast";
import ApplicationDetailsModal from "../components/ApplicationDetailsModal";
import AddEditJobModal from "../components/AddEditJobModal";

const STATUS_COLORS = {
  Wishlist: "#94A3B8",
  Applied: "#3B82F6",
  OA: "#A855F7",
  Interview: "#F59E0B",
  Offer: "#10B981",
  Rejected: "#F43F5E"
};

const STATUS_BADGES = {
  Wishlist: "badge-wishlist",
  Applied: "badge-applied",
  OA: "badge-oa",
  Interview: "badge-interview",
  Offer: "badge-offer",
  Rejected: "badge-rejected"
};

const Dashboard = () => {
  const { onOpenAddJob } = useOutletContext() || {};
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter for Recent Applications Table
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Modals state
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [jobToEdit, setJobToEdit] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, jobsRes, interviewsRes] = await Promise.all([
        api.get("/jobs/stats"),
        api.get("/jobs", { params: { limit: 6, sort: "-createdAt" } }),
        api.get("/interviews", { params: { upcoming: "true" } })
      ]);

      setStats(statsRes.data);
      setRecentJobs(jobsRes.data.data || []);
      setUpcomingInterviews(interviewsRes.data || []);
    } catch (err) {
      console.error("Dashboard data load error:", err);
      toast.error("Could not fetch dashboard statistics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();

    const handleJobUpdated = () => fetchDashboardData();
    window.addEventListener("job-updated", handleJobUpdated);
    return () => window.removeEventListener("job-updated", handleJobUpdated);
  }, [fetchDashboardData]);

  const handleUpdateStatus = async (jobId, newStatus) => {
    try {
      await api.put(`/jobs/${jobId}`, { status: newStatus });
      toast.success(`Moved to ${newStatus}`);
      fetchDashboardData();
      if (selectedJobDetails?._id === jobId) {
        setSelectedJobDetails((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      toast.success("Application deleted");
      if (selectedJobDetails?._id === jobId) setSelectedJobDetails(null);
      fetchDashboardData();
    } catch (err) {
      toast.error("Failed to delete application");
    }
  };

  const handleSaveJob = async (jobData, jobId) => {
    try {
      if (jobId) {
        await api.put(`/jobs/${jobId}`, jobData);
        toast.success("Application updated");
      } else {
        await api.post("/jobs", jobData);
        toast.success("Application created");
      }
      setJobToEdit(null);
      fetchDashboardData();
    } catch (err) {
      toast.error("Failed to save application");
      throw err;
    }
  };

  // Filtered recent jobs
  const filteredJobs = recentJobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate days until interview
  const getDaysDiff = (dateStr) => {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    return Math.round((target - today) / (1000 * 60 * 60 * 24));
  };

  // Donut chart data
  const pieData = stats?.statusCounts
    ? Object.entries(stats.statusCounts)
        .filter(([_, count]) => count > 0)
        .map(([name, value]) => ({ name, value, color: STATUS_COLORS[name] }))
    : [];

  const totalApplications = stats?.total || 0;
  const inPipeline = (stats?.OA || 0) + (stats?.Interview || 0);
  const offersCount = stats?.Offer || 0;
  const activeCount = totalApplications - (stats?.Rejected || 0);

  return (
    <div className="space-y-6 pb-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Pipeline Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time analytics and tracking for your active search
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/applications"
            className="jt-btn-secondary py-2 px-3.5 text-xs flex items-center gap-1.5"
          >
            <span>All Applications</span>
            <ArrowRight size={14} />
          </Link>
          <button
            onClick={onOpenAddJob}
            className="jt-btn-primary py-2 px-3.5 text-xs flex items-center gap-1.5"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Add Job</span>
          </button>
        </div>
      </div>

      {/* Primary Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Applications */}
        <div className="jt-card-hover p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Added</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Briefcase size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {loading ? "..." : totalApplications}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
            {stats?.weeklyDeltaPercent !== undefined && (
              <span className={`font-semibold ${stats.weeklyDeltaPercent >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {stats.weeklyDeltaPercent >= 0 ? `+${stats.weeklyDeltaPercent}%` : `${stats.weeklyDeltaPercent}%`}
              </span>
            )}
            <span>vs previous 7 days</span>
          </div>
        </div>

        {/* In Active Pipeline */}
        <div className="jt-card-hover p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">In Pipeline</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Calendar size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {loading ? "..." : inPipeline}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            <span>{stats?.Interview || 0} interviews, {stats?.OA || 0} assessments</span>
          </div>
        </div>

        {/* Offers Received */}
        <div className="jt-card-hover p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Offers</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
            {loading ? "..." : offersCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            <span>{stats?.offerRate || 0}% overall conversion</span>
          </div>
        </div>

        {/* Response Rate */}
        <div className="jt-card-hover p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Response Rate</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {loading ? "..." : `${stats?.responseRate || 0}%`}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            <span>Progressed past initial apply</span>
          </div>
        </div>
      </div>

      {/* Visual Pipeline Funnel Progress Bar */}
      <div className="jt-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Pipeline Distribution
          </h3>
          <span className="text-xs text-slate-400">
            {activeCount} Active Applications
          </span>
        </div>

        {/* Horizontal Stacked Progress Bar */}
        <div className="h-3 w-full bg-white/[0.04] rounded-full overflow-hidden flex gap-0.5 p-0.5">
          {totalApplications === 0 ? (
            <div className="h-full w-full bg-white/[0.04] rounded-full" />
          ) : (
            Object.entries(STATUS_COLORS).map(([statusKey, color]) => {
              const count = stats?.statusCounts?.[statusKey] || 0;
              const percent = (count / totalApplications) * 100;
              if (percent === 0) return null;
              return (
                <div
                  key={statusKey}
                  style={{ width: `${percent}%`, backgroundColor: color }}
                  className="h-full rounded-sm transition-all duration-500"
                  title={`${statusKey}: ${count} (${Math.round(percent)}%)`}
                />
              );
            })
          )}
        </div>

        {/* Status Count Legend */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4 pt-3 border-t border-white/[0.06]">
          {Object.entries(STATUS_COLORS).map(([statusKey, color]) => {
            const count = stats?.statusCounts?.[statusKey] || 0;
            return (
              <div key={statusKey} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="text-xs text-slate-400">{statusKey}</span>
                <span className="text-xs font-bold text-white ml-auto">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Grid: Recent Applications & Right Widget Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Recent Applications Table */}
        <div className="lg:col-span-8 flex flex-col jt-card overflow-hidden">
          {/* Table Header Controls */}
          <div className="px-5 py-4 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0C101A]">
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-indigo-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">Recent Applications</h3>
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search role, company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="jt-input py-1.5 pl-8 pr-3 text-xs w-40 sm:w-48 bg-[#090C14]"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="jt-input py-1.5 px-2.5 text-xs bg-[#090C14] w-28 cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Wishlist">Wishlist</option>
                <option value="Applied">Applied</option>
                <option value="OA">OA</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table Content */}
          <div className="flex-1 overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-slate-400">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs">Loading applications...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-3 text-slate-500">
                  <Briefcase size={22} />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">No applications found</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
                  {search || filterStatus !== "All"
                    ? "Try adjusting your search query or filter."
                    : "Track your first job application to monitor your interview pipeline."}
                </p>
                <button onClick={onOpenAddJob} className="jt-btn-primary py-2 px-4 text-xs">
                  <Plus size={14} />
                  <span>Add First Application</span>
                </button>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-white/[0.01]">
                    <th className="px-5 py-3">Role & Company</th>
                    <th className="px-4 py-3">Stage</th>
                    <th className="px-4 py-3 hidden sm:table-cell">Salary / Location</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredJobs.map((job) => (
                    <tr
                      key={job._id}
                      className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                      onClick={() => setSelectedJobDetails(job)}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
                            {job.company.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                              {job.title}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">
                              {job.company}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={job.status}
                          onChange={(e) => handleUpdateStatus(job._id, e.target.value)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg cursor-pointer outline-none ${
                            STATUS_BADGES[job.status] || "badge-applied"
                          }`}
                        >
                          <option value="Wishlist" className="bg-[#0B0E17] text-slate-300">Wishlist</option>
                          <option value="Applied" className="bg-[#0B0E17] text-blue-300">Applied</option>
                          <option value="OA" className="bg-[#0B0E17] text-purple-300">OA</option>
                          <option value="Interview" className="bg-[#0B0E17] text-amber-300">Interview</option>
                          <option value="Offer" className="bg-[#0B0E17] text-emerald-300">Offer</option>
                          <option value="Rejected" className="bg-[#0B0E17] text-rose-300">Rejected</option>
                        </select>
                      </td>

                      <td className="px-4 py-3.5 hidden sm:table-cell text-xs text-slate-300">
                        <div className="truncate max-w-[180px]">
                          {job.salary ? <span className="text-emerald-400 font-medium">{job.salary}</span> : null}
                          {job.salary && job.location ? " • " : null}
                          {job.location ? <span className="text-slate-400">{job.location}</span> : null}
                          {!job.salary && !job.location && <span className="text-slate-600">—</span>}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedJobDetails(job)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
                            title="View Details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => setJobToEdit(job)}
                            className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-indigo-500/10 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right 4 Cols: Upcoming Interviews & Analytics Widget */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Upcoming Interviews Widget */}
          <div className="jt-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Upcoming Interviews
                </h3>
              </div>
              <Link to="/calendar" className="text-[11px] text-indigo-400 hover:underline">
                View Calendar
              </Link>
            </div>

            {upcomingInterviews.length === 0 ? (
              <div className="p-6 text-center text-slate-500 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                <Calendar size={20} className="mx-auto mb-2 text-slate-600" />
                <p className="text-xs">No upcoming interviews scheduled</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Schedule one by editing any application
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {upcomingInterviews.slice(0, 3).map((item) => {
                  const daysLeft = getDaysDiff(item.interviewDate);
                  return (
                    <div
                      key={item._id}
                      onClick={() => setSelectedJobDetails(item)}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                          <p className="text-[11px] text-slate-400">{item.company}</p>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            daysLeft === 0
                              ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                              : daysLeft === 1
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                          }`}
                        >
                          {daysLeft === 0 ? "Today" : daysLeft === 1 ? "Tomorrow" : `In ${daysLeft} days`}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                        <span>{new Date(item.interviewDate).toLocaleDateString()}</span>
                        {item.interviewTime && <span>• {item.interviewTime}</span>}
                        <span>• {item.interviewType || "Video call"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Status Breakdown Donut Chart */}
          <div className="jt-card p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Status Breakdown
            </h3>

            {pieData.length === 0 ? (
              <div className="h-44 flex items-center justify-center text-xs text-slate-500">
                No application data yet
              </div>
            ) : (
              <div className="h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={52}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0B0E17",
                        borderColor: "rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "#FFF"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center total overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-white leading-none">{totalApplications}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Total</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <ApplicationDetailsModal
        isOpen={!!selectedJobDetails}
        onClose={() => setSelectedJobDetails(null)}
        job={selectedJobDetails}
        onUpdateStatus={handleUpdateStatus}
        onEdit={(job) => {
          setSelectedJobDetails(null);
          setJobToEdit(job);
        }}
        onDelete={handleDeleteJob}
      />

      {/* Edit Job Modal */}
      <AddEditJobModal
        isOpen={!!jobToEdit}
        onClose={() => setJobToEdit(null)}
        initialData={jobToEdit}
        onSave={handleSaveJob}
      />
    </div>
  );
};

export default Dashboard;