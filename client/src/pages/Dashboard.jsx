import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Plus, Briefcase, Calendar, XCircle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

import StatsCard from "../components/StatsCard";
import JobTable from "../components/JobTable";
import NotesModal from "../components/NotesModal";
import AddJobModal from "../components/AddJobModal";
import OverviewChart from "../components/OverviewChart";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await API.get("/jobs");
      setJobs(res.data.data || res.data);
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
    <div className="w-full pb-12">
      <div className="flex justify-between items-end mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-[#f1f5f9] tracking-tight mb-1.5">Good morning, {username} 👋</h1>
          <p className="text-[#94a3b8] font-medium">Here's your job search summary</p>
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
        className="flex sm:hidden items-center justify-center gap-2 w-full bg-[#6366f1] text-white px-5 py-3 rounded-xl font-medium hover:bg-[#4f46e5] mb-6 shadow-lg shadow-[#6366f1]/20"
      >
        <Plus size={18} />
        Add Application
      </button>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatsCard title="Total Applications" count={totalJobs} subtitle={totalJobs > 0 ? `↑ 1 this week` : null} icon={Briefcase} color="slate" delay={0} />
        <StatsCard title="Applied" count={stats.Applied || 0} icon={CheckCircle} color="indigo" delay={100} />
        <StatsCard title="Interview" count={stats.Interview || 0} icon={Calendar} color="amber" delay={200} />
        <StatsCard title="Rejected" count={stats.Rejected || 0} icon={XCircle} color="red" delay={300} />
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        
        {/* Left Col: Table */}
        <div className="xl:col-span-3">
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl overflow-hidden shadow-sm h-full">
            <div className="px-6 py-5 border-b border-[#334155]">
              <h2 className="text-lg font-semibold text-[#f1f5f9]">Recent Applications</h2>
            </div>
            {loading ? (
              <div className="p-16 text-center text-[#94a3b8]">
                <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-[#6366f1] rounded-full mb-3"></div>
                <p className="font-medium">Loading applications...</p>
              </div>
            ) : (
              <JobTable 
                jobs={jobs} 
                onDelete={handleDeleteJob} 
                onEditNotes={handleOpenNotes} 
              />
            )}
          </div>
        </div>

        {/* Right Col: Chart */}
        <div className="xl:col-span-2">
          <OverviewChart jobs={jobs} />
        </div>

      </div>

      <AddJobModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddJob} 
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