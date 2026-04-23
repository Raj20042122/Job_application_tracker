import React, { useRef } from "react";
import { Trash2, Building2 } from "lucide-react";
import gsap from "gsap";

const statusStyles = {
  Applied: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  Interview: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  Rejected: "bg-red-500/10 text-red-400 border border-red-500/20",
  Offer: "bg-green-500/10 text-green-400 border border-green-500/20",
};

const JobCard = ({ job, onDelete }) => {
  const cardRef = useRef(null);

  const handleHoverEnter = () => {
    gsap.to(cardRef.current, { scale: 1.02, duration: 0.3, ease: "power2.out" });
  };

  const handleHoverLeave = () => {
    gsap.to(cardRef.current, { scale: 1, duration: 0.3, ease: "power2.out" });
  };

  const handleDelete = () => {
    // Fade out & slide left before executing the delete callback
    gsap.to(cardRef.current, {
      x: -50,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => onDelete(job._id),
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleHoverEnter}
      onMouseLeave={handleHoverLeave}
      className="glass-card p-5 flex items-center justify-between group transition-colors hover:bg-white/[0.08]"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors group-hover:border-accent-violet/50 shadow-inner">
          {job.company ? job.company.charAt(0).toUpperCase() : <Building2 size={20} />}
        </div>
        <div>
          <h3 className="font-bold text-white text-lg">{job.title}</h3>
          <p className="text-slate-400 text-sm mt-0.5 flex items-center gap-2">
            {job.company}
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span>{new Date().toLocaleDateString()}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
            statusStyles[job.status] || "bg-white/10 text-white border-white/20"
          }`}
        >
          {job.status}
        </span>

        <button
          onClick={handleDelete}
          className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 border border-transparent hover:border-red-500/20"
          aria-label="Delete job"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default JobCard;
