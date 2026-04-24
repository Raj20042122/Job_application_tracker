import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const OverviewChart = ({ jobs }) => {
  const stats = jobs.reduce(
    (acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    },
    { Applied: 0, Interview: 0, Rejected: 0, Offer: 0 }
  );

  const data = [
    { name: 'Applied', value: stats.Applied, color: '#6366f1' },
    { name: 'Interview', value: stats.Interview, color: '#f59e0b' },
    { name: 'Rejected', value: stats.Rejected, color: '#ef4444' },
    { name: 'Offer', value: stats.Offer, color: '#22c55e' }
  ].filter(item => item.value > 0);

  if (jobs.length === 0) {
    return (
      <div className="bg-[#151b2b] border border-white/5 rounded-2xl p-6 h-full flex flex-col items-center justify-center min-h-[350px] shadow-sm">
        <div className="w-32 h-32 rounded-full border-4 border-dashed border-white/10 flex items-center justify-center mb-4">
          <p className="text-[#94a3b8] text-sm">No data</p>
        </div>
        <h3 className="text-white font-medium">Application Overview</h3>
      </div>
    );
  }

  const totalJobs = jobs.length;

  return (
    <div className="bg-[#151b2b] border border-white/5 rounded-2xl p-5 h-full flex flex-col shadow-sm">
      <h3 className="text-white font-semibold text-lg">Application Overview</h3>
      <p className="text-[#94a3b8] text-[13px] mb-6">Distribution by status</p>
      
      <div className="flex flex-col xl:flex-row items-center justify-between gap-6 mt-auto flex-1">
        <div className="relative flex justify-center items-center w-[160px] h-[160px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={55}
                outerRadius={75}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.05)', color: '#f1f5f9', borderRadius: '8px' }}
                itemStyle={{ color: '#f1f5f9' }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Text overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-white leading-none mb-1">{totalJobs}</span>
            <span className="text-[11px] text-[#94a3b8] font-medium tracking-wide uppercase">Total</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full xl:w-auto xl:flex-1 justify-center">
          {data.map((item) => (
            <div key={item.name} className="flex justify-between items-center px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}80` }} />
                <span className="text-[14px] font-medium text-[#94a3b8]">{item.name}</span>
              </div>
              <span className="text-[15px] font-bold text-white ml-4">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewChart;
