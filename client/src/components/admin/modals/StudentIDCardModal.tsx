import React, { useRef, useState, useEffect } from "react";
import { FiX, FiPrinter, FiDownload, FiCheck } from "react-icons/fi";
import type { Student } from "../../../types/admin/student";
import api from "../../../api/axiosInstance";

interface Props {
  students: Student[];
  onClose: () => void;
  instituteInfo?: {
    name?: string;
    logoUrl?: string;
    phone?: string;
    address?: string;
  };
}

export default function StudentIDCardModal({ students, onClose, instituteInfo }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const [adminData, setAdminData] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("admin");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (!adminData?.instituteName || !adminData?.logoUrl) {
      api
        .get("/admin/profile")
        .then((res) => {
          if (res.data?.data) {
            const profile = res.data.data;
            setAdminData((prev: any) => {
              const updated = {
                ...prev,
                instituteName: profile.instituteName || prev?.instituteName,
                logoUrl: profile.logoUrl || prev?.logoUrl,
                phone: profile.phone || prev?.phone,
                address: profile.address || prev?.address,
              };
              localStorage.setItem("admin", JSON.stringify(updated));
              return updated;
            });
          }
        })
        .catch(() => {});
    }
  }, []);

  const instituteName =
    instituteInfo?.name ||
    adminData?.instituteName ||
    "Gyansthali Enlightening";

  const instituteLogo =
    instituteInfo?.logoUrl ||
    adminData?.logoUrl ||
    adminData?.profileImage ||
    null;

  const instituteInitials =
    instituteName
      .split(" ")
      .filter(Boolean)
      .map((w: string) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "GE";

  const institutePhone =
    instituteInfo?.phone ||
    adminData?.phone ||
    "+91 94258 47076";

  const instituteAddress =
    instituteInfo?.address ||
    adminData?.address ||
    "Mansarovar Campus · CBSE";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs animate-fadeIn">
      {/* Modal Card */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-surface rounded-card border border-line shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-line bg-surface-subtle flex items-center justify-between">
          <div>
            <h2 className="text-h2 font-semibold text-ink m-0">
              Student ID Cards · {students.length} {students.length === 1 ? "Card" : "Cards"} Preview
            </h2>
            <p className="text-caption text-ink-secondary mt-0.5 m-0">
              Official PVC Format (CR80 Standard: 85.6mm × 53.98mm) ready for batch printing.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-control bg-primary text-white text-small font-semibold hover:bg-primary-dark transition cursor-pointer"
            >
              <FiPrinter size={15} />
              <span>Print All Cards</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-ink-secondary hover:text-ink hover:bg-surface rounded-control border border-line transition cursor-pointer"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Printable Preview Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-page">
          <div
            ref={printRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4"
          >
            {students.map((student, idx) => {
              const initials = student.name ? student.name.substring(0, 2).toUpperCase() : "ST";
              const classNameStr = student.classId?.name || "N/A";
              const sectionNameStr = student.sectionId?.name || "";
              const displayClass = `${classNameStr}${sectionNameStr ? `-${sectionNameStr}` : ""}`;
              const admNo = student.admissionNo || `2026/${String(student.rollNo || idx + 1).padStart(4, "0")}`;
              const dobStr = student.dob
                ? new Date(student.dob).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
                : "15-08-2015";

              return (
                <div
                  key={student._id || idx}
                  className="bg-white border-2 border-primary/20 rounded-card p-5 shadow-sm flex flex-col justify-between h-[260px] relative overflow-hidden print:border print:shadow-none print:break-inside-avoid"
                  style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                >
                  {/* Card Background Pattern Accent */}
                  <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-r from-primary to-primary-dark flex items-center justify-between px-4 text-white z-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-white p-0.5 shadow-xs shrink-0 flex items-center justify-center overflow-hidden">
                        {instituteLogo ? (
                          <img
                            src={instituteLogo}
                            alt={instituteName}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full rounded-md bg-gold text-nav-bg font-bold flex items-center justify-center text-xs shadow-xs">
                            {instituteInitials}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col leading-tight min-w-0 max-w-[210px]">
                        <span className="font-bold text-xs tracking-wide uppercase truncate" title={instituteName}>
                          {instituteName}
                        </span>
                        <span className="text-[10px] text-nav-muted font-normal truncate">
                          {instituteAddress}
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded text-white shrink-0">
                      2026-27
                    </span>
                  </div>

                  {/* Body Details */}
                  <div className="pt-14 flex items-start gap-4 z-10">
                    {/* Student Avatar / Photo */}
                    <div className="flex flex-col items-center gap-1.5 shrink-0">
                      <div className="w-20 h-20 rounded-xl bg-primary-tint border-2 border-primary text-primary-dark font-bold text-xl flex items-center justify-center shadow-inner">
                        {initials}
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-primary-dark bg-primary-tint/60 px-1.5 py-0.5 rounded">
                        {admNo}
                      </span>
                    </div>

                    {/* Metadata Grid */}
                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                      <h3 className="m-0 font-bold text-base text-ink truncate leading-snug">
                        {student.name}
                      </h3>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-caption text-ink-body2 pt-1">
                        <div>
                          <span className="text-ink-secondary text-[10px] block">Class & Sec</span>
                          <span className="font-semibold text-ink">{displayClass}</span>
                        </div>
                        <div>
                          <span className="text-ink-secondary text-[10px] block">Roll No.</span>
                          <span className="font-mono font-semibold text-ink">{student.rollNo || "01"}</span>
                        </div>
                        <div>
                          <span className="text-ink-secondary text-[10px] block">DOB</span>
                          <span className="font-mono text-ink">{dobStr}</span>
                        </div>
                        <div>
                          <span className="text-ink-secondary text-[10px] block">Blood Group</span>
                          <span className="font-bold text-rose-700">{student.bloodGroup || "O+"}</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-ink-secondary truncate pt-1">
                        <span className="font-medium text-ink">Parent:</span> {student.parentName || "Guardian"} · {student.parentPhone || "98290 1xxxx"}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Bar & Barcode line */}
                  <div className="pt-2 border-t border-line/80 flex items-center justify-between text-[10px] text-ink-secondary">
                    <span className="truncate">Emergency Contact: {institutePhone}</span>
                    {/* Simulated barcode */}
                    <div className="flex items-center gap-0.5 font-mono text-[9px] tracking-widest text-ink">
                      ||| | | |||| | ||| | ||
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-line bg-surface flex items-center justify-between text-caption text-ink-secondary">
          <span>Cards formatted for A4 cardstock (6 cards per sheet).</span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-control border border-line text-ink hover:bg-surface-subtle font-medium transition cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-control bg-primary text-white hover:bg-primary-dark font-semibold transition cursor-pointer flex items-center gap-1.5"
            >
              <FiPrinter size={14} /> Print Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
