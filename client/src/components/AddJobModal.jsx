import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AddJobModal = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState('Applied');
  const [link, setLink] = useState('');
  const [notes, setNotes] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
    } else {
      setTimeout(() => setMounted(false), 300);
    }
  }, [isOpen]);

  if (!isOpen && !mounted) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ title, company, status, link, notes });
    setTitle('');
    setCompany('');
    setStatus('Applied');
    setLink('');
    setNotes('');
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-[#1e293b] border border-[#334155] rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden shadow-2xl transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <div className="px-6 py-4 border-b border-[#334155] flex justify-between items-center shrink-0">
          <h2 className="text-lg font-semibold text-[#f1f5f9]">Add New Application</h2>
          <button type="button" onClick={onClose} className="text-[#94a3b8] hover:text-[#f1f5f9] transition-colors p-1">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto custom-scrollbar space-y-4 flex-1">
            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">Job Title</label>
              <input
                type="text"
                required
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-[#f1f5f9] focus:outline-none focus:border-[#6366f1] transition-colors"
                placeholder="e.g. Frontend Developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">Company</label>
              <input
                type="text"
                required
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-[#f1f5f9] focus:outline-none focus:border-[#6366f1] transition-colors"
                placeholder="e.g. Acme Corp"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">Job Link (Optional)</label>
              <input
                type="url"
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-[#f1f5f9] focus:outline-none focus:border-[#6366f1] transition-colors"
                placeholder="https://..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">Status</label>
              <select
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-[#f1f5f9] focus:outline-none focus:border-[#6366f1] transition-colors"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">Notes (Optional)</label>
              <textarea
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-[#f1f5f9] focus:outline-none focus:border-[#6366f1] transition-colors"
                placeholder="Any details to remember..."
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
          </div>
          
          <div className="p-6 border-t border-[#334155] bg-[#1e293b] shrink-0 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-[#334155] text-[#f1f5f9] hover:bg-[#334155]/50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#6366f1] text-white hover:bg-[#4f46e5] hover:scale-[1.02] hover:shadow-lg hover:shadow-[#6366f1]/20 transition-all font-medium"
            >
              Add Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobModal;
