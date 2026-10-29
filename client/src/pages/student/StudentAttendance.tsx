import React from "react";
import { FiCalendar, FiCheckCircle, FiInfo } from "react-icons/fi";

const StudentAttendance: React.FC = () => {
  const calendarCells = [
    { blank: true }, { blank: true }, { blank: true },
    { day: 1, type: "present", desc: "Present" },
    { day: 2, type: "holiday", desc: "Gandhi Jayanti" },
    { day: 3, type: "present", desc: "Present" },
    { day: 4, type: "weekend", desc: "Sunday" },
    { day: 5, type: "present", desc: "Present" },
    { day: 6, type: "present", desc: "Present" },
    { day: 7, type: "present", desc: "Present" },
    { day: 8, type: "present", desc: "Present" },
    { day: 9, type: "present", desc: "Present" },
    { day: 10, type: "present", desc: "Present" },
    { day: 11, type: "weekend", desc: "Sunday" },
    { day: 12, type: "present", desc: "Present" },
    { day: 13, type: "present", desc: "Present (Today)" },
    { day: 14, type: "future", desc: "Scheduled" },
    { day: 15, type: "future", desc: "Scheduled" },
    { day: 16, type: "future", desc: "Scheduled" },
    { day: 17, type: "future", desc: "Scheduled" },
    { day: 18, type: "weekend", desc: "Sunday" },
    { day: 19, type: "future", desc: "Scheduled" },
    { day: 20, type: "holiday", desc: "Festival Break" },
    { day: 21, type: "holiday", desc: "Festival Break" },
    { day: 22, type: "holiday", desc: "Festival Break" },
    { day: 23, type: "holiday", desc: "Festival Break" },
    { day: 24, type: "holiday", desc: "Festival Break" },
    { day: 25, type: "weekend", desc: "Sunday" },
    { day: 26, type: "future", desc: "Scheduled" },
    { day: 27, type: "future", desc: "Scheduled" },
    { day: 28, type: "future", desc: "Scheduled" },
    { day: 29, type: "future", desc: "Scheduled" },
    { day: 30, type: "future", desc: "Scheduled" },
    { day: 31, type: "future", desc: "Scheduled" },
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn font-sans text-ink">
      {/* Top Header */}
      <div>
        <div className="text-small text-ink-secondary">Attendance Record · Class 8-B</div>
        <h1 className="text-title font-semibold text-ink m-0">Student Attendance Tracker</h1>
      </div>

      {/* 3 Summary Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-line rounded-card p-5 flex flex-col gap-1 shadow-2xs">
          <span className="text-small text-ink-secondary">This Month (October)</span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-ink">10 of 10</span>
            <span className="text-caption text-ink-secondary">days attended</span>
          </div>
          <span className="text-caption text-emerald-700 font-semibold mt-1">
            100% attendance this month
          </span>
        </div>

        <div className="bg-surface border border-line rounded-card p-5 flex flex-col gap-1 shadow-2xs">
          <span className="text-small text-ink-secondary">Academic Session Year</span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-primary">98%</span>
            <span className="text-caption text-ink-secondary">overall</span>
          </div>
          <span className="text-caption text-ink-secondary mt-1">
            Meets 75% minimum threshold
          </span>
        </div>

        <div className="bg-surface border border-line rounded-card p-5 flex flex-col gap-1 shadow-2xs">
          <span className="text-small text-ink-secondary">Total Absents</span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-ink">2 days</span>
            <span className="text-caption text-ink-secondary">excused leave</span>
          </div>
          <span className="text-caption text-ink-secondary mt-1">
            Medical leaves applied by parents
          </span>
        </div>
      </div>

      {/* Calendar Grid Card */}
      <div className="bg-surface border border-line rounded-card p-6 shadow-2xs flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-line-row">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-primary" size={18} />
            <h2 className="text-body font-semibold text-ink m-0">October 2026 Monthly Calendar</h2>
          </div>

          <div className="flex items-center gap-4 text-caption text-ink-secondary">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary"></span> Present (10)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-attendance-holiday"></span> Off / Holiday (6)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white border border-line"></span> Scheduled (15)
            </span>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 text-small font-semibold text-ink-secondary text-center">
          <span>Monday</span>
          <span>Tuesday</span>
          <span>Wednesday</span>
          <span>Thursday</span>
          <span>Friday</span>
          <span>Saturday</span>
          <span>Sunday</span>
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7 gap-2">
          {calendarCells.map((cell, idx) => {
            if (cell.blank) {
              return <div key={idx} className="min-h-[70px] rounded-control bg-transparent" />;
            }

            if (cell.type === "present") {
              return (
                <div
                  key={idx}
                  className="min-h-[70px] rounded-control bg-primary text-white p-2.5 flex flex-col justify-between shadow-2xs hover:opacity-95 transition-all"
                >
                  <span className="font-mono text-small font-bold">{cell.day}</span>
                  <span className="text-[11px] font-medium text-white/90">{cell.desc}</span>
                </div>
              );
            }

            if (cell.type === "holiday" || cell.type === "weekend") {
              return (
                <div
                  key={idx}
                  className="min-h-[70px] rounded-control bg-attendance-holiday text-ink-secondary p-2.5 flex flex-col justify-between"
                >
                  <span className="font-mono text-small font-semibold text-ink">{cell.day}</span>
                  <span className="text-[11px] text-ink-secondary truncate">{cell.desc}</span>
                </div>
              );
            }

            // Future day
            return (
              <div
                key={idx}
                className="min-h-[70px] rounded-control bg-surface border border-line text-ink-muted p-2.5 flex flex-col justify-between hover:bg-surface-subtle transition-colors"
              >
                <span className="font-mono text-small font-medium">{cell.day}</span>
                <span className="text-[11px] text-ink-muted">{cell.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-4 bg-surface-subtle border border-line rounded-control flex items-center justify-between text-small text-ink-secondary">
        <div className="flex items-center gap-2">
          <FiInfo size={16} className="text-primary shrink-0" />
          <span>Notice: Formal student leave requests must be submitted by parents via the Parent Portal.</span>
        </div>
        <span className="text-caption text-ink-muted">DPDP Policy Compliant</span>
      </div>
    </div>
  );
};

export default StudentAttendance;
