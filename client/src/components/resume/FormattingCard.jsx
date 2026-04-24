import React from 'react';
import { Type, List, Mail, Phone, Link2, MapPin, LayoutTemplate } from 'lucide-react';

const FormattingCard = ({ formatting }) => {
  const { wordCount, wordCountLabel, bulletPoints, hasEmail, hasPhone, hasLinks, hasLocation = true } = formatting;

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 shadow-sm mt-4">
      <h3 className="text-[15px] font-bold text-[#f1f5f9] flex items-center gap-3 mb-6">
        <LayoutTemplate size={18} className="text-[#a855f7]" />
        Formatting Quality
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-transparent rounded-xl border border-[#334155] flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-[#94a3b8]">
            <Type size={14} />
            <span className="text-[12px] font-medium">Word Count</span>
          </div>
          <div className="flex items-center gap-3 mt-auto">
            <span className="text-2xl font-bold text-[#f1f5f9]">{wordCount}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              wordCountLabel === 'Ideal' ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-[#f59e0b]/10 text-[#f59e0b]'
            }`}>
              {wordCountLabel}
            </span>
          </div>
        </div>

        <div className="p-4 bg-transparent rounded-xl border border-[#334155] flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-[#94a3b8]">
            <List size={14} />
            <span className="text-[12px] font-medium">Bullet Points</span>
          </div>
          <div className="flex items-center gap-3 mt-auto">
            <span className="text-2xl font-bold text-[#f1f5f9]">{bulletPoints}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#3b82f6]/10 text-[#3b82f6]">Good</span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-transparent rounded-xl border border-[#334155]">
        <h4 className="text-[12px] font-medium text-[#94a3b8] mb-4">Essentials Detected</h4>
        <div className="flex justify-between items-center px-2">
          <div className={`flex flex-col items-center gap-1.5 ${hasEmail ? 'text-[#22c55e]' : 'text-[#475569]'}`}>
            <Mail size={18} />
            <span className="text-[10px] font-medium">Email</span>
          </div>
          <div className={`flex flex-col items-center gap-1.5 ${hasPhone ? 'text-[#22c55e]' : 'text-[#475569]'}`}>
            <Phone size={18} />
            <span className="text-[10px] font-medium">Phone</span>
          </div>
          <div className={`flex flex-col items-center gap-1.5 ${hasLinks ? 'text-[#22c55e]' : 'text-[#475569]'}`}>
            <Link2 size={18} />
            <span className="text-[10px] font-medium">Link</span>
          </div>
          <div className={`flex flex-col items-center gap-1.5 ${hasLocation ? 'text-[#22c55e]' : 'text-[#475569]'}`}>
            <MapPin size={18} />
            <span className="text-[10px] font-medium">Location</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormattingCard;
