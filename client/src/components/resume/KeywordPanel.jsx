import React from 'react';
import { Target } from 'lucide-react';

const KeywordPanel = ({ matchPercent, matched, missing }) => {
  return (
    <div className="saas-card p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Target size={20} className="text-indigo-500" />
          Keyword Match
        </h3>
        <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{matchPercent}%</span>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Matched Keywords ({matched.length})</h4>
        <div className="flex flex-wrap gap-2">
          {matched.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No keywords matched.</p>
          ) : (
            matched.map((kw, i) => (
              <span 
                key={i} 
                className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/50 rounded-full text-xs font-medium hover:-translate-y-0.5 transition-transform cursor-default"
              >
                {kw}
              </span>
            ))
          )}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Missing Keywords ({missing.length})</h4>
        <div className="flex flex-wrap gap-2">
          {missing.length === 0 ? (
            <p className="text-sm text-slate-500 italic">Great job! No major missing keywords.</p>
          ) : (
            missing.map((kw, i) => (
              <span 
                key={i} 
                className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50 rounded-full text-xs font-medium hover:-translate-y-0.5 transition-transform cursor-default"
              >
                {kw}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default KeywordPanel;
