import React from 'react';
import { Lightbulb } from 'lucide-react';

const SuggestionsCard = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) return null;

  // Sort: high -> medium -> low
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  const sorted = [...suggestions].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  const priorityStyles = {
    high: 'border-l-red-500 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400',
    medium: 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-700 dark:text-yellow-400',
    low: 'border-l-green-500 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400'
  };

  const badgeStyles = {
    high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    low: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
  };

  return (
    <div className="saas-card p-6 mt-4">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
        <Lightbulb size={20} className="text-yellow-500" />
        How to Improve
      </h3>
      <div className="space-y-3">
        {sorted.map((sug, i) => (
          <div key={i} className={`flex items-start gap-3 p-3 rounded-r-lg border-l-4 ${priorityStyles[sug.priority]}`}>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded flex-shrink-0 mt-0.5 ${badgeStyles[sug.priority]}`}>
              {sug.priority}
            </span>
            <p className="text-sm font-medium">{sug.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionsCard;
