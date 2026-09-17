import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../services/api";
import {
  Briefcase,
  Search,
  Filter,
  Kanban,
  Table as TableIcon,
  Plus,
  Building,
  MapPin,
  DollarSign,
  Calendar,
  ExternalLink,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  ArrowUpDown
} from "lucide-react";
import toast from "react-hot-toast";
import ApplicationDetailsModal from "../components/ApplicationDetailsModal";
import AddEditJobModal from "../components/AddEditJobModal";

const COLUMNS = [
  { id: "Wishlist", title: "Wishlist", color: "#94A3B8" },
  { id: "Applied", title: "Applied", color: "#3B82F6" },
  { id: "OA", title: "Assessment (OA)", color: "#A855F7" },
  { id: "Interview", title: "Interviewing", color: "#F59E0B" },
  { id: "Offer", title: "Offers", color: "#10B981" },
  { id: "Rejected", title: "Archived / Rejected", color: "#F43F5E" }
];

const STATUS_BADGES = {
  Wishlist: "badge-wishlist",
  Applied: "badge-applied",
  OA: "badge-oa",
  Interview: "badge-interview",
  Offer: "badge-offer",
  Rejected: "badge-rejected"
};

const Applications = () => {
  const { onOpenAddJob } = useOutletContext() || {};
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // View Mode: "kanban" or "table"
  const [viewMode, setViewMode] = useState("kanban");

  // Filtering and Sorting
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("-createdAt");

  // Modals
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobToEdit, setJobToEdit] = useState(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs", {
        params: {
          search,
          status: filterStatus === "All" ? undefined : filterStatus,
          sort: sortBy
        }
      });
      setJobs(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, sortBy]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchApplications();
    }, 250);
    return () => clearTimeout(delay);
  }, [fetchApplications]);

  useEffect(() => {
    const handleJobUpdated = () => fetchApplications();
    window.addEventListener("job-updated", handleJobUpdated);
    return () => window.removeEventListener("job-updated", handleJobUpdated);
  }, [fetchApplications]);

  const handleUpdateStatus = async (jobId, newStatus) => {
    try {
      await api.put(`/jobs/${jobId}`, { status: newStatus });
      toast.success(`Moved to ${newStatus}`);
      fetchApplications();
      if (selectedJob?._id === jobId) {
        setSelectedJob((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      toast.error("Failed to move application");
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this application permanently?")) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      toast.success("Application deleted");
      if (selectedJob?._id === jobId) setSelectedJob(null);
      fetchApplications();
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
      fetchApplications();
    } catch (err) {
      toast.error("Failed to save application");
      throw err;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Applications Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your opportunities across all pipeline stages
          </p>
        </div>

        {/* View Switcher & Add Button */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-[#0C101A] border border-white/[0.08] p-1 rounded-xl">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "kanban"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Kanban size={14} />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "table"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <TableIcon size={14} />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={onOpenAddJob}
            className="jt-btn-primary py-2 px-3.5 text-xs flex items-center gap-1.5"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Add Job</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="jt-card p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by role, company, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="jt-input py-1.5 pl-9 text-xs"
            />
          </div>

          {/* Filter Status (Especially useful in Table view) */}
          {viewMode === "table" && (
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="jt-input py-1.5 px-3 text-xs w-36 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Wishlist">Wishlist</option>
              <option value="Applied">Applied</option>
              <option value="OA">Assessment (OA)</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <ArrowUpDown size={14} className="text-slate-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="jt-input py-1.5 px-3 text-xs w-36 cursor-pointer"
          >
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
            <option value="company">Company (A-Z)</option>
            <option value="-company">Company (Z-A)</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {/* Applications Content */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Loading application pipeline...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="jt-card p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4 text-slate-500">
            <Briefcase size={26} />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No applications matched</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
            {search || filterStatus !== "All"
              ? "No job applications match your active search or filters."
              : "Get started by logging your first job opportunity."}
          </p>
          <button onClick={onOpenAddJob} className="jt-btn-primary py-2 px-4 text-xs">
            <Plus size={14} />
            <span>Create New Application</span>
          </button>
        </div>
      ) : viewMode === "kanban" ? (
        /* ================== KANBAN BOARD VIEW ================== */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
          {COLUMNS.map((col) => {
            const columnJobs = jobs.filter((j) => j.status === col.id);
            return (
              <div
                key={col.id}
                className="bg-[#0C101A] border border-white/[0.06] rounded-2xl p-3 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-2 py-2 mb-2 border-b border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                    <h3 className="text-xs font-bold text-slate-200">{col.title}</h3>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 bg-white/[0.05] px-2 py-0.5 rounded-full">
                    {columnJobs.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-2.5 flex-1 overflow-y-auto pr-0.5">
                  {columnJobs.length === 0 ? (
                    <div className="h-32 flex items-center justify-center border border-dashed border-white/[0.06] rounded-xl text-[11px] text-slate-600">
                      Empty
                    </div>
                  ) : (
                    columnJobs.map((job) => (
                      <div
                        key={job._id}
                        onClick={() => setSelectedJob(job)}
                        className="jt-card-hover p-3.5 cursor-pointer group bg-[#111522] border-white/[0.08]"
                      >
                        {/* Company & Actions */}
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider truncate">
                            {job.company}
                          </span>
                          {job.link && (
                            <a
                              href={job.link}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-slate-500 hover:text-slate-300"
                            >
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>

                        {/* Role Title */}
                        <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug mb-2">
                          {job.title}
                        </h4>

                        {/* Tags (Salary & Location) */}
                        <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-400 mb-2">
                          {job.salary && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                              {job.salary}
                            </span>
                          )}
                          {job.location && (
                            <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-400 truncate max-w-[120px]">
                              {job.location}
                            </span>
                          )}
                        </div>

                        {/* Card Footer: Quick Stage Changer & Date */}
                        <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-slate-500">
                          <span>{new Date(job.createdAt || job.date).toLocaleDateString()}</span>

                          <select
                            value={job.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleUpdateStatus(job._id, e.target.value)}
                            className="bg-black/30 border border-white/10 rounded px-1.5 py-0.5 text-[10px] text-slate-300 font-semibold cursor-pointer outline-none hover:border-indigo-500/50"
                          >
                            {COLUMNS.map((c) => (
                              <option key={c.id} value={c.id} className="bg-[#0B0E17]">
                                {c.id}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ================== TABLE VIEW ================== */
        <div className="jt-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-white/[0.01]">
                  <th className="px-5 py-3.5">Company & Role</th>
                  <th className="px-4 py-3.5">Stage</th>
                  <th className="px-4 py-3.5">Salary</th>
                  <th className="px-4 py-3.5">Location</th>
                  <th className="px-4 py-3.5">Recruiter</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {jobs.map((job) => (
                  <tr
                    key={job._id}
                    onClick={() => setSelectedJob(job)}
                    className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {job.company.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
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

                    <td className="px-4 py-3.5 text-xs text-emerald-400 font-medium">
                      {job.salary || <span className="text-slate-600">—</span>}
                    </td>

                    <td className="px-4 py-3.5 text-xs text-slate-400 truncate max-w-[150px]">
                      {job.location || <span className="text-slate-600">—</span>}
                    </td>

                    <td className="px-4 py-3.5 text-xs text-slate-300 truncate max-w-[140px]">
                      {job.recruiter?.name || <span className="text-slate-600">—</span>}
                    </td>

                    <td className="px-4 py-3.5 text-xs text-slate-400">
                      {new Date(job.createdAt || job.date).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedJob(job)}
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
                          onClick={() => handleDelete(job._id)}
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
          </div>
        </div>
      )}

      {/* Detail Slideover Modal */}
      <ApplicationDetailsModal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        job={selectedJob}
        onUpdateStatus={handleUpdateStatus}
        onEdit={(job) => {
          setSelectedJob(null);
          setJobToEdit(job);
        }}
        onDelete={handleDelete}
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

export default Applications;
