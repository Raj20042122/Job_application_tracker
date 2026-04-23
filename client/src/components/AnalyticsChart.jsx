import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = {
  Applied: '#3B82F6', // blue-500
  Interview: '#EAB308', // yellow-500
  Rejected: '#EF4444', // red-500
  Offer: '#22C55E', // green-500
};

const AnalyticsChart = ({ stats }) => {
  const data = Object.keys(stats)
    .filter(key => stats[key] > 0)
    .map(key => ({
      name: key,
      value: stats[key]
    }));

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
        Not enough data for chart
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#94A3B8'} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              color: '#0f172a'
            }}
            itemStyle={{ color: '#0f172a', fontWeight: 600 }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;
