import React from 'react';
import { AlertCircle } from 'lucide-react';

const IssuesCard = ({ issues }) => {
  if (!issues || issues.length === 0) return null;

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 mt-4 shadow-sm">
      <h3 className="text-[15px] font-bold text-[#f1f5f9] flex items-center gap-3 mb-6">
        <AlertCircle size={18} className="text-[#ef4444]" />
        Issues Found
      </h3>
      <ul className="space-y-3">
        {issues.map((issue, i) => (
          <li key={i} className="flex items-start gap-3 text-[13px] text-[#94a3b8]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8] mt-1.5 shrink-0"></span>
            <span className="leading-relaxed">{issue}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IssuesCard;
