import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const SectionChecklist = ({ sections }) => {
  const sectionLabels = {
    contact: "Contact Information",
    summary: "Professional Summary",
    skills: "Skills / Technologies",
    experience: "Work Experience",
    education: "Education",
    projects: "Projects / Portfolio",
    certifications: "Certifications"
  };

  return (
    <div className="space-y-2">
      {Object.entries(sections).map(([key, present]) => (
        <div 
          key={key} 
          className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
            present 
              ? 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700' 
              : 'bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30'
          }`}
        >
          <span className={`text-sm font-medium ${present ? 'text-slate-700 dark:text-slate-300' : 'text-red-700 dark:text-red-400'}`}>
            {sectionLabels[key]}
          </span>
          {present ? (
            <CheckCircle2 size={18} className="text-green-500" />
          ) : (
            <XCircle size={18} className="text-red-500" />
          )}
        </div>
      ))}
    </div>
  );
};

export default SectionChecklist;
