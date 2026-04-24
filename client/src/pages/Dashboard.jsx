import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Plus, Briefcase, Calendar, XCircle, CheckCircle, Search } from "lucide-react";
import toast from "react-hot-toast";

import StatsCard from "../components/StatsCard";
import JobTable from "../components/JobTable";
import NotesModal from "../components/NotesModal";
import AddJobModal from "../components/AddJobModal";
import EditJobModal from "../components/EditJobModal";
import OverviewChart from "../components/OverviewChart";

import UpcomingInterviews from "../components/UpcomingInterviews";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobToEdit, setJobToEdit] = useState(null);

  // Search, Filter, Sort, Pagination states
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Stats only need to fetch once or on updates
  useEffect(() => {
    fetchStats();
  }, []);

  // Debounced fetch for jobs
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchJobs();
    }, 400);
    return () => clearTimeout(delay);
  }, [search, filterStatus, sort, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, filterStatus, sort]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await API.get("/jobs", {
        params: { search, status: filterStatus, sort, page, limit: 5 }
      });
      setJobs(res.data.data || res.data);
      if (res.data.pages) setTotalPages(res.data.pages);
    } catch (err) {
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/jobs/stats");
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddJob = async (jobData) => {
    try {
      await API.post("/jobs", jobData);
      toast.success("Job added successfully");
      setIsAddModalOpen(false);
      fetchJobs();
      fetchStats();
    } catch (err) {
      toast.error("Failed to add job");
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      await API.delete(`/jobs/${id}`);
      toast.success("Job deleted");
      fetchJobs();
      fetchStats();
    } catch (err) {
      toast.error("Failed to delete job");
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await API.put(`/jobs/${id}`, { status: newStatus });
      toast.success("Status updated");
      fetchJobs();
      fetchStats();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleEditJob = async (id, jobData) => {
    try {
      await API.put(`/jobs/${id}`, jobData);
      toast.success("Job updated");
      setIsEditModalOpen(false);
      fetchJobs();
      fetchStats();
    } catch (err) {
      toast.error("Failed to update job");
    }
  };

  const handleOpenEditJob = (job) => {
    setJobToEdit(job);
    setIsEditModalOpen(true);
  };

  const handleOpenNotes = (job) => {
    setSelectedJob(job);
    setIsNotesOpen(true);
  };

  const handleSaveNotes = async (id, notes) => {
    try {
      await API.put(`/jobs/${id}`, { notes });
      toast.success("Notes saved");
      setIsNotesOpen(false);
      fetchJobs();
    } catch (err) {
      toast.error("Failed to save notes");
    }
  };

  const totalJobs = Object.values(stats).reduce((a, b) => a + b, 0);
  const userString = localStorage.getItem("user") || "{}";
  const user = JSON.parse(userString);
  const username = user.name ? user.name.split(" ")[0] : "User";

  return (
    <div className="w-full h-full flex flex-col pb-2">
      <div className="flex justify-between items-end mb-4 mt-1 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#f1f5f9] tracking-tight mb-1">Good morning, {username} 👋</h1>
          <p className="text-[#94a3b8] font-medium text-sm md:text-base">Here's your job search summary</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="hidden sm:flex items-center gap-2 bg-[#6366f1] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#4f46e5] hover:scale-[1.02] hover:shadow-lg hover:shadow-[#6366f1]/20 transition-all"
        >
          <Plus size={18} />
          Add Application
        </button>
      </div>
      
      {/* Mobile Add Button */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="flex sm:hidden items-center justify-center gap-2 w-full bg-[#6366f1] text-white px-5 py-3 rounded-xl font-medium hover:bg-[#4f46e5] mb-4 shrink-0 shadow-lg shadow-[#6366f1]/20"
      >
        <Plus size={18} />
        Add Application
      </button>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 shrink-0">
        <StatsCard title="Total Applications" count={totalJobs} subtitle={totalJobs > 0 ? `↑ 1 this week` : null} icon={Briefcase} color="slate" delay={0} />
        <StatsCard title="Applied" count={stats.Applied || 0} icon={CheckCircle} color="indigo" delay={100} />
        <StatsCard title="Interview" count={stats.Interview || 0} icon={Calendar} color="amber" delay={200} />
        <StatsCard title="Rejected" count={stats.Rejected || 0} icon={XCircle} color="red" delay={300} />
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 flex-1 min-h-0 pb-2">
        
        {/* Left Col: Table */}
        <div className="xl:col-span-3 min-h-0 flex flex-col">
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl overflow-hidden shadow-sm h-full flex flex-col">
            <div className="px-4 py-3 border-b border-[#334155] shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-lg font-semibold text-[#f1f5f9] whitespace-nowrap">Recent Applications</h2>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-40 md:w-48">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg pl-8 pr-3 py-1.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-[#6366f1]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <select
                  className="bg-[#0f172a] border border-[#334155] rounded-lg px-2 py-1.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-[#6366f1]"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <select
                  className="bg-[#0f172a] border border-[#334155] rounded-lg px-2 py-1.5 text-sm text-[#f1f5f9] focus:outline-none focus:border-[#6366f1]"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="-createdAt">Newest</option>
                  <option value="company">Company A-Z</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className="p-16 text-center text-[#94a3b8] flex-1 flex flex-col justify-center items-center">
                <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-[#6366f1] rounded-full mb-3"></div>
                <p className="font-medium">Loading applications...</p>
              </div>
            ) : (
              <div className="flex-1 overflow-auto">
                <JobTable 
                  jobs={jobs} 
                  onDelete={handleDeleteJob} 
                  onEditNotes={handleOpenNotes} 
                  onUpdateStatus={handleUpdateStatus}
                  onEditJob={handleOpenEditJob}
                />
              </div>
            )}
            
            {totalPages > 1 && (
              <div className="px-6 py-2.5 border-t border-[#334155] shrink-0 flex justify-between items-center bg-[#1e293b]">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1 text-sm bg-[#0f172a] hover:bg-[#334155] border border-[#334155] rounded-lg disabled:opacity-50 transition-colors text-[#f1f5f9]"
                >
                  Previous
                </button>
                <span className="text-sm text-[#94a3b8]">Page {page} of {totalPages}</span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 text-sm bg-[#0f172a] hover:bg-[#334155] border border-[#334155] rounded-lg disabled:opacity-50 transition-colors text-[#f1f5f9]"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Chart & Upcoming Interviews */}
        <div className="xl:col-span-2 min-h-0 flex flex-col gap-4 h-full">
          <div className="flex-1 min-h-0 w-full">
            <UpcomingInterviews />
          </div>
          <div className="shrink-0 w-full">
            <OverviewChart jobs={jobs} />
          </div>
        </div>

      </div>

      <AddJobModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddJob} 
      />

      <EditJobModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleEditJob}
        job={jobToEdit}
      />

      <NotesModal
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        job={selectedJob}
        onSaveNotes={handleSaveNotes}
      />
    </div>
  );
};

export default Dashboard;