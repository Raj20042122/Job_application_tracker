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
    <div className={`bg-[#1e293b] border border-[#334155] rounded-xl p-5 transition-all duration-500 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-full ring-1 ${colorStyles[color]} mb-4`}>
          <Icon size={22} />
        </div>
      </div>
      <div>
        <p className="text-[#94a3b8] font-medium text-sm mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold text-[#f1f5f9] tracking-tight">{count}</h3>
          {subtitle && <span className="text-xs text-[#94a3b8]">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
