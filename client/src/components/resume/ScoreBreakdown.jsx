import React from 'react';

const ScoreBreakdown = ({ label, percentage, colorClass }) => {
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
        <span className="text-slate-500 dark:text-slate-400">{percentage}%</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${colorClass}`} 
          style={{ width: `${percentage}%`, transition: 'width 1s ease-out' }}
        ></div>
      </div>
    </div>
  );
};

export default ScoreBreakdown;
