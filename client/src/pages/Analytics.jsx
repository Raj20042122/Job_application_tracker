import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  TrendingUp,
  BarChart2,
  PieChart as PieIcon,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  Layers,
  ArrowUpRight
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  Wishlist: "#94A3B8",
  Applied: "#3B82F6",
  OA: "#A855F7",
  Interview: "#F59E0B",
  Offer: "#10B981",
  Rejected: "#F43F5E"
};

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get("/jobs/stats");
        setStats(res.data);
      } catch (err) {
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const total = stats?.total || 0;
  const wishlist = stats?.Wishlist || 0;
  const applied = stats?.Applied || 0;
  const oa = stats?.OA || 0;
  const interview = stats?.Interview || 0;
  const offer = stats?.Offer || 0;
  const rejected = stats?.Rejected || 0;

  // Funnel Data: Pipeline progression
  const funnelSteps = [
    { label: "Submitted (Applied)", count: applied + oa + interview + offer + rejected, color: "#3B82F6" },
    { label: "Assessments (OA)", count: oa + interview + offer, color: "#A855F7" },
    { label: "Interviews", count: interview + offer, color: "#F59E0B" },
    { label: "Final Offers", count: offer, color: "#10B981" }
  ];

  // Pie chart data
  const pieData = stats?.statusCounts
    ? Object.entries(stats.statusCounts)
        .filter(([_, count]) => count > 0)
        .map(([name, value]) => ({ name, value, color: STATUS_COLORS[name] }))
    : [];

  const timelineData = stats?.timeline || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Performance & Pipeline Analytics
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Accurate metrics calculated strictly from your application database
        </p>
      </div>

      {/* Key Metric Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="jt-card p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Conversion Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
            {loading ? "..." : `${stats?.offerRate || 0}%`}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Applications resulting in offers</p>
        </div>

        <div className="jt-card p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Interview Rate</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight">
            {loading ? "..." : `${stats?.interviewRate || 0}%`}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Applications reaching interview</p>
        </div>

        <div className="jt-card p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Response Rate</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {loading ? "..." : `${stats?.responseRate || 0}%`}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Employer response after apply</p>
        </div>

        <div className="jt-card p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Rejection Rate</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <XCircle size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 tracking-tight">
            {loading ? "..." : total > 0 ? `${Math.round((rejected / total) * 100)}%` : "0%"}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Closed / declined applications</p>
        </div>
      </div>

      {/* 2 Charts Grid: Timeline Trend & Status Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Application Volume Timeline (8 Cols) */}
        <div className="lg:col-span-8 jt-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Application Velocity</h3>
              <p className="text-xs text-slate-400 mt-0.5">Volume of applications logged over the last 6 months</p>
            </div>
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg">
              {stats?.thisWeekCount || 0} this week
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="appGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0B0E17",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#FFF",
                    fontSize: "12px"
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="applications"
                  name="Applications"
                  stroke="#6366F1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#appGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie (4 Cols) */}
        <div className="lg:col-span-4 jt-card p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Status Proportions</h3>
            <p className="text-xs text-slate-400 mt-0.5">Current distribution of applications</p>
          </div>

          <div className="h-56 relative my-auto">
            {pieData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No application data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0B0E17",
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#FFF",
                      fontSize: "12px"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="space-y-1.5 pt-3 border-t border-white/[0.06]">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-400">{item.name}</span>
                </div>
                <span className="font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recruitment Funnel Conversion Bar */}
      <div className="jt-card p-6">
        <h3 className="text-sm font-bold text-white tracking-tight mb-1">
          Hiring Pipeline Funnel
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Step-by-step conversion drop-off from initial submission to final offer
        </p>

        <div className="space-y-4">
          {funnelSteps.map((step, idx) => {
            const baseCount = funnelSteps[0].count || 1;
            const percentage = Math.round((step.count / baseCount) * 100);

            return (
              <div key={step.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-300">{step.label}</span>
                  <span className="text-white">
                    {step.count} candidates <span className="text-slate-500 font-normal">({percentage}%)</span>
                  </span>
                </div>

                <div className="h-3 w-full bg-white/[0.04] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.max(4, percentage)}%`, backgroundColor: step.color }}
                    className="h-full rounded-full transition-all duration-700"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
