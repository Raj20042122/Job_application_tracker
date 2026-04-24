import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, Briefcase, ExternalLink, FileText } from 'lucide-react';

const JobTable = ({ jobs, onEditNotes, onDelete, onUpdateStatus, onEditJob }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'bg-[#6366f1]/10 text-[#6366f1] border-[#6366f1]/20 focus:ring-[#6366f1]/50';
      case 'Interview': return 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20 focus:ring-[#f59e0b]/50';
      case 'Offer': return 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20 focus:ring-[#22c55e]/50';
      case 'Rejected': return 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20 focus:ring-[#ef4444]/50';
      default: return 'bg-[#334155]/30 text-[#94a3b8] border-[#334155] focus:ring-[#334155]/50';
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
      <div className="p-16 text-center border-t border-[#334155] h-full flex flex-col justify-center">
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
      <table className="w-full relative">
        <thead className="sticky top-0 bg-[#1e293b] z-10 shadow-sm">
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
                  <div className="w-10 h-10 rounded-full bg-[#0f172a] border border-[#334155] flex items-center justify-center text-[#f1f5f9] font-bold text-sm shadow-sm shrink-0">
                    {getInitials(job.company)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[#f1f5f9] font-medium truncate" title={job.title || job.jobTitle}>
                        {job.title || job.jobTitle}
                      </p>
                      {job.link && (
                        <a 
                          href={job.link} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[#6366f1] hover:text-[#4f46e5] hover:scale-110 transition-all shrink-0" 
                          title="View Job Post"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                    <p className="text-[#94a3b8] text-sm truncate" title={job.company}>{job.company}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <select
                  value={job.status}
                  onChange={(e) => onUpdateStatus(job._id, e.target.value)}
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[#1e293b] appearance-none pr-6 bg-no-repeat bg-right ${getStatusColor(job.status)}`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundSize: '14px',
                    backgroundPosition: 'calc(100% - 6px) center'
                  }}
                >
                  <option value="Applied" className="bg-[#0f172a] text-[#f1f5f9]">Applied</option>
                  <option value="Interview" className="bg-[#0f172a] text-[#f1f5f9]">Interview</option>
                  <option value="Offer" className="bg-[#0f172a] text-[#f1f5f9]">Offer</option>
                  <option value="Rejected" className="bg-[#0f172a] text-[#f1f5f9]">Rejected</option>
                </select>
              </td>
              <td className="px-6 py-4 text-[#94a3b8] text-sm whitespace-nowrap">
                {timeAgo(job.createdAt || job.date || job.dateApplied)}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEditNotes(job)}
                    className="p-2 text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#334155] rounded-lg transition-colors"
                    title="View/Edit Notes"
                  >
                    <FileText size={16} />
                  </button>
                  <button
                    onClick={() => onEditJob(job)}
                    className="p-2 text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#334155] rounded-lg transition-colors"
                    title="Edit Job Details"
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
