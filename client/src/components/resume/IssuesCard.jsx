import React from 'react';
import { AlertCircle } from 'lucide-react';

const IssuesCard = ({ issues }) => {
  if (!issues || issues.length === 0) return null;

  return (
    <div className="saas-card p-6 border-l-4 border-l-red-500 mt-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
        <AlertCircle size={20} className="text-red-500" />
        Issues Found
      </h3>
      <ul className="space-y-2">
        {issues.map((issue, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
            <span className="min-w-[6px] h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></span>
            <span>{issue}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IssuesCard;
