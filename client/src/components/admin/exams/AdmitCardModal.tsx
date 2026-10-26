import React, { useState, useRef, useEffect } from "react";
import { FiPrinter, FiX, FiChevronDown, FiUser, FiCalendar, FiClock, FiCheck } from "react-icons/fi";
import api from "../../../api/axiosInstance";

interface StudentItem {
  id: string;
  rollNo: string;
  name: string;
  admissionNo: string;
  fatherName: string;
  className: string;
  section: string;
}

interface PaperItem {
  date: string;
  time: string;
  subject: string;
}

interface AdmitCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  examName: string;
  termName?: string;
  classes: string[];
  papers: PaperItem[];
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

const SAMPLE_STUDENTS: StudentItem[] = [
  { id: "1", rollNo: "01", name: "Aditi Sharma", admissionNo: "ADM-2024-0821", fatherName: "Rakesh Sharma", className: "8", section: "B" },
  { id: "2", rollNo: "02", name: "Bhavesh Kumar", admissionNo: "ADM-2024-0822", fatherName: "Manoj Kumar", className: "8", section: "B" },
  { id: "3", rollNo: "03", name: "Chirag Singhal", admissionNo: "ADM-2024-0823", fatherName: "Deepak Singhal", className: "8", section: "B" },
  { id: "4", rollNo: "04", name: "Divya Patel", admissionNo: "ADM-2024-0824", fatherName: "Sanjay Patel", className: "8", section: "B" },
  { id: "5", rollNo: "05", name: "Garvit Jain", admissionNo: "ADM-2024-0825", fatherName: "Rajesh Jain", className: "8", section: "B" },
  { id: "6", rollNo: "06", name: "Harsh Vardhan", admissionNo: "ADM-2024-0826", fatherName: "Anil Vardhan", className: "8", section: "A" },
  { id: "7", rollNo: "07", name: "Isha Kanwar", admissionNo: "ADM-2024-0827", fatherName: "Birendra Singh", className: "8", section: "B" },
  { id: "8", rollNo: "08", name: "Kunal Mehra", admissionNo: "ADM-2024-0828", fatherName: "Sunil Mehra", className: "7", section: "C" },
];

