import React from 'react';
import { Lightbulb, ChevronRight } from 'lucide-react';

const SuggestionsCard = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) return null;

  // Sort: high -> medium -> low
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  const sorted = [...suggestions].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  const badgeStyles = {
    high: 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20',
    medium: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20',
    low: 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20'
  };

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 mt-4 shadow-sm">
      <h3 className="text-[15px] font-bold text-[#f1f5f9] flex items-center gap-3 mb-6">
        <Lightbulb size={18} className="text-[#f59e0b]" />
        How to Improve
      </h3>
      <div className="space-y-4">
        {sorted.map((sug, i) => (
          <div key={i} className="flex items-center gap-4 cursor-pointer group">
            <div className="w-1 rounded-full h-5 shrink-0" style={{ backgroundColor: sug.priority === 'high' ? '#ef4444' : sug.priority === 'medium' ? '#f59e0b' : '#22c55e' }}></div>
            <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-md shrink-0 border ${badgeStyles[sug.priority]}`}>
              {sug.priority}
            </span>
            <p className="text-[13px] text-[#94a3b8] flex-1 truncate group-hover:text-[#f1f5f9] transition-colors">{sug.text}</p>
            <ChevronRight size={16} className="text-[#334155] group-hover:text-[#94a3b8] transition-colors shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionsCard;
