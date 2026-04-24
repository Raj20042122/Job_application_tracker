import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Plus, Briefcase, Calendar, XCircle, CheckCircle, Search, FileText, TrendingUp } from "lucide-react";
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
      <div className="flex justify-between items-end mb-6 mt-2 shrink-0">
        <div>
          <h1 className="text-2xl md:text-[28px] font-bold text-white tracking-tight mb-1.5">Good morning, {username.toUpperCase()} 👋</h1>
          <p className="text-[#9CA3AF] font-medium text-[15px]">Here's your job search summary</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white px-5 py-2.5 rounded-xl font-medium hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all"
        >
          <Plus size={18} />
          Add Application
        </button>
      </div>
      
      {/* Mobile Add Button */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="flex sm:hidden items-center justify-center gap-2 w-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white px-5 py-3 rounded-xl font-medium hover:scale-[1.02] mb-6 shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all"
      >
        <Plus size={18} />
        Add Application
      </button>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
        <StatsCard title="Total Applications" count={totalJobs} subtitle={totalJobs > 0 ? `↑ 1 this week` : null} icon={Briefcase} color="slate" delay={0} />
        <StatsCard title="Applied" count={stats.Applied || 0} icon={CheckCircle} color="indigo" delay={100} />
        <StatsCard title="Interview" count={stats.Interview || 0} icon={Calendar} color="amber" delay={200} />
        <StatsCard title="Rejected" count={stats.Rejected || 0} icon={XCircle} color="red" delay={300} />
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-6 flex-1 min-h-0 pb-2">
        
        {/* Left Col: Table (70%) */}
        <div className="xl:col-span-7 min-h-0 flex flex-col">
          <div className="bg-[rgba(17,25,40,0.75)] border border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden shadow-sm h-full flex flex-col hover:border-white/10 transition-colors">
            <div className="px-5 py-5 border-b border-white/5 shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-[17px] font-semibold text-white whitespace-nowrap flex items-center gap-2.5">
                <FileText size={18} className="text-[#6366f1]" />
                Recent Applications
              </h2>
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-48 md:w-56">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    className="w-full bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-lg pl-8 pr-3 py-1.5 text-[13px] text-white focus:outline-none focus:border-[#6366f1] transition-all placeholder:text-[#6B7280]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <select
                  className="bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-1.5 text-[13px] text-[#E5E7EB] focus:outline-none focus:border-[#6366f1] transition-all outline-none cursor-pointer"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="" className="bg-[#0B1220]">All Status</option>
                  <option value="Applied" className="bg-[#0B1220]">Applied</option>
                  <option value="Interview" className="bg-[#0B1220]">Interview</option>
                  <option value="Offer" className="bg-[#0B1220]">Offer</option>
                  <option value="Rejected" className="bg-[#0B1220]">Rejected</option>
                </select>
                <select
                  className="bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-1.5 text-[13px] text-[#E5E7EB] focus:outline-none focus:border-[#6366f1] transition-all outline-none cursor-pointer"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="-createdAt" className="bg-[#0B1220]">Newest</option>
                  <option value="company" className="bg-[#0B1220]">Company A-Z</option>
                  <option value="status" className="bg-[#0B1220]">Status</option>
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className="p-16 text-center text-[#9CA3AF] flex-1 flex flex-col justify-center items-center">
                <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-[#6366f1] rounded-full mb-3"></div>
                <p className="font-medium text-[13px]">Loading applications...</p>
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
          </div>
        </div>

        {/* Right Col: Chart & Upcoming Interviews (30%) */}
        <div className="xl:col-span-3 min-h-0 flex flex-col gap-6 h-full">
          <div className="flex-1 min-h-0 w-full overflow-hidden">
            <UpcomingInterviews />
          </div>
          <div className="shrink-0 w-full">
            <OverviewChart jobs={jobs} />
          </div>
          {/* Motivation Card */}
          <div className="shrink-0 w-full bg-[rgba(17,25,40,0.75)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-4 flex items-center gap-4 hover:shadow-[0_0_20px_rgba(34,197,94,0.05)] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 flex items-center justify-center shrink-0">
              <TrendingUp size={18} className="text-[#22C55E]" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-semibold text-white tracking-wide">Keep going! You've applied to 33% more jobs this week.</p>
              <p className="text-[12px] text-[#9CA3AF] mt-0.5">Stay consistent and you'll see great results.</p>
            </div>
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