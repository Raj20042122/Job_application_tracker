import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
  MapPin,
  Building,
  Briefcase,
  AlertCircle,
  Plus
} from "lucide-react";
import toast from "react-hot-toast";
import ApplicationDetailsModal from "../components/ApplicationDetailsModal";

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduledJobs, setScheduledJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        setLoading(true);
        // Get all jobs that have an interviewDate
        const res = await api.get("/interviews", { params: { upcoming: "false" } });
        setScheduledJobs(res.data || []);
      } catch (err) {
        toast.error("Failed to load interview calendar");
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarEvents();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  // Filter events for current month
  const eventsByDay = {};
  scheduledJobs.forEach((job) => {
    if (!job.interviewDate) return;
    const date = new Date(job.interviewDate);
    if (date.getFullYear() === year && date.getMonth() === month) {
      const day = date.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(job);
    }
  });

  const selectedDayEvents = eventsByDay[selectedDay] || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Interview & Deadline Calendar
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Keep track of upcoming interviews, technical rounds, and OA deadlines
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-2 bg-[#0C101A] border border-white/[0.08] p-1.5 rounded-xl self-start sm:self-auto">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-bold text-white px-3 min-w-[140px] text-center">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Main Grid: Calendar on Left, Selected Day Events on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Calendar Month Grid (8 Cols) */}
        <div className="lg:col-span-8 jt-card p-5 sm:p-6">
          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-[11px] font-bold uppercase tracking-wider text-slate-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Empty slots for days before 1st */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[70px] sm:min-h-[90px] rounded-xl bg-white/[0.01]" />
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNumber = i + 1;
              const hasEvents = eventsByDay[dayNumber] && eventsByDay[dayNumber].length > 0;
              const isToday = isCurrentMonth && today.getDate() === dayNumber;
              const isSelected = selectedDay === dayNumber;

              return (
                <div
                  key={`day-${dayNumber}`}
                  onClick={() => setSelectedDay(dayNumber)}
                  className={`min-h-[70px] sm:min-h-[90px] p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-indigo-600/15 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                      : isToday
                      ? "bg-white/[0.05] border-white/20"
                      : "bg-[#0B0E17] border-white/[0.04] hover:bg-white/[0.03] hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold leading-none ${
                        isToday
                          ? "w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]"
                          : isSelected
                          ? "text-indigo-300 font-extrabold"
                          : "text-slate-300"
                      }`}
                    >
                      {dayNumber}
                    </span>

                    {hasEvents && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#F59E0B]" />
                    )}
                  </div>

                  {/* Tiny Event Chips */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {hasEvents &&
                      eventsByDay[dayNumber].slice(0, 2).map((evt) => (
                        <div
                          key={evt._id}
                          className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-semibold text-amber-300 truncate"
                          title={`${evt.company} - ${evt.title}`}
                        >
                          {evt.company}
                        </div>
                      ))}
                    {hasEvents && eventsByDay[dayNumber].length > 2 && (
                      <span className="text-[9px] text-slate-500 font-medium pl-1">
                        +{eventsByDay[dayNumber].length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="jt-card p-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Selected Date
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  {monthNames[month]} {selectedDay}, {year}
                </h3>
              </div>
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg">
                {selectedDayEvents.length} {selectedDayEvents.length === 1 ? "Event" : "Events"}
              </span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading schedule...</div>
            ) : selectedDayEvents.length === 0 ? (
              <div className="p-8 text-center bg-white/[0.02] border border-white/[0.04] rounded-xl">
                <CalendarIcon size={22} className="mx-auto mb-2 text-slate-600" />
                <p className="text-xs font-medium text-slate-400">No interviews on this date</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Select another day or add interview details to an application.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDayEvents.map((job) => (
                  <div
                    key={job._id}
                    onClick={() => setSelectedJob(job)}
                    className="jt-card-hover p-4 bg-[#0C101A] border-white/[0.08] cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                        {job.company}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {job.interviewType || "Video call"}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
                      {job.title}
                    </h4>

                    <div className="space-y-1 text-xs text-slate-400 pt-2 border-t border-white/[0.04]">
                      {job.interviewTime && (
                        <div className="flex items-center gap-2 text-[11px]">
                          <Clock size={12} className="text-slate-500" />
                          <span>Time: {job.interviewTime}</span>
                        </div>
                      )}
                      {job.recruiter?.name && (
                        <div className="flex items-center gap-2 text-[11px]">
                          <Briefcase size={12} className="text-slate-500" />
                          <span>Recruiter: {job.recruiter.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <ApplicationDetailsModal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        job={selectedJob}
        onUpdateStatus={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    </div>
  );
};

export default CalendarPage;
