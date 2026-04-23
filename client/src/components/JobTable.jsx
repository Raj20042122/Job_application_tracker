import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, Briefcase } from 'lucide-react';

const JobTable = ({ jobs, onEditNotes, onDelete }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'bg-[#6366f1]/10 text-[#6366f1] border-[#6366f1]/20';
      case 'Interview': return 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20';
      case 'Offer': return 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20';
      case 'Rejected': return 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20';
      default: return 'bg-[#334155]/30 text-[#94a3b8] border-[#334155]';
    }
  };

  const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : '??';

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return "Today";
    if (diffDays < 30) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (jobs.length === 0) {
    return (
      <div className="p-16 text-center border-t border-[#334155]">
        <div className="w-16 h-16 bg-[#0f172a] rounded-full flex items-center justify-center mx-auto mb-4 text-[#334155]">
          <Briefcase size={28} />
        </div>
        <h3 className="text-lg font-medium text-[#f1f5f9] mb-1">No applications found</h3>
        <p className="text-[#94a3b8] max-w-sm mx-auto">
          Get started by adding a new job application.
        </p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#334155] text-left text-[#94a3b8] text-xs font-semibold tracking-wider uppercase">
            <th className="px-6 py-4">Job Details</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#334155]">
          {jobs.map((job) => (
            <tr key={job._id} className="group hover:bg-[#334155]/10 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#0f172a] border border-[#334155] flex items-center justify-center text-[#f1f5f9] font-bold text-sm shadow-sm">
                    {getInitials(job.company)}
                  </div>
                  <div>
                    <p className="text-[#f1f5f9] font-medium">{job.title || job.jobTitle}</p>
                    <p className="text-[#94a3b8] text-sm">{job.company}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                  {job.status}
                </span>
              </td>
              <td className="px-6 py-4 text-[#94a3b8] text-sm">
                {timeAgo(job.createdAt || job.date || job.dateApplied)}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEditNotes(job)}
                    className="p-2 text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#334155] rounded-lg transition-colors"
                    title="Edit Notes"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(job._id)}
                    className="p-2 text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#ef4444]/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobTable;
