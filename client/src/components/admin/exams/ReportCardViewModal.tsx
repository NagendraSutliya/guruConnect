import React, { useState, useRef, useEffect } from "react";
import { FiX, FiPrinter, FiDownload, FiUser, FiCheckCircle, FiAlertTriangle, FiChevronRight } from "react-icons/fi";
import html2pdf from "html2pdf.js";
import api from "../../../api/axiosInstance";

interface SubjectScore {
  name: string;
  pt: number | string;
  nb: number | string;
  se: number | string;
  hy: number | string;
  total: number | string;
  grade: string;
}

interface StudentReportData {
  id: string;
  rollNo: string;
  name: string;
  admissionNo: string;
  fatherName: string;
  motherName: string;
  dob: string;
  attendance: string;
  isFeeWithheld: boolean;
  feeDueAmount?: number;
  remarks: string;
  subjects: SubjectScore[];
  coScholastic: { activity: string; grade: string }[];
}

interface ReportCardViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionName: string;
  examName: string;
  instituteInfo?: {
    name?: string;
    logoUrl?: string;
    address?: string;
    phone?: string;
    email?: string;
    city?: string;
    board?: string;
    principalName?: string;
  };
}

const SAMPLE_STUDENT_REPORTS: StudentReportData[] = [
  {
    id: "s1",
    rollNo: "01",
    name: "Aditi Sharma",
    admissionNo: "ADM-2024-0821",
    fatherName: "Rakesh Sharma",
    motherName: "Sunita Sharma",
    dob: "14 May 2013",
    attendance: "114 / 120 (95%)",
    isFeeWithheld: false,
    remarks: "Aditi displays exceptional academic acumen and leadership in laboratory experiments. Outstanding performance!",
    subjects: [
      { name: "English", pt: 9, nb: 5, se: 5, hy: 74, total: 93, grade: "A1" },
      { name: "Hindi", pt: 8, nb: 4, se: 5, hy: 70, total: 87, grade: "A2" },
      { name: "Mathematics", pt: 10, nb: 5, se: 5, hy: 78, total: 98, grade: "A1" },
      { name: "Science", pt: 9, nb: 5, se: 4, hy: 71, total: 89, grade: "A2" },
      { name: "Social Science", pt: 8, nb: 5, se: 4, hy: 68, total: 85, grade: "A2" },
      { name: "Sanskrit", pt: 9, nb: 4, se: 4, hy: 72, total: 89, grade: "A2" },
      { name: "Computer", pt: 10, nb: 5, se: 5, hy: 77, total: 97, grade: "A1" },
    ],
    coScholastic: [
      { activity: "Work Education", grade: "A" },
      { activity: "Art Education", grade: "A" },
      { activity: "Health & Physical Education", grade: "A" },
      { activity: "Discipline", grade: "A" },
    ],
  },
  {
    id: "s2",
    rollNo: "02",
    name: "Bhavesh Kumar",
    admissionNo: "ADM-2024-0822",
    fatherName: "Manoj Kumar",
    motherName: "Suman Kumar",
    dob: "21 Sep 2013",
    attendance: "108 / 120 (90%)",
    isFeeWithheld: false,
    remarks: "Bhavesh is attentive and punctual. Can improve higher-order problem solving with more practice.",
    subjects: [
      { name: "English", pt: 8, nb: 4, se: 4, hy: 65, total: 81, grade: "A2" },
      { name: "Hindi", pt: 7, nb: 4, se: 4, hy: 62, total: 77, grade: "B1" },
      { name: "Mathematics", pt: 8, nb: 4, se: 4, hy: 62, total: 78, grade: "B1" },
      { name: "Science", pt: 8, nb: 4, se: 4, hy: 62, total: 78, grade: "B1" },
      { name: "Social Science", pt: 7, nb: 4, se: 3, hy: 58, total: 72, grade: "B1" },
      { name: "Sanskrit", pt: 8, nb: 4, se: 4, hy: 64, total: 80, grade: "B1" },
      { name: "Computer", pt: 9, nb: 4, se: 4, hy: 68, total: 85, grade: "A2" },
    ],
    coScholastic: [
      { activity: "Work Education", grade: "B" },
      { activity: "Art Education", grade: "A" },
      { activity: "Health & Physical Education", grade: "A" },
      { activity: "Discipline", grade: "A" },
    ],
  },
  {
    id: "s6",
    rollNo: "06",
    name: "Harsh Vardhan",
    admissionNo: "ADM-2024-0826",
    fatherName: "Anil Vardhan",
    motherName: "Manju Vardhan",
    dob: "03 Aug 2013",
    attendance: "98 / 120 (81.6%)",
    isFeeWithheld: true,
    feeDueAmount: 21800,
    remarks: "Good potential in sports and mathematics. Report card release is subject to clearance of account dues.",
    subjects: [
      { name: "English", pt: 7, nb: 4, se: 3, hy: 58, total: 72, grade: "B1" },
      { name: "Hindi", pt: 7, nb: 3, se: 3, hy: 56, total: 69, grade: "B2" },
      { name: "Mathematics", pt: 8, nb: 4, se: 4, hy: 68, total: 84, grade: "A2" },
      { name: "Science", pt: 8, nb: 4, se: 4, hy: 64, total: 80, grade: "B1" },
      { name: "Social Science", pt: 6, nb: 3, se: 3, hy: 52, total: 64, grade: "B2" },
      { name: "Sanskrit", pt: 7, nb: 4, se: 3, hy: 59, total: 73, grade: "B1" },
      { name: "Computer", pt: 8, nb: 4, se: 4, hy: 65, total: 81, grade: "A2" },
    ],
    coScholastic: [
      { activity: "Work Education", grade: "B" },
      { activity: "Art Education", grade: "B" },
      { activity: "Health & Physical Education", grade: "A" },
      { activity: "Discipline", grade: "B" },
    ],
  },
  {
    id: "s9",
    rollNo: "09",
    name: "Isha Kanwar",
    admissionNo: "ADM-2024-0827",
    fatherName: "Birendra Singh",
    motherName: "Geeta Devi",
    dob: "12 Dec 2013",
    attendance: "119 / 120 (99%)",
    isFeeWithheld: false,
    remarks: "Class topper. Exceptional consistency in assignments and project submissions. Commendable achievement!",
    subjects: [
      { name: "English", pt: 10, nb: 5, se: 5, hy: 78, total: 98, grade: "A1" },
      { name: "Hindi", pt: 10, nb: 5, se: 5, hy: 76, total: 96, grade: "A1" },
      { name: "Mathematics", pt: 10, nb: 5, se: 5, hy: 80, total: 100, grade: "A1" },
      { name: "Science", pt: 10, nb: 5, se: 5, hy: 79, total: 99, grade: "A1" },
      { name: "Social Science", pt: 9, nb: 5, se: 5, hy: 77, total: 96, grade: "A1" },
      { name: "Sanskrit", pt: 10, nb: 5, se: 5, hy: 78, total: 98, grade: "A1" },
      { name: "Computer", pt: 10, nb: 5, se: 5, hy: 80, total: 100, grade: "A1" },
    ],
    coScholastic: [
      { activity: "Work Education", grade: "A" },
      { activity: "Art Education", grade: "A" },
      { activity: "Health & Physical Education", grade: "A" },
      { activity: "Discipline", grade: "A" },
    ],
  },
];

