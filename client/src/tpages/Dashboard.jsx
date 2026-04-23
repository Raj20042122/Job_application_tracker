import React, { useEffect, useState } from "react";
import API from "../services/api";
import {
  Briefcase,
  Search,
  Trash2,
  LogOut,
  PlusCircle,
  BarChart3,
} from "lucide-react";

const statusColors = {
  Applied: "bg-blue-100 text-blue-700",
  Interview: "bg-yellow-100 text-yellow-700",
  Rejected: "bg-red-100 text-red-700",
  Offer: "bg-green-100 text-green-700",
};

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobStatus, setJobStatus] = useState("Applied");

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, [search, status]);

  const fetchJobs = async () => {
    try {
      let url = `/jobs?`;
      if (search) url += `search=${search}&`;
      if (status) url += `status=${status}`;

      const res = await API.get(url);
      setJobs(res.data.data || res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchStats = async () => {
    const res = await API.get("/jobs/stats");
    setStats(res.data);
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    await API.post("/jobs", { title, company, status: jobStatus });

    setTitle("");
    setCompany("");
    setJobStatus("Applied");

    fetchJobs();
    fetchStats();
  };

  const deleteJob = async (id) => {
    await API.delete(`/jobs/${id}`);
    fetchJobs();
    fetchStats();
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Navbar */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Briefcase size={20} /> Job Tracker
        </h1>

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="p-6 max-w-6xl mx-auto">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {["Applied", "Interview", "Rejected"].map((key) => (
            <div key={key} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
              <div>
                <p className="text-gray-500">{key}</p>
                <h2 className="text-2xl font-bold">{stats[key] || 0}</h2>
              </div>
              <BarChart3 className="text-gray-400" />
            </div>
          ))}
        </div>

        {/* Add Job */}
        <form onSubmit={handleAddJob} className="bg-white p-4 rounded-xl shadow mb-6">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <PlusCircle size={18} /> Add Job
          </h2>

          <div className="grid grid-cols-4 gap-3">
            <input
              placeholder="Job Title"
              className="border p-2 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              placeholder="Company"
              className="border p-2 rounded"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />

            <select
              className="border p-2 rounded"
              value={jobStatus}
              onChange={(e) => setJobStatus(e.target.value)}
            >
              <option>Applied</option>
              <option>Interview</option>
              <option>Rejected</option>
              <option>Offer</option>
            </select>

            <button className="bg-blue-500 text-white rounded hover:bg-blue-600">
              Add
            </button>
          </div>
        </form>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <div className="flex items-center border rounded px-2 w-1/2">
            <Search size={16} className="text-gray-400" />
            <input
              placeholder="Search jobs..."
              className="p-2 w-full outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="border p-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All</option>
            <option>Applied</option>
            <option>Interview</option>
            <option>Rejected</option>
            <option>Offer</option>
          </select>
        </div>

        {/* Jobs */}
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">{job.title}</h3>
                <p className="text-gray-500">{job.company}</p>

                <span
                  className={`inline-block mt-2 px-3 py-1 text-sm rounded ${statusColors[job.status]}`}
                >
                  {job.status}
                </span>
              </div>

              <button
                onClick={() => deleteJob(job._id)}
                className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;