export default function AdmitCardModal({
  isOpen,
  onClose,
  examName,
  termName = "Term 1 (2026-27)",
  classes,
  papers,
  instituteInfo,
}: AdmitCardModalProps) {
  const [selectedClass, setSelectedClass] = useState("8");
  const [selectedSection, setSelectedSection] = useState("B");
  const [selectedStudentId, setSelectedStudentId] = useState("1");
  const printAreaRef = useRef<HTMLDivElement>(null);

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
    "CBSE";

  if (!isOpen) return null;

  const filteredStudents = SAMPLE_STUDENTS.filter(
    (s) => s.className === selectedClass && (selectedSection === "ALL" || s.section === selectedSection)
  );

  const currentStudent =
    filteredStudents.find((s) => s.id === selectedStudentId) ||
    filteredStudents[0] ||
    SAMPLE_STUDENTS[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-line rounded-card shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-surface">
          <div>
            <h3 className="font-semibold text-lg text-ink">Print Admit Cards</h3>
            <p className="text-xs text-ink-secondary">{examName} · {termName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-hover flex items-center justify-center text-ink-secondary hover:text-ink transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 px-6 py-3 border-b border-line bg-slate-50/70 text-small">
          <label className="flex items-center gap-2 text-ink-secondary font-medium">
            Class
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  const first = SAMPLE_STUDENTS.find(s => s.className === e.target.value);
                  if (first) setSelectedStudentId(first.id);
                }}
                className="min-h-[36px] pl-3 pr-8 border border-line-input rounded-control bg-white text-ink text-small focus:outline-none focus:border-primary cursor-pointer appearance-none"
              >
                {classes.map((cls) => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-secondary pointer-events-none" size={14} />
            </div>
          </label>

          <label className="flex items-center gap-2 text-ink-secondary font-medium">
            Section
            <div className="relative">
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="min-h-[36px] pl-3 pr-8 border border-line-input rounded-control bg-white text-ink text-small focus:outline-none focus:border-primary cursor-pointer appearance-none"
              >
                <option value="ALL">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
              <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-secondary pointer-events-none" size={14} />
            </div>
          </label>

          <label className="flex items-center gap-2 text-ink-secondary font-medium ml-auto">
            Student Preview
            <div className="relative">
              <select
                value={currentStudent.id}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="min-h-[36px] pl-3 pr-8 border border-line-input rounded-control bg-white text-ink text-small focus:outline-none focus:border-primary cursor-pointer appearance-none max-w-[220px]"
              >
                {filteredStudents.map((st) => (
                  <option key={st.id} value={st.id}>
                    Roll {st.rollNo} — {st.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-secondary pointer-events-none" size={14} />
            </div>
          </label>
        </div>

        {/* Admit Card Preview Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100 flex justify-center">
          <div
            ref={printAreaRef}
            className="w-full max-w-[720px] bg-white border-2 border-slate-300 rounded-lg p-6 shadow-sm font-sans text-ink space-y-5"
          >
            {/* School Header */}
            <div className="text-center border-b-2 border-primary/20 pb-4">
              <div className="inline-block px-3 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider mb-1">
                {instituteBoard.toUpperCase().includes("AFFILIATED") ? instituteBoard : `${instituteBoard} Affiliated`}
              </div>
              <div className="flex items-center justify-center gap-2.5">
                {instituteLogo && (
                  <img src={instituteLogo} alt={instituteName} className="w-10 h-10 object-contain rounded" />
                )}
                <h2 className="text-2xl font-bold text-ink">{instituteName}</h2>
              </div>
              <p className="text-xs text-ink-secondary mt-0.5">{instituteSubDetails}</p>
              <div className="mt-2 inline-block px-4 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-bold uppercase tracking-widest text-slate-800">
                Official Admit Card — {examName.toUpperCase()} (2026-27)
              </div>
            </div>

            {/* Student Particulars */}
            <div className="flex gap-4 items-start justify-between bg-slate-50 border border-line p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[13px] flex-1">
                <div>
                  <span className="text-ink-secondary block text-xs">Student Name</span>
                  <span className="font-semibold text-ink text-[14px]">{currentStudent.name}</span>
                </div>
                <div>
                  <span className="text-ink-secondary block text-xs">Roll Number</span>
                  <span className="font-mono font-bold text-primary text-[15px]">{currentStudent.rollNo}</span>
                </div>
                <div>
                  <span className="text-ink-secondary block text-xs">Admission No.</span>
                  <span className="font-mono font-medium text-ink">{currentStudent.admissionNo}</span>
                </div>
                <div>
                  <span className="text-ink-secondary block text-xs">Class & Section</span>
                  <span className="font-semibold text-ink">Class {currentStudent.className}-{currentStudent.section}</span>
                </div>
                <div>
                  <span className="text-ink-secondary block text-xs">Father's Name</span>
                  <span className="font-medium text-ink">{currentStudent.fatherName}</span>
                </div>
                <div>
                  <span className="text-ink-secondary block text-xs">Examination Center</span>
                  <span className="font-medium text-ink">Main Academic Wing, 2nd Floor</span>
                </div>
              </div>

              {/* Photo Box */}
              <div className="w-24 h-28 border-2 border-dashed border-slate-300 rounded bg-white flex flex-col items-center justify-center text-center p-1 shrink-0">
                <FiUser size={28} className="text-slate-300 mb-1" />
                <span className="text-[10px] text-slate-400 font-medium leading-tight">Student Photograph</span>
              </div>
            </div>

            {/* Timetable Table */}
            <div>
              <div className="text-xs font-bold text-ink uppercase tracking-wider mb-2">Examination Schedule</div>
              <table className="w-full border-collapse border border-slate-300 text-[13px]">
                <thead>
                  <tr className="bg-slate-100 text-left">
                    <th className="border border-slate-300 px-3 py-2 font-semibold">Date</th>
                    <th className="border border-slate-300 px-3 py-2 font-semibold">Time</th>
                    <th className="border border-slate-300 px-3 py-2 font-semibold">Subject</th>
                    <th className="border border-slate-300 px-3 py-2 font-semibold text-center w-32">Invigilator Sign</th>
                  </tr>
                </thead>
                <tbody>
                  {papers.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="border border-slate-300 px-3 py-1.5 font-medium whitespace-nowrap">{p.date}</td>
                      <td className="border border-slate-300 px-3 py-1.5 font-mono text-xs text-ink-secondary">{p.time}</td>
                      <td className="border border-slate-300 px-3 py-1.5 font-semibold text-ink">{p.subject}</td>
                      <td className="border border-slate-300 px-3 py-1.5"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Candidate Instructions */}
            <div className="border border-amber-200 bg-amber-50/50 p-3 rounded text-[11px] text-amber-900 space-y-1">
              <p className="font-bold uppercase tracking-wide text-amber-800">Candidate Instructions:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Candidates must enter the examination room 15 minutes before the scheduled time.</li>
                <li>No candidate will be allowed entry without this original admit card and uniform.</li>
                <li>Mobile phones, electronic calculators, smartwatches, or papers are strictly forbidden.</li>
              </ul>
            </div>

            {/* Signatures */}
            <div className="pt-6 flex justify-between items-end text-center text-xs">
              <div className="w-40 border-t border-slate-400 pt-1">
                <span className="font-medium text-ink-secondary">Candidate's Signature</span>
              </div>
              <div className="w-40 border-t border-slate-400 pt-1">
                <span className="font-medium text-ink-secondary">Class Teacher's Sign</span>
              </div>
              <div className="w-44 border-t border-slate-400 pt-1">
                <div className="text-[11px] font-bold text-primary mb-0.5 truncate">{instituteName}</div>
                <span className="font-bold text-ink">Principal & Controller</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-line bg-surface">
          <span className="text-xs text-ink-secondary">
            Ready to print for {filteredStudents.length} students of Class {selectedClass}-{selectedSection}
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-line-input rounded-control text-ink text-small font-medium hover:bg-surface-hover"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-control text-small font-semibold flex items-center gap-2 shadow-sm transition-colors"
            >
              <FiPrinter size={16} />
              Print Admit Cards
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