export default function ReportCardViewModal({
  isOpen,
  onClose,
  sectionName,
  examName,
  instituteInfo,
}: ReportCardViewModalProps) {
  const [selectedStudentId, setSelectedStudentId] = useState("s1");
  const reportRef = useRef<HTMLDivElement>(null);

  const [adminData, setAdminData] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("admin");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (!adminData?.instituteName || !adminData?.address) {
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
                city: profile.city || prev?.city,
                board: profile.board || prev?.board,
                principalName: profile.principalName || prev?.principalName,
                email: profile.email || prev?.email,
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
    "GuruConnect Institute";

  const instituteLogo =
    instituteInfo?.logoUrl ||
    adminData?.logoUrl ||
    adminData?.profileImage ||
    null;

  const instituteSubDetails =
    instituteInfo?.address ||
    adminData?.address ||
    [
      adminData?.city,
      adminData?.phone ? `Ph: ${adminData.phone}` : null,
      adminData?.email ? adminData.email : null,
    ]
      .filter(Boolean)
      .join(" · ") ||
    "Affiliated Educational Institution";

  const instituteBoard =
    instituteInfo?.board ||
    adminData?.board ||
    "Central Board of Secondary Education · New Delhi";

  const principalName =
    instituteInfo?.principalName ||
    adminData?.principalName ||
    adminData?.ownerName ||
    "Principal";

  if (!isOpen) return null;

  const currentStudent =
    SAMPLE_STUDENT_REPORTS.find((s) => s.id === selectedStudentId) ||
    SAMPLE_STUDENT_REPORTS[0];

  const calculateOverall = (subjects: SubjectScore[]) => {
    let totalObtained = 0;
    let maxTotal = subjects.length * 100;
    subjects.forEach((s) => {
      const num = Number(s.total);
      if (!isNaN(num)) totalObtained += num;
    });
    const percentage = maxTotal ? ((totalObtained / maxTotal) * 100).toFixed(1) : "0";
    return { totalObtained, maxTotal, percentage };
  };

  const { totalObtained, maxTotal, percentage } = calculateOverall(currentStudent.subjects);

  const handleDownloadPDF = () => {
    if (!reportRef.current) return;
    const opt = {
      margin: 8,
      filename: `Report_Card_${currentStudent.rollNo}_${currentStudent.name.replace(/\s+/g, "_")}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
    };
    html2pdf().set(opt).from(reportRef.current).save();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-line rounded-card shadow-2xl w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-line bg-surface">
          <div>
            <h3 className="font-semibold text-lg text-ink">Student Report Cards — Section {sectionName}</h3>
            <p className="text-xs text-ink-secondary">{examName} · Term 1 (2026-27)</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-hover flex items-center justify-center text-ink-secondary hover:text-ink transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Student List Sidebar */}
          <div className="w-64 border-r border-line bg-slate-50 overflow-y-auto shrink-0 flex flex-col p-2 space-y-1">
            <div className="px-3 py-2 text-xs font-bold text-ink-secondary uppercase tracking-wider">
              Students ({SAMPLE_STUDENT_REPORTS.length})
            </div>
            {SAMPLE_STUDENT_REPORTS.map((st) => {
              const isSelected = st.id === currentStudent.id;
              return (
                <button
                  key={st.id}
                  onClick={() => setSelectedStudentId(st.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-white text-primary font-bold shadow-xs border border-line"
                      : "text-ink hover:bg-surface hover:text-primary"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-ink-secondary font-semibold shrink-0">#{st.rollNo}</span>
                    <span className="truncate">{st.name}</span>
                  </div>
                  {st.isFeeWithheld ? (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded shrink-0 border border-amber-200">
                      Withheld
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-success bg-success/10 px-1.5 py-0.5 rounded shrink-0">
                      Pass
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Report Card Preview Panel */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100 flex justify-center">
            
            <div
              ref={reportRef}
              className="w-full max-w-[760px] bg-white border border-slate-300 rounded-lg p-6 sm:p-8 shadow-sm font-sans text-ink space-y-6"
            >
              {/* Withheld Watermark Banner if fee unpaid */}
              {currentStudent.isFeeWithheld && (
                <div className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-lg p-3 text-center text-amber-900 text-xs">
                  <span className="font-bold uppercase tracking-wider block text-amber-800">Notice: Report Card Withheld for Fee Dues</span>
                  <span>Outstanding fee amount of ₹{currentStudent.feeDueAmount?.toLocaleString()} is pending. Official copy is withheld until settlement.</span>
                </div>
              )}

              {/* School Header */}
              <div className="text-center border-b-2 border-slate-800 pb-4">
                <div className="text-xs uppercase font-bold tracking-widest text-primary mb-1">
                  {instituteBoard.toUpperCase().includes("BOARD") || instituteBoard.toUpperCase().includes("CBSE")
                    ? instituteBoard
                    : `${instituteBoard} · Academic Board`}
                </div>
                <div className="flex items-center justify-center gap-3">
                  {instituteLogo && (
                    <img
                      src={instituteLogo}
                      alt={instituteName}
                      className="w-12 h-12 object-contain rounded"
                    />
                  )}
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                    {instituteName.toUpperCase()}
                  </h1>
                </div>
                <p className="text-xs text-ink-secondary mt-1">
                  {instituteSubDetails}
                </p>
                <div className="mt-3 inline-block px-4 py-1 bg-slate-900 text-white rounded text-xs font-bold uppercase tracking-widest">
                  Academic Progress Report · {examName} (2026-27)
                </div>
              </div>

              {/* Student Bio Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 border border-slate-200 p-3.5 rounded-lg">
                <div>
                  <span className="text-ink-secondary block">Student Name:</span>
                  <span className="font-bold text-ink text-small">{currentStudent.name}</span>
                </div>
                <div>
                  <span className="text-ink-secondary block">Roll Number:</span>
                  <span className="font-mono font-bold text-primary text-small">{currentStudent.rollNo}</span>
                </div>
                <div>
                  <span className="text-ink-secondary block">Admission Number:</span>
                  <span className="font-mono font-medium text-ink">{currentStudent.admissionNo}</span>
                </div>
                <div>
                  <span className="text-ink-secondary block">Class & Section:</span>
                  <span className="font-bold text-ink">Class {sectionName}</span>
                </div>
                <div>
                  <span className="text-ink-secondary block">Father's Name:</span>
                  <span className="font-medium text-ink">{currentStudent.fatherName}</span>
                </div>
                <div>
                  <span className="text-ink-secondary block">Attendance:</span>
                  <span className="font-mono font-medium text-ink">{currentStudent.attendance}</span>
                </div>
              </div>

              {/* Part 1: Scholastic Areas */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center justify-between">
                  <span>Part 1: Scholastic Performance</span>
                  <span className="text-[11px] font-normal text-ink-secondary">Grading Scale: A1 (91–100) to E (Below 33)</span>
                </div>
                <table className="w-full border-collapse border border-slate-300 text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-ink">
                      <th className="border border-slate-300 px-3 py-2 text-left font-bold">Subject</th>
                      <th className="border border-slate-300 px-2 py-2 text-center font-semibold">Periodic Test<br/>/10</th>
                      <th className="border border-slate-300 px-2 py-2 text-center font-semibold">Notebook<br/>/5</th>
                      <th className="border border-slate-300 px-2 py-2 text-center font-semibold">Sub Enrich.<br/>/5</th>
                      <th className="border border-slate-300 px-2 py-2 text-center font-semibold">Half-Yearly<br/>/80</th>
                      <th className="border border-slate-300 px-2 py-2 text-center font-bold bg-slate-200/60">Total<br/>/100</th>
                      <th className="border border-slate-300 px-2 py-2 text-center font-bold">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStudent.subjects.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="border border-slate-300 px-3 py-2 font-semibold text-ink">{sub.name}</td>
                        <td className="border border-slate-300 px-2 py-2 text-center font-mono">{sub.pt}</td>
                        <td className="border border-slate-300 px-2 py-2 text-center font-mono">{sub.nb}</td>
                        <td className="border border-slate-300 px-2 py-2 text-center font-mono">{sub.se}</td>
                        <td className="border border-slate-300 px-2 py-2 text-center font-mono">{sub.hy}</td>
                        <td className="border border-slate-300 px-2 py-2 text-center font-mono font-bold bg-slate-50">{sub.total}</td>
                        <td className="border border-slate-300 px-2 py-2 text-center font-mono font-bold text-primary">{sub.grade}</td>
                      </tr>
                    ))}
                    {/* Summary row */}
                    <tr className="bg-slate-100/80 font-bold">
                      <td className="border border-slate-300 px-3 py-2">Grand Total & Percentage</td>
                      <td colSpan={4} className="border border-slate-300 px-2 py-2 text-right text-ink-secondary">
                        Overall Percentage: <span className="text-ink text-sm font-mono">{percentage}%</span>
                      </td>
                      <td className="border border-slate-300 px-2 py-2 text-center font-mono text-sm bg-slate-200/80">
                        {totalObtained} / {maxTotal}
                      </td>
                      <td className="border border-slate-300 px-2 py-2 text-center text-primary font-mono text-sm">
                        {Number(percentage) >= 90 ? "A1" : Number(percentage) >= 80 ? "A2" : "B1"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Part 2: Co-Scholastic & Remarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                    Part 2: Co-Scholastic Activities (Scale A–C)
                  </div>
                  <table className="w-full border-collapse border border-slate-300">
                    <tbody>
                      {currentStudent.coScholastic.map((co, i) => (
                        <tr key={i}>
                          <td className="border border-slate-300 px-3 py-1.5 font-medium">{co.activity}</td>
                          <td className="border border-slate-300 px-3 py-1.5 font-bold font-mono text-center text-primary w-16">{co.grade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border border-slate-300 rounded p-3 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <span className="font-bold uppercase tracking-wider text-slate-800 block mb-1">Class Teacher Remarks:</span>
                    <p className="italic text-ink-secondary leading-relaxed">"{currentStudent.remarks}"</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-ink">Result Status:</span>
                    <span className={`font-bold px-2 py-0.5 rounded ${currentStudent.isFeeWithheld ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                      {currentStudent.isFeeWithheld ? "WITHHELD (Dues)" : "PASSED & PROMOTED"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-8 flex justify-between items-end text-center text-xs">
                <div className="w-36 border-t border-slate-400 pt-1">
                  <span className="font-medium text-ink-secondary">Class Teacher</span>
                </div>
                <div className="w-36 border-t border-slate-400 pt-1">
                  <span className="font-medium text-ink-secondary">Exam Coordinator</span>
                </div>
                <div className="w-40 border-t border-slate-400 pt-1">
                  <span className="font-bold text-ink">{principalName}</span>
                  <div className="text-[10px] text-ink-secondary truncate max-w-[160px] mx-auto">
                    {instituteName}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-line bg-surface">
          <span className="text-xs text-ink-secondary">
            Generated according to CBSE 2026-27 assessment scheme.
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-line-input rounded-control text-ink text-small font-medium hover:bg-surface-hover"
            >
              Close
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 border border-line-input rounded-control text-ink text-small font-medium hover:bg-surface-hover flex items-center gap-1.5"
            >
              <FiPrinter size={15} />
              Print
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-control text-small font-semibold flex items-center gap-2 shadow-sm transition-colors"
            >
              <FiDownload size={15} />
              Download PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
