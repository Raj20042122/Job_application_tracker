import React, { useState, useEffect } from "react";
import { X, Briefcase, Building, MapPin, DollarSign, Link as LinkIcon, User, Calendar, Clock, FileText } from "lucide-react";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  { value: "Wishlist", label: "Wishlist" },
  { value: "Applied", label: "Applied" },
  { value: "OA", label: "OA (Assessment)" },
  { value: "Interview", label: "Interview" },
  { value: "Offer", label: "Offer" },
  { value: "Rejected", label: "Rejected" }
];

const INTERVIEW_TYPES = [
  "Video call",
  "Phone call",
  "On-site",
  "Technical",
  "HR Round",
  "General",
  "Online Assessment"
];

const AddEditJobModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const isEditing = !!initialData?._id;

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("Applied");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [link, setLink] = useState("");
  const [recruiterName, setRecruiterName] = useState("");
  const [recruiterEmail, setRecruiterEmail] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewType, setInterviewType] = useState("Video call");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || initialData.role || "");
      setCompany(initialData.company || "");
      setStatus(initialData.status || "Applied");
      setLocation(initialData.location || "");
      setSalary(initialData.salary || "");
      setLink(initialData.link || initialData.jobUrl || "");
      setRecruiterName(initialData.recruiter?.name || initialData.recruiter || "");
      setRecruiterEmail(initialData.recruiter?.email || "");
      setInterviewDate(
        initialData.interviewDate
          ? new Date(initialData.interviewDate).toISOString().substring(0, 10)
          : ""
      );
      setInterviewTime(initialData.interviewTime || "");
      setInterviewType(initialData.interviewType || "Video call");
      setNotes(initialData.notes || "");
    } else {
      setTitle("");
      setCompany("");
      setStatus("Applied");
      setLocation("");
      setSalary("");
      setLink("");
      setRecruiterName("");
      setRecruiterEmail("");
      setInterviewDate("");
      setInterviewTime("");
      setInterviewType("Video call");
      setNotes("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) {
      toast.error("Role and Company are required.");
      return;
    }

    setSaving(true);
    const jobPayload = {
      title: title.trim(),
      company: company.trim(),
      status,
      location: location.trim(),
      salary: salary.trim(),
      link: link.trim(),
      recruiter: {
        name: recruiterName.trim(),
        email: recruiterEmail.trim()
      },
      notes: notes.trim(),
      interviewDate: interviewDate ? new Date(interviewDate) : undefined,
      interviewTime: interviewTime.trim(),
      interviewType
    };

    try {
      await onSave(jobPayload, initialData?._id);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="jt-card max-w-2xl w-full max-h-[92vh] flex flex-col border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between shrink-0 bg-[#0C101A]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Briefcase size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                {isEditing ? "Edit Application" : "New Job Application"}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isEditing ? "Update details and pipeline status" : "Add an opportunity to your tracking pipeline"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Job Title / Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Role / Title <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Briefcase size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="jt-input pl-9"
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Company <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Building size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Stripe, Linear, Vercel"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="jt-input pl-9"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Pipeline Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Status Stage
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="jt-input cursor-pointer"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#0B0E17] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Location
              </label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. Remote / SF, CA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="jt-input pl-9"
                />
              </div>
            </div>

            {/* Salary */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Salary Range
              </label>
              <div className="relative">
                <DollarSign size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. $140k - $165k"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="jt-input pl-9"
                />
              </div>
            </div>
          </div>

          {/* Job URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Job Posting URL
            </label>
            <div className="relative">
              <LinkIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="url"
                placeholder="https://jobs.lever.co/..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="jt-input pl-9"
              />
            </div>
          </div>

          {/* Recruiter Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Recruiter / Contact Name
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={recruiterName}
                  onChange={(e) => setRecruiterName(e.target.value)}
                  className="jt-input pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Recruiter Email
              </label>
              <input
                type="email"
                placeholder="recruiter@company.com"
                value={recruiterEmail}
                onChange={(e) => setRecruiterEmail(e.target.value)}
                className="jt-input"
              />
            </div>
          </div>

          {/* Interview Details (Shown highlighted when status is Interview or OA) */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
              <Calendar size={14} />
              <span>Interview or Assessment Scheduling</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="jt-input text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Time / Timezone
                </label>
                <div className="relative">
                  <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="e.g. 2:30 PM EST"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="jt-input pl-8 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Format
                </label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="jt-input text-xs cursor-pointer"
                >
                  {INTERVIEW_TYPES.map((t) => (
                    <option key={t} value={t} className="bg-[#0B0E17]">
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Personal Notes / Interview Prep
            </label>
            <textarea
              rows={3}
              placeholder="Add interview talking points, recruiter feedback, compensation notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="jt-input resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="jt-btn-secondary py-2 px-4 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="jt-btn-primary py-2 px-5 text-xs flex items-center gap-2"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>{isEditing ? "Save Changes" : "Create Application"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditJobModal;
