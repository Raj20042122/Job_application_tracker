import React, { useState } from 'react';
import { Target, ChevronUp, ChevronDown } from 'lucide-react';

const KeywordPanel = ({ matchPercent, matched, missing }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden shadow-sm">
      <div 
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-[#334155]/20 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-[15px] font-bold text-[#f1f5f9] flex items-center gap-3">
          <Target size={18} className="text-[#6366f1]" />
          Keyword Match
        </h3>
        {expanded ? <ChevronUp size={18} className="text-[#94a3b8]" /> : <ChevronDown size={18} className="text-[#94a3b8]" />}
      </div>

      {expanded && (
        <div className="px-6 pb-6 border-t border-[#334155]/50 pt-6">
          <div className="mb-8">
            <h4 className="text-[13px] font-semibold text-[#f1f5f9] mb-4">Matched Keywords ({matched.length})</h4>
            <div className="flex flex-wrap gap-2.5">
              {matched.length === 0 ? (
                <p className="text-[13px] text-[#94a3b8] italic">No keywords matched.</p>
              ) : (
                matched.map((kw, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1.5 bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 rounded-lg text-[13px] font-medium"
                  >
                    {kw}
                  </span>
                ))
              )}
            </div>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-[#f1f5f9] mb-4">Missing Keywords ({missing.length})</h4>
            <div className="flex flex-wrap gap-2.5">
              {missing.length === 0 ? (
                <p className="text-[13px] text-[#94a3b8] italic">Great job! No major missing keywords.</p>
              ) : (
                missing.map((kw, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1.5 bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20 rounded-lg text-[13px] font-medium"
                  >
                    {kw}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordPanel;
