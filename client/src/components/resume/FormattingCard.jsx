import React from 'react';
import { Type, List, Mail, Phone, Link2 } from 'lucide-react';

const FormattingCard = ({ formatting }) => {
  const { wordCount, wordCountLabel, bulletPoints, hasEmail, hasPhone, hasLinks } = formatting;

  return (
    <div className="saas-card p-6 mt-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Formatting Quality</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="flex items-center gap-2 mb-2 text-slate-600 dark:text-slate-400">
            <Type size={16} />
            <span className="text-sm font-medium">Word Count</span>
          </div>
          <div className="flex items-end gap-2 mt-auto">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{wordCount}</span>
            <span className={`text-xs font-bold px-2 py-1 rounded mb-1 ${
              wordCountLabel === 'Ideal' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
            }`}>
              {wordCountLabel}
            </span>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="flex items-center gap-2 mb-2 text-slate-600 dark:text-slate-400">
            <List size={16} />
            <span className="text-sm font-medium">Bullet Points</span>
          </div>
          <div className="mt-auto">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{bulletPoints}</span>
            <span className="text-xs text-slate-500 ml-1">found</span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Essentials Detected</h4>
        <div className="flex gap-4">
          <div className={`flex flex-col items-center gap-1 ${hasEmail ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>
            <Mail size={20} />
            <span className="text-xs">Email</span>
          </div>
          <div className={`flex flex-col items-center gap-1 ${hasPhone ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>
            <Phone size={20} />
            <span className="text-xs">Phone</span>
          </div>
          <div className={`flex flex-col items-center gap-1 ${hasLinks ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>
            <Link2 size={20} />
            <span className="text-xs">Links</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormattingCard;
