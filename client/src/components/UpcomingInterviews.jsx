import React, { useEffect, useState } from "react";
import api from "../services/api";

const UpcomingInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await api.get("/interviews?upcoming=true");
        setInterviews(res.data);
      } catch (err) {
        console.error("Failed to fetch upcoming interviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const getDaysDiff = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateString);
    target.setHours(0, 0, 0, 0);
    const diffTime = target - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getMonthAbbrev = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'short' }).toUpperCase();
  };

  const getDayNum = (dateString) => {
    return new Date(dateString).getDate();
  };

  const getBadgeStyle = (days) => {
    if (days === 1) return { bg: 'bg-[#f59e0b]/10', text: 'text-[#f59e0b]', label: 'Tomorrow' };
    if (days === 0) return { bg: 'bg-[#f59e0b]/10', text: 'text-[#f59e0b]', label: 'Today' };
    return { bg: 'bg-[#6366f1]/10', text: 'text-[#6366f1]', label: `In ${days} days` };
  };

  const getDateBoxStyle = (days) => {
    if (days <= 1) return 'bg-[#f59e0b] text-white';
    if (days <= 7) return 'bg-[#6366f1] text-white';
    return 'bg-[#334155] text-white'; // further away
  };

  if (loading) {
    return (
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 h-full flex flex-col">
        <h3 className="text-[#f1f5f9] font-semibold text-lg mb-4">Upcoming Interviews</h3>
        <div className="flex-1 overflow-hidden flex flex-col gap-3">
          <div className="animate-pulse flex flex-col gap-3">
            <div className="h-[74px] bg-[#0f172a] border border-[#334155] rounded-xl"></div>
            <div className="h-[74px] bg-[#0f172a] border border-[#334155] rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 h-full flex flex-col">
      <h3 className="text-[#f1f5f9] font-semibold text-lg mb-4">Upcoming Interviews</h3>
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar flex flex-col gap-3">
        {interviews.length === 0 ? (
          <div className="bg-[#0f172a] border border-[#334155] rounded-xl p-6 text-center text-[#94a3b8] text-sm h-full flex items-center justify-center">
            No upcoming interviews scheduled
          </div>
        ) : (
          interviews.map((interview) => {
            const days = getDaysDiff(interview.interviewDate);
            const badge = getBadgeStyle(days);
            
            return (
              <div key={interview._id} className="bg-[#0f172a] border border-[#334155] rounded-xl p-3 flex items-center gap-4 shrink-0">
                <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 ${getDateBoxStyle(days)}`}>
                  <span className="text-lg font-bold leading-tight">{getDayNum(interview.interviewDate)}</span>
                  <span className="text-[10px] font-semibold leading-tight opacity-90">{getMonthAbbrev(interview.interviewDate)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[#f1f5f9] font-semibold text-[15px] truncate">{interview.title}</h4>
                  <p className="text-[#94a3b8] text-[13px] truncate">
                    {interview.company} &middot; {interview.interviewType} &middot; {interview.interviewTime || 'TBD'}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[13px] font-medium whitespace-nowrap border border-transparent ${badge.bg} ${badge.text}`}>
                  {badge.label}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UpcomingInterviews;
