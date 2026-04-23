import React from 'react';
import { X } from 'lucide-react';

const NotesModal = ({ isOpen, onClose, job, onSaveNotes }) => {
  const [notes, setNotes] = React.useState('');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (job) {
      setNotes(job.notes || '');
    }
  }, [job]);

  React.useEffect(() => {
    if (isOpen) {
      setMounted(true);
    } else {
      setTimeout(() => setMounted(false), 300);
    }
  }, [isOpen]);

  if (!isOpen && !mounted) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-[#1e293b] border border-[#334155] rounded-2xl w-full max-w-md shadow-2xl transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <div className="px-6 py-4 border-b border-[#334155] flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#f1f5f9]">Job Notes</h2>
          <button onClick={onClose} className="text-[#94a3b8] hover:text-[#f1f5f9] transition-colors p-1">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-[#94a3b8] mb-4">
            Notes for <span className="font-medium text-[#f1f5f9]">{job?.jobTitle}</span> at <span className="font-medium text-[#f1f5f9]">{job?.company}</span>
          </p>
          <textarea
            className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-[#f1f5f9] focus:outline-none focus:border-[#6366f1] transition-colors resize-none"
            rows="5"
            placeholder="Add interview details, follow-ups, or thoughts..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-[#334155] text-[#f1f5f9] hover:bg-[#334155]/50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => onSaveNotes(job._id, notes)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#6366f1] text-white hover:bg-[#4f46e5] hover:scale-[1.02] hover:shadow-lg hover:shadow-[#6366f1]/20 transition-all font-medium"
            >
              Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesModal;
