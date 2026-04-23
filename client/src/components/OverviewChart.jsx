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
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 h-full flex flex-col items-center justify-center min-h-[350px]">
        <div className="w-32 h-32 rounded-full border-4 border-dashed border-[#334155] flex items-center justify-center mb-4">
          <p className="text-[#94a3b8] text-sm">No data</p>
        </div>
        <h3 className="text-[#f1f5f9] font-medium">Application Overview</h3>
      </div>
    );
  }

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 h-full flex flex-col">
      <h3 className="text-[#f1f5f9] font-semibold text-lg">Application Overview</h3>
      <p className="text-[#94a3b8] text-sm mb-6">Distribution by status</p>
      
      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9', borderRadius: '8px' }}
              itemStyle={{ color: '#f1f5f9' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-[#94a3b8]">{item.name} <span className="text-[#f1f5f9] ml-1 font-medium">{item.value}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewChart;
