import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import AddEditJobModal from "./AddEditJobModal";
import api from "../services/api";
import toast from "react-hot-toast";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleCreateJob = async (jobData) => {
    try {
      await api.post("/jobs", jobData);
      toast.success("Job application created!");
      setIsAddModalOpen(false);
      // Dispatch custom event to tell child pages to refresh
      window.dispatchEvent(new CustomEvent("job-updated"));
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to create application.");
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-[#F1F5F9] flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenAddJob={() => setIsAddModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenAddJob={() => setIsAddModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ onOpenAddJob: () => setIsAddModalOpen(true) }} />
        </main>
      </div>

      {/* Global Add Application Modal */}
      <AddEditJobModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreateJob}
      />
    </div>
  );
};

export default Layout;
