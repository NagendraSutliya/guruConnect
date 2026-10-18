import React from "react";
import { useAuth } from "../../context/AuthContext";
import { FiUser, FiCalendar, FiShield, FiAlertCircle, FiInfo } from "react-icons/fi";

const StudentProfile: React.FC = () => {
  const { user } = useAuth();

  const studentName = user?.name || "Charu Mehta";
  const initials = studentName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn font-sans text-ink">
      {/* Top Banner Notice */}
      <div className="text-small text-ink-secondary">
        Student Identity & Records · Read-Only Access
      </div>

      {/* Hero Profile Card */}
      <section className="bg-surface border border-line rounded-card p-6 flex flex-wrap gap-6 items-center shadow-2xs">
        <div className="w-20 h-20 rounded-hero bg-primary-tint text-primary font-semibold text-3xl flex items-center justify-center border border-primary/20 shrink-0">
          {initials}
        </div>

        <div className="flex-1 min-w-[280px] flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-title font-semibold text-ink m-0">{studentName}</h1>
            <span className="text-caption font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Active Student
            </span>
          </div>

          <p className="text-small text-ink-secondary m-0">
            Class 8-B · Roll No. 03 · Aravali House · Admission No. <span className="font-mono font-medium text-ink">ADM-8B-03</span>
          </p>

          <p className="text-small text-ink-secondary m-0">
            Class Teacher: <strong className="text-ink">Sunita Rathore</strong> · Shiksha Public School
          </p>
        </div>
      </section>

      {/* 2-Column Detailed Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Academic & Enrollment Information */}
        <div className="bg-surface border border-line rounded-card p-6 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-line-row">
            <FiCalendar className="text-primary" size={18} />
            <h2 className="text-body font-semibold text-ink m-0">Academic Registration</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 text-small">
            <div>
              <span className="text-caption text-ink-secondary block">Current Standard</span>
              <span className="font-semibold text-ink">Class 8</span>
            </div>
            <div>
              <span className="text-caption text-ink-secondary block">Section & Roll</span>
              <span className="font-semibold text-ink">Section B · Roll 03</span>
            </div>
            <div>
              <span className="text-caption text-ink-secondary block">Academic Session</span>
              <span className="font-semibold text-ink">2026–2027</span>
            </div>
            <div>
              <span className="text-caption text-ink-secondary block">Allocated House</span>
              <span className="font-semibold text-ink">Aravali (Yellow)</span>
            </div>
            <div>
              <span className="text-caption text-ink-secondary block">Admission Date</span>
              <span className="font-semibold text-ink">10 April 2022</span>
            </div>
            <div>
              <span className="text-caption text-ink-secondary block">Student ID / UID</span>
              <span className="font-mono font-semibold text-ink">STU-2026-8B03</span>
            </div>
          </div>
        </div>

        {/* Card 2: Personal & Guardian Information */}
        <div className="bg-surface border border-line rounded-card p-6 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-line-row">
            <FiUser className="text-primary" size={18} />
            <h2 className="text-body font-semibold text-ink m-0">Personal & Guardian Details</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 text-small">
            <div>
              <span className="text-caption text-ink-secondary block">Father / Guardian</span>
              <span className="font-semibold text-ink">Mr. Sunil Mehta</span>
            </div>
            <div>
              <span className="text-caption text-ink-secondary block">Mother</span>
              <span className="font-semibold text-ink">Mrs. Sunita Mehta</span>
            </div>
            <div>
              <span className="text-caption text-ink-secondary block">Date of Birth</span>
              <span className="font-semibold text-ink">14 August 2013</span>
            </div>
            <div>
              <span className="text-caption text-ink-secondary block">Blood Group</span>
              <span className="font-mono font-semibold text-ink">B+ Positive</span>
            </div>
            <div className="col-span-2">
              <span className="text-caption text-ink-secondary block">Residential City</span>
              <span className="font-semibold text-ink">Jaipur, Rajasthan (Campus Transit Route 4)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-4 bg-surface-subtle border border-line rounded-control flex items-start gap-3 text-small text-ink-secondary">
        <FiShield className="text-primary mt-0.5 shrink-0" size={18} />
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-ink">Safety & Data Protection for Minors</span>
          <span className="leading-relaxed">
            In compliance with student data privacy guidelines and the DPDP Act, personal contact numbers and financial records are restricted. Any modifications to student profile or transport routes must be officially submitted by parents.
          </span>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
