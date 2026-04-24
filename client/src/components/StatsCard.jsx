import React, { useEffect, useState } from 'react';
import { MoreVertical, ArrowUp } from 'lucide-react';

const StatsCard = ({ title, count, subtitle, icon: Icon, color, delay }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const getColors = () => {
    if (color === 'indigo') return { iconBg: 'bg-[#6366f1]/10', iconColor: 'text-[#6366f1]', bar: 'bg-[#6366f1]' };
    if (color === 'amber') return { iconBg: 'bg-[#f59e0b]/10', iconColor: 'text-[#f59e0b]', bar: 'bg-[#f59e0b]' };
    if (color === 'red') return { iconBg: 'bg-[#ef4444]/10', iconColor: 'text-[#ef4444]', bar: 'bg-[#ef4444]' };
    return { iconBg: 'bg-[#3b82f6]/10', iconColor: 'text-[#3b82f6]', bar: 'bg-[#3b82f6]' };
  };

  const colors = getColors();
  const isTotal = title === "Total Applications";

  return (
    <div className={`group relative overflow-hidden bg-[rgba(17,25,40,0.75)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-5 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      
      {/* 3 Dots */}
      <div className="absolute top-4 right-4 text-[#6B7280] hover:text-[#E5E7EB] cursor-pointer transition-colors">
        <MoreVertical size={16} />
      </div>

      <div className="flex items-start gap-4 mb-4">
        {/* Icon Box */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colors.iconBg} ${colors.iconColor}`}>
          <Icon size={20} strokeWidth={2} />
        </div>
        
        {/* Title and Value */}
        <div className="flex flex-col mt-0.5">
          <p className="text-[#9CA3AF] text-[13px] font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-[#E5E7EB] leading-none">{count}</h3>
        </div>
      </div>
      
      {/* Footer Area: Subtitle or Progress Bar */}
      <div className="mt-2 h-4 flex items-end">
        {isTotal ? (
          <div className="flex items-center gap-1.5 text-[12px]">
            <ArrowUp size={12} className="text-[#22C55E]" strokeWidth={3} />
            <span className="text-[#22C55E] font-medium">1</span>
            <span className="text-[#6B7280]">this week</span>
          </div>
        ) : (
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${colors.bar}`}
              style={{ width: count > 0 ? `${Math.max(15, Math.min(100, (count / 10) * 100))}%` : '0%' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
