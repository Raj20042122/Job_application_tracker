import React, { useState, useEffect } from "react";
import {
  X,
  Building,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  User,
  Mail,
  ExternalLink,
  Edit2,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";

const STATUS_BADGES = {
  Wishlist: "badge-wishlist",
  Applied: "badge-applied",
  OA: "badge-oa",
  Interview: "badge-interview",
  Offer: "badge-offer",
  Rejected: "badge-rejected"
};

const ApplicationDetailsModal = ({
  isOpen,
  onClose,
  job,
  onUpdateStatus,
  onEdit,
  onDelete
}) => {
  const [notes, setNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  useEffect(() => {
    if (job) {
      setNotes(job.notes || "");
      setNotesSaved(false);
    }
  }, [job]);

  if (!isOpen || !job) return null;

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      await onEdit(job._id, { notes });
      setNotesSaved(true);
      toast.success("Notes saved");
      setTimeout(() => setNotesSaved(false), 2500);
    } catch (err) {
      toast.error("Failed to save notes");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const getInitials = (name) => {
    return name ? name.substring(0, 2).toUpperCase() : "AP";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="jt-card max-w-2xl w-full max-h-[90vh] flex flex-col border border-white/10 shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/[0.06] bg-[#0C101A] flex items-start justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 flex items-center justify-center text-white font-bold text-base shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              {getInitials(job.company)}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-white tracking-tight">{job.title}</h2>
                {job.link && (
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                    title="Open Job Listing"
                  >
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{job.company}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(job)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              title="Edit Details"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(job._id)}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete Application"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Status & Key Metadata Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Stage
              </span>
              <select
                value={job.status}
                onChange={(e) => onUpdateStatus(job._id, e.target.value)}
                className={`w-full text-xs font-bold px-2.5 py-1.5 rounded-lg cursor-pointer outline-none ${
                  STATUS_BADGES[job.status] || "badge-applied"
                }`}
              >
                <option value="Wishlist" className="bg-[#0B0E17] text-slate-300">Wishlist</option>
                <option value="Applied" className="bg-[#0B0E17] text-blue-300">Applied</option>
                <option value="OA" className="bg-[#0B0E17] text-purple-300">OA (Assessment)</option>
                <option value="Interview" className="bg-[#0B0E17] text-amber-300">Interview</option>
                <option value="Offer" className="bg-[#0B0E17] text-emerald-300">Offer</option>
                <option value="Rejected" className="bg-[#0B0E17] text-rose-300">Rejected</option>
              </select>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Salary
              </span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white mt-1">
                <DollarSign size={14} className="text-emerald-400" />
                <span>{job.salary || "Not specified"}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Location
              </span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white mt-1 truncate">
                <MapPin size={14} className="text-indigo-400 shrink-0" />
                <span className="truncate">{job.location || "Flexible / Unlisted"}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Date Added
              </span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white mt-1">
                <Calendar size={14} className="text-slate-400" />
                <span>{new Date(job.createdAt || job.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Interview Details Card */}
          {job.interviewDate && (
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Calendar size={18} />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Scheduled Interview</h4>
                <p className="text-sm font-semibold text-white mt-1">
                  {new Date(job.interviewDate).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                  {job.interviewTime ? ` at ${job.interviewTime}` : ""}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>Format: <strong className="text-slate-300">{job.interviewType || "Video call"}</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* Recruiter Card */}
          {(job.recruiter?.name || job.recruiter?.email) && (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Recruiter Contact
              </span>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                {job.recruiter?.name && (
                  <div className="flex items-center gap-2 text-slate-200 font-medium">
                    <User size={14} className="text-indigo-400" />
                    <span>{job.recruiter.name}</span>
                  </div>
                )}
                {job.recruiter?.email && (
                  <a
                    href={`mailto:${job.recruiter.email}`}
                    className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    <Mail size={14} />
                    <span>{job.recruiter.email}</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Notes Section with Quick Save */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Application Notes & Preparation
              </label>
              {notesSaved && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium animate-in fade-in">
                  <CheckCircle2 size={13} />
                  Saved
                </span>
              )}
            </div>
            <textarea
              rows={5}
              placeholder="Record your notes, interview questions asked, follow-ups, and recruiter impressions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="jt-input resize-y text-xs leading-relaxed"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                className="jt-btn-secondary py-1.5 px-3.5 text-xs flex items-center gap-1.5"
              >
                <Save size={13} />
                <span>{isSavingNotes ? "Saving..." : "Save Notes"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsModal;
