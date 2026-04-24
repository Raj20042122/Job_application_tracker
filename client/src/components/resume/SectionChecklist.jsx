import React from 'react';
import { CheckCircle2, XCircle, ListChecks } from 'lucide-react';

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
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 shadow-sm">
      <h3 className="text-[15px] font-bold text-[#f1f5f9] flex items-center gap-3 mb-6">
        <ListChecks size={18} className="text-[#94a3b8]" />
        Required Sections
      </h3>
      <div className="space-y-3">
        {Object.entries(sections).map(([key, present]) => (
          <div 
            key={key} 
            className={`flex items-center justify-between p-3.5 rounded-lg border transition-colors ${
              present 
                ? 'bg-transparent border-[#334155]' 
                : 'bg-[#ef4444]/5 border-[#ef4444]/20'
            }`}
          >
            <span className={`text-[13px] font-medium ${present ? 'text-[#94a3b8]' : 'text-[#ef4444]'}`}>
              {sectionLabels[key]}
            </span>
            {present ? (
              <CheckCircle2 size={16} className="text-[#22c55e]" />
            ) : (
              <XCircle size={16} className="text-[#ef4444]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionChecklist;
