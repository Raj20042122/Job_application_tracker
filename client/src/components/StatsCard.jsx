import React, { useEffect, useState } from 'react';

const StatsCard = ({ title, count, subtitle, icon: Icon, color, delay }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const colorStyles = {
    slate: "bg-[#334155]/20 text-[#94a3b8] ring-[#334155]/30",
    indigo: "bg-[#6366f1]/10 text-[#6366f1] ring-[#6366f1]/20",
    amber: "bg-[#f59e0b]/10 text-[#f59e0b] ring-[#f59e0b]/20",
    red: "bg-[#ef4444]/10 text-[#ef4444] ring-[#ef4444]/20",
    green: "bg-[#22c55e]/10 text-[#22c55e] ring-[#22c55e]/20"
  };

  return (
    <div className={`bg-[#1e293b] border border-[#334155] rounded-xl p-4 md:p-5 flex items-center justify-between transition-all duration-500 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <div className="flex items-center gap-3 md:gap-4">
        <div className={`p-2.5 rounded-full ring-1 ${colorStyles[color]} shrink-0`}>
          <Icon size={18} />
        </div>
        <div className="flex flex-col">
          <p className="text-[#94a3b8] font-medium text-sm">{title}</p>
          {subtitle && <span className="text-[10px] sm:text-xs text-[#94a3b8]">{subtitle}</span>}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-[#f1f5f9] tracking-tight">{count}</h3>
    </div>
  );
};

export default StatsCard;
