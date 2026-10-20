import React from "react";
import { Link, useLocation } from "react-router-dom";

interface Props {
  extraContext?: string;
}

export default function AttendanceModuleNav({ extraContext }: Props) {
  const location = useLocation();
  const path = location.pathname;

  const isAttendance = path === "/admin/attendance";
  const isStaffAttendance = path.startsWith("/admin/staff/attendance");
  const isTimetable = path.startsWith("/admin/routine");

  return (
    <div className="text-small text-ink-secondary flex flex-wrap items-center gap-2">
      {/* Student Attendance Link */}
      {isAttendance ? (
        <span className="text-ink font-semibold">Student Attendance</span>
      ) : (
        <Link
          to="/admin/attendance"
          className="text-primary hover:underline font-medium transition-colors"
        >
          Student Attendance
        </Link>
      )}

      <span>·</span>

      {/* Staff Attendance Link */}
      {isStaffAttendance ? (
        <span className="text-ink font-semibold">Staff Attendance</span>
      ) : (
        <Link
          to="/admin/staff/attendance"
          className="text-primary hover:underline font-medium transition-colors"
        >
          Staff Attendance
        </Link>
      )}

      <span>·</span>

      {/* Timetable Link */}
      {isTimetable ? (
        <span className="text-ink font-semibold">Timetable</span>
      ) : (
        <Link
          to="/admin/routine"
          className="text-primary hover:underline font-medium transition-colors"
        >
          Timetable
        </Link>
      )}

      {/* Optional session or subtitle tag */}
      {extraContext && (
        <>
          <span>·</span>
          <span className="text-primary font-medium">{extraContext}</span>
        </>
      )}
    </div>
  );
}
