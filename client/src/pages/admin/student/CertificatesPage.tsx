import React, { useState, useEffect, useMemo } from "react";
import {
  FiCheckCircle,
  FiPrinter,
  FiDownload,
  FiSearch,
  FiFileText,
  FiAlertCircle,
  FiShield,
  FiUser,
  FiAward,
  FiCalendar,
  FiDollarSign,
  FiCheck,
  FiEye,
  FiClock,
  FiFilter,
  FiFilePlus
} from "react-icons/fi";
import api from "../../../api/axiosInstance";
import { useToast } from "../../../context/ToastContext";
import StudentModuleNav from "../../../components/admin/student/StudentModuleNav";

type CertType = "tc" | "bonafide" | "character" | "fee" | "dob" | "register";

interface IssuedRecord {
  id: string;
  certNo: string;
  type: "tc" | "bonafide" | "character" | "fee" | "dob";
  typeLabel: string;
  studentName: string;
  classGrade: string;
  admNo: string;
  issueDate: string;
  purpose: string;
  status: "Active" | "Cancelled";
}

export default function CertificatesPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<CertType>("tc");
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  // Default demo student
  const defaultStudent = {
    name: "Riya Choudhary",
    classGrade: "10-A",
    admNo: "2016/0112",
    rollNo: "18",
    tcNo: "TC/2627/0031",
    fatherName: "Sunil Choudhary",
    motherName: "Sunita Choudhary",
    dob: "14-08-2011",
    dobWords: "Fourteenth August Two Thousand Eleven",
    nationality: "Indian",
    gender: "Female"
  };

  // Form Parameters for different certificate types
  // 1. TC Parameters
  const [dateOfLeaving, setDateOfLeaving] = useState("2026-10-09");
  const [reason, setReason] = useState("Parent's transfer to another city");
  const [conduct, setConduct] = useState("Very good");
  const [tcPromoted, setTcPromoted] = useState("Promoted to Class 11");

  // 2. Bonafide Parameters
  const [bonafidePurpose, setBonafidePurpose] = useState("Passport / Visa application");
  const [bonafideValidUpto, setBonafideValidUpto] = useState("31-03-2027");
  const [academicSession, setAcademicSession] = useState("2026-27");

  // 3. Character Parameters
  const [studyPeriod, setStudyPeriod] = useState("April 2021 to March 2027");
  const [characterRating, setCharacterRating] = useState("Exemplary");
  const [coCurricular, setCoCurricular] = useState("Active participant in Inter-School Debates and School Volleyball Team");
  const [academicRemark, setAcademicRemark] = useState("Consistently maintained Grade A academic performance");

  // 4. Fee Paid Certificate Parameters
  const [feeFY, setFeeFY] = useState("2026-27");
  const [tuitionFee, setTuitionFee] = useState("48,000");
  const [termFee, setTermFee] = useState("12,000");
  const [receiptRefs, setReceiptRefs] = useState("REC-2026-0042, REC-2026-0189");
  const [parentPan, setParentPan] = useState("ABCDE1234F");

  // 5. DOB Certificate Parameters
  const [dobFigures, setDobFigures] = useState("14-08-2011");
  const [dobWords, setDobWords] = useState("Fourteenth August Two Thousand Eleven");
  const [placeOfBirth, setPlaceOfBirth] = useState("Jaipur, Rajasthan");
  const [registerEntry, setRegisterEntry] = useState("Vol. IV, Page 82, Entry #112");

  // Register state & search/filter
  const [registerSearch, setRegisterSearch] = useState("");
  const [registerTypeFilter, setRegisterTypeFilter] = useState("all");
  const [issuedRecords, setIssuedRecords] = useState<IssuedRecord[]>([
    {
      id: "1",
      certNo: "TC/2627/0031",
      type: "tc",
      typeLabel: "Transfer Certificate",
      studentName: "Riya Choudhary",
      classGrade: "10-A",
      admNo: "2016/0112",
      issueDate: "2026-10-09",
      purpose: "Parent's transfer to another city",
      status: "Active"
    },
    {
      id: "2",
      certNo: "BF/2627/0142",
      type: "bonafide",
      typeLabel: "Bonafide Certificate",
      studentName: "Indu Patil",
      classGrade: "11-A",
      admNo: "ADM-11-A-7",
      issueDate: "2026-10-04",
      purpose: "Passport / Visa application",
      status: "Active"
    },
    {
      id: "3",
      certNo: "CC/2627/0088",
      type: "character",
      typeLabel: "Character Certificate",
      studentName: "Tarun",
      classGrade: "12-A",
      admNo: "2026/0002",
      issueDate: "2026-09-28",
      purpose: "College admission clearance",
      status: "Active"
    },
    {
      id: "4",
      certNo: "FEE/2627/0215",
      type: "fee",
      typeLabel: "Fee Paid Certificate",
      studentName: "Manoj Kapoor",
      classGrade: "11-A",
      admNo: "ADM-11-A-2",
      issueDate: "2026-09-15",
      purpose: "Income Tax u/s 80C rebate",
      status: "Active"
    },
    {
      id: "5",
      certNo: "DOB/2627/0056",
      type: "dob",
      typeLabel: "Date of Birth",
      studentName: "Gaurav Yadav",
      classGrade: "11-A",
      admNo: "ADM-11-A-10",
      issueDate: "2026-08-20",
      purpose: "Aadhaar correction age proof",
      status: "Active"
    }
  ]);

  // Load real students from backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/admin/students");
        if (res.data?.data && Array.isArray(res.data.data)) {
          setStudentsList(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load students for certificates", err);
      }
    };
    fetchStudents();
  }, []);

  // Current active student
  const currentStudent = useMemo(() => {
    if (!selectedStudentId) return defaultStudent;
    const found = studentsList.find(s => s._id === selectedStudentId);
    if (!found) return defaultStudent;

    const formattedDob = found.dob
      ? new Date(found.dob).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
      : defaultStudent.dob;

    return {
      name: found.name || defaultStudent.name,
      classGrade: found.classId?.name ? `${found.classId.name}${found.sectionId?.name ? `-${found.sectionId.name}` : ""}` : defaultStudent.classGrade,
      admNo: found.admissionNo || `2026/${String(found.rollNo || "001").padStart(4, "0")}`,
      rollNo: String(found.rollNo || defaultStudent.rollNo),
      tcNo: `TC/2627/${String(found.rollNo || "0031").padStart(4, "0")}`,
      fatherName: found.parentName || defaultStudent.fatherName,
      motherName: found.motherName || "Sunita Choudhary",
      dob: formattedDob,
      dobWords: defaultStudent.dobWords,
      nationality: found.nationality || "Indian",
      gender: found.gender || "Female"
    };
  }, [selectedStudentId, studentsList]);

  // Sync date of birth state when student changes
  useEffect(() => {
    if (currentStudent.dob) {
      setDobFigures(currentStudent.dob);
    }
  }, [currentStudent]);

  // Clearance checklist for TC
  const clearances = [
    { label: "Fee Dues", detail: "All installments cleared · balance ₹0", status: "cleared" },
    { label: "Library", detail: "No books currently borrowed", status: "cleared" },
    { label: "Transport", detail: "Route Bus de-allocated", status: "cleared" },
    { label: "Exam Records", detail: "Annual report card finalized", status: "cleared" }
  ];

  // Issue Action Handler
  const handleIssueCertificate = (type: "tc" | "bonafide" | "character" | "fee" | "dob", title: string) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const prefixMap = {
      tc: "TC",
      bonafide: "BF",
      character: "CC",
      fee: "FEE",
      dob: "DOB"
    };
    const newCertNo = `${prefixMap[type]}/2627/${randomSuffix}`;
    const purposeMap = {
      tc: reason,
      bonafide: bonafidePurpose,
      character: "Character & conduct verification",
      fee: `Tuition Fee Certificate FY ${feeFY}`,
      dob: "Date of Birth proof from Scholar Register"
    };

    const newRecord: IssuedRecord = {
      id: String(Date.now()),
      certNo: newCertNo,
      type,
      typeLabel: title,
      studentName: currentStudent.name,
      classGrade: currentStudent.classGrade,
      admNo: currentStudent.admNo,
      issueDate: new Date().toISOString().split("T")[0],
      purpose: purposeMap[type],
      status: "Active"
    };

    setIssuedRecords(prev => [newRecord, ...prev]);
    showToast(`${title} (${newCertNo}) generated and added to register!`, "success");
  };

  const handlePrint = () => {
    window.print();
  };

  // Filtered issued register records
  const filteredRecords = useMemo(() => {
    return issuedRecords.filter(r => {
      if (registerTypeFilter !== "all" && r.type !== registerTypeFilter) return false;
      if (registerSearch.trim()) {
        const query = registerSearch.toLowerCase();
        const matchesName = r.studentName.toLowerCase().includes(query);
        const matchesNo = r.certNo.toLowerCase().includes(query);
        const matchesAdm = r.admNo.toLowerCase().includes(query);
        if (!matchesName && !matchesNo && !matchesAdm) return false;
      }
      return true;
    });
  }, [issuedRecords, registerTypeFilter, registerSearch]);

  const tabsConfig = [
    { key: "tc", label: "Transfer certificate" },
    { key: "bonafide", label: "Bonafide" },
    { key: "character", label: "Character" },
    { key: "fee", label: "Fee paid" },
    { key: "dob", label: "Date of birth" },
    { key: "register", label: "Issued register" }
  ];

  return (
    <div className="flex flex-col gap-6 animate-fadeIn font-sans text-ink w-full pb-12">
      {/* Top Breadcrumb & Nav */}
      <div className="flex flex-col gap-1 pt-1 print:hidden">
        <StudentModuleNav extraContext="Official Records" />
        <div className="flex items-center justify-between flex-wrap gap-4 mt-1">
          <div>
            <h1 className="m-0 text-title font-semibold text-ink tracking-tight">
              {activeTab === "register"
                ? "Official Certificate Register & Records"
                : `${tabsConfig.find(t => t.key === activeTab)?.label} · ${currentStudent.name} (${currentStudent.classGrade})`}
            </h1>
            <p className="text-small text-ink-secondary m-0 mt-0.5">
              {activeTab === "register"
                ? "Central log of all government & academic certificates issued by the institution."
                : "Configure parameters, verify institutional clearance, and preview certificate with digital seal."}
            </p>
          </div>

          {/* Student Selector (visible for certificate issuance tabs) */}
          {activeTab !== "register" && (
            <div className="flex items-center gap-2">
              <span className="text-caption font-semibold text-ink-secondary">Student:</span>
              <select
                value={selectedStudentId}
                onChange={e => setSelectedStudentId(e.target.value)}
                className="px-3 py-1.5 text-small bg-surface border border-line-input rounded-control text-ink focus:outline-none focus:border-primary shadow-2xs font-medium cursor-pointer"
              >
                <option value="">Default: Riya Choudhary (10-A)</option>
                {studentsList.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.classId?.name || "N/A"}{s.sectionId?.name ? `-${s.sectionId.name}` : ""}) · {s.admissionNo || "No Adm No"}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Type Tabs */}
      <div className="flex border-b border-line gap-2 overflow-x-auto print:hidden">
        {tabsConfig.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as CertType)}
            className={`px-4 py-2.5 text-small font-medium whitespace-nowrap border-b-2 transition cursor-pointer ${
              activeTab === tab.key
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-ink-secondary hover:text-ink hover:border-line"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= TAB 1: TRANSFER CERTIFICATE (TC) ================= */}
      {activeTab === "tc" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Config Column */}
          <div className="lg:col-span-5 space-y-5 print:hidden">
            {/* Clearance Checklist */}
            <div className="bg-surface border border-line rounded-card p-5 shadow-2xs space-y-3">
              <h2 className="font-semibold text-small text-ink flex items-center justify-between m-0">
                <span>Clearance checks</span>
                <span className="text-caption font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  All Cleared
                </span>
              </h2>

              <div className="space-y-2.5 divide-y divide-line/60">
                {clearances.map(c => (
                  <div key={c.label} className="pt-2.5 first:pt-0 flex items-center justify-between text-small">
                    <div>
                      <div className="font-medium text-ink">{c.label}</div>
                      <div className="text-ink-secondary text-caption">{c.detail}</div>
                    </div>
                    <span className="font-semibold text-emerald-700 flex items-center gap-1 text-caption">
                      <FiCheckCircle size={14} /> Cleared
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Issue Parameters Form */}
            <div className="bg-surface border border-line rounded-card p-5 shadow-2xs space-y-4">
              <h2 className="font-semibold text-small text-ink m-0">Details for the certificate</h2>

              <div className="space-y-3 text-small">
                <div>
                  <label className="block font-medium text-ink mb-1">Date of leaving</label>
                  <input
                    type="date"
                    value={dateOfLeaving}
                    onChange={e => setDateOfLeaving(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-line-input rounded-control text-ink focus:outline-none focus:border-primary shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-ink mb-1">Reason for leaving</label>
                  <select
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-line-input rounded-control text-ink focus:outline-none focus:border-primary shadow-2xs"
                  >
                    <option>Parent's transfer to another city</option>
                    <option>Completed the highest school grade</option>
                    <option>Admission in residential institute</option>
                    <option>Other personal reasons</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-ink mb-1">Promotion status</label>
                  <input
                    type="text"
                    value={tcPromoted}
                    onChange={e => setTcPromoted(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-line-input rounded-control text-ink focus:outline-none focus:border-primary shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-ink mb-1">General conduct</label>
                  <select
                    value={conduct}
                    onChange={e => setConduct(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-line-input rounded-control text-ink focus:outline-none focus:border-primary shadow-2xs"
                  >
                    <option>Good</option>
                    <option>Very good</option>
                    <option>Exemplary</option>
                    <option>Satisfactory</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleIssueCertificate("tc", "Transfer Certificate")}
                    className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-control font-semibold text-small shadow-xs transition cursor-pointer"
                  >
                    Approve and issue TC
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2.5 border border-line-input rounded-control bg-surface hover:bg-surface-subtle text-ink text-small font-medium flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <FiPrinter size={14} /> Print
                  </button>
                </div>
                <p className="text-caption text-ink-secondary leading-tight m-0">
                  Issuing marks the student as Left. TC numbers never repeat; a cancelled TC keeps its number.
                </p>
              </div>
            </div>
          </div>

          {/* Right Live Preview Column */}
          <div className="lg:col-span-7">
            <div className="bg-surface border border-line rounded-card p-8 shadow-xs space-y-6 print:border-none print:shadow-none print:p-0">
              {/* School Header */}
              <div className="flex items-start justify-between border-b-2 border-ink pb-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-ink uppercase m-0">
                    Gyansthali Enlightening Public School
                  </h2>
                  <p className="text-caption text-ink-secondary m-0 mt-0.5">
                    Affiliated to CBSE · Affiliation No: 1730482 · School Code: 20491
                  </p>
                  <p className="text-caption text-ink-secondary m-0">
                    Campus: Sector 14, Mansarovar, Jaipur · Contact: (0141) 278-9000
                  </p>
                </div>
                <div className="w-16 h-16 border-2 border-dashed border-line rounded-control flex flex-col items-center justify-center text-[10px] text-ink-secondary font-mono">
                  <span>[QR Code]</span>
                  <span className="text-[8px]">Verify TC</span>
                </div>
              </div>

              {/* Certificate Title */}
              <div className="text-center py-2">
                <span className="inline-block px-6 py-1 border-y-2 border-ink font-bold text-small tracking-widest uppercase text-ink">
                  Transfer Certificate
                </span>
              </div>

              {/* Meta Numbers */}
              <div className="flex items-center justify-between text-caption font-mono font-medium">
                <span>TC No: <b>{currentStudent.tcNo}</b></span>
                <span>Admission No: <b>{currentStudent.admNo}</b></span>
              </div>

              {/* Content Table */}
              <div className="space-y-2 text-small divide-y divide-line/60">
                <div className="grid grid-cols-12 py-2">
                  <span className="col-span-1 text-ink-secondary">1.</span>
                  <span className="col-span-5 text-ink-secondary">Name of Student</span>
                  <span className="col-span-6 font-bold text-ink">{currentStudent.name}</span>
                </div>

                <div className="grid grid-cols-12 py-2">
                  <span className="col-span-1 text-ink-secondary">2.</span>
                  <span className="col-span-5 text-ink-secondary">Father's / Guardian's Name</span>
                  <span className="col-span-6 font-semibold text-ink">{currentStudent.fatherName}</span>
                </div>

                <div className="grid grid-cols-12 py-2">
                  <span className="col-span-1 text-ink-secondary">3.</span>
                  <span className="col-span-5 text-ink-secondary">Mother's Name</span>
                  <span className="col-span-6 font-semibold text-ink">{currentStudent.motherName}</span>
                </div>

                <div className="grid grid-cols-12 py-2">
                  <span className="col-span-1 text-ink-secondary">4.</span>
                  <span className="col-span-5 text-ink-secondary">Nationality</span>
                  <span className="col-span-6 font-medium text-ink">{currentStudent.nationality}</span>
                </div>

                <div className="grid grid-cols-12 py-2">
                  <span className="col-span-1 text-ink-secondary">5.</span>
                  <span className="col-span-5 text-ink-secondary">Date of Birth (in Christian Era)</span>
                  <span className="col-span-6 font-mono font-semibold text-ink">{currentStudent.dob}</span>
                </div>

                <div className="grid grid-cols-12 py-2">
                  <span className="col-span-1 text-ink-secondary">6.</span>
                  <span className="col-span-5 text-ink-secondary">Class in which student last studied</span>
                  <span className="col-span-6 font-bold text-ink">Class {currentStudent.classGrade}</span>
                </div>

                <div className="grid grid-cols-12 py-2">
                  <span className="col-span-1 text-ink-secondary">7.</span>
                  <span className="col-span-5 text-ink-secondary">Promotion Status</span>
                  <span className="col-span-6 font-medium text-ink">{tcPromoted}</span>
                </div>

                <div className="grid grid-cols-12 py-2">
                  <span className="col-span-1 text-ink-secondary">8.</span>
                  <span className="col-span-5 text-ink-secondary">Date of Student's Discharge</span>
                  <span className="col-span-6 font-mono font-medium text-ink">{dateOfLeaving}</span>
                </div>

                <div className="grid grid-cols-12 py-2">
                  <span className="col-span-1 text-ink-secondary">9.</span>
                  <span className="col-span-5 text-ink-secondary">Reason for Leaving School</span>
                  <span className="col-span-6 font-medium text-ink">{reason}</span>
                </div>

                <div className="grid grid-cols-12 py-2">
                  <span className="col-span-1 text-ink-secondary">10.</span>
                  <span className="col-span-5 text-ink-secondary">General Conduct</span>
                  <span className="col-span-6 font-semibold text-ink">{conduct}</span>
                </div>
              </div>

              {/* Signature Block */}
              <div className="pt-8 flex items-end justify-between text-caption">
                <div className="text-center space-y-1">
                  <div className="w-28 border-b border-ink/40"></div>
                  <span className="text-ink-secondary text-[11px]">Class Teacher</span>
                </div>
                <div className="text-center space-y-1">
                  <div className="w-28 border-b border-ink/40"></div>
                  <span className="text-ink-secondary text-[11px]">Accountant / Clerk</span>
                </div>
                <div className="text-center space-y-1">
                  <div className="w-32 border-b border-ink"></div>
                  <span className="font-bold text-ink text-[11px]">Principal Seal & Sign</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: BONAFIDE CERTIFICATE ================= */}
      {activeTab === "bonafide" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Config Column */}
          <div className="lg:col-span-5 space-y-5 print:hidden">
            <div className="bg-surface border border-line rounded-card p-5 shadow-2xs space-y-4">
              <h2 className="font-semibold text-small text-ink m-0">Bonafide Certificate Details</h2>

              <div className="space-y-3 text-small">
                <div>
                  <label className="block font-medium text-ink mb-1">Purpose of Certificate</label>
                  <select
                    value={bonafidePurpose}
                    onChange={e => setBonafidePurpose(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-line-input rounded-control text-ink focus:outline-none focus:border-primary shadow-2xs"
                  >
                    <option>Passport / Visa application</option>
                    <option>Bank Account Opening</option>
                    <option>Scholarship / Financial Aid Application</option>
                    <option>State Roadways Bus Concession Pass</option>
                    <option>Higher Education / Entrance Verification</option>
                    <option>Government Scheme Enrollment</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-ink mb-1">Academic Session</label>
                  <input
                    type="text"
                    value={academicSession}
                    onChange={e => setAcademicSession(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-line-input rounded-control text-ink focus:outline-none focus:border-primary shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-ink mb-1">Certificate Valid Upto</label>
                  <input
                    type="text"
                    value={bonafideValidUpto}
                    onChange={e => setBonafideValidUpto(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-line-input rounded-control text-ink focus:outline-none focus:border-primary shadow-2xs"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleIssueCertificate("bonafide", "Bonafide Certificate")}
                    className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-control font-semibold text-small shadow-xs transition cursor-pointer"
                  >
                    Issue Bonafide Certificate
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2.5 border border-line-input rounded-control bg-surface hover:bg-surface-subtle text-ink text-small font-medium flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <FiPrinter size={14} /> Print
                  </button>
                </div>
                <p className="text-caption text-ink-secondary leading-tight m-0">
                  Bonafide certificates are registered with a tamper-proof verification ID valid for administrative institutions.
                </p>
              </div>
            </div>
          </div>

          {/* Right Live Preview Column */}
          <div className="lg:col-span-7">
            <div className="bg-surface border border-line rounded-card p-8 shadow-xs space-y-6 print:border-none print:shadow-none print:p-0">
              {/* Header */}
              <div className="flex items-start justify-between border-b-2 border-ink pb-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-ink uppercase m-0">
                    Gyansthali Enlightening Public School
                  </h2>
                  <p className="text-caption text-ink-secondary m-0 mt-0.5">
                    Affiliated to CBSE, New Delhi · Affiliation No: 1730482
                  </p>
                  <p className="text-caption text-ink-secondary m-0">
                    Campus: Sector 14, Mansarovar, Jaipur (Rajasthan) · Tel: (0141) 278-9000
                  </p>
                </div>
                <div className="w-16 h-16 border-2 border-dashed border-line rounded-control flex flex-col items-center justify-center text-[10px] text-ink-secondary font-mono">
                  <span>[QR Code]</span>
                  <span className="text-[8px]">Official</span>
                </div>
              </div>

              {/* Title */}
              <div className="text-center py-3">
                <span className="inline-block px-8 py-1.5 border-y-2 border-ink font-bold text-base tracking-widest uppercase text-ink">
                  Bonafide Certificate
                </span>
              </div>

              {/* Ref Details */}
              <div className="flex items-center justify-between text-caption font-mono font-medium text-ink-secondary">
                <span>Ref No: <b className="text-ink">BF/2627/0142</b></span>
                <span>Date: <b className="text-ink">{new Date().toLocaleDateString("en-GB")}</b></span>
              </div>

              {/* Body Content */}
              <div className="space-y-4 text-body leading-relaxed text-ink/90 py-2 text-justify">
                <p className="m-0">
                  This is to certify that <b>{currentStudent.gender === "Female" ? "Miss" : "Master"} {currentStudent.name}</b>, Son/Daughter of <b>Shri {currentStudent.fatherName}</b> and <b>Smt. {currentStudent.motherName}</b>, bearing Admission Number <b>{currentStudent.admNo}</b>, is a bonafide and regular student of this institution.
                </p>
                <p className="m-0">
                  He/She is presently studying in <b>Class {currentStudent.classGrade}</b> during the academic session <b>{academicSession}</b>.
                </p>
                <p className="m-0">
                  As per the official School Scholar & Admission Register, his/her recorded Date of Birth is <b>{currentStudent.dob}</b>. To the best of our knowledge, he/she bears an exemplary moral character and pleasant conduct.
                </p>
                <p className="m-0">
                  This certificate is being granted upon the written request of the parent/guardian for the purpose of <b>{bonafidePurpose}</b> and remains valid until <b>{bonafideValidUpto}</b>.
                </p>
              </div>

              {/* Signatures */}
              <div className="pt-12 flex items-end justify-between text-caption">
                <div className="text-center space-y-1">
                  <div className="w-32 border-b border-ink/40"></div>
                  <span className="text-ink-secondary text-[11px]">Class In-charge</span>
                </div>
                <div className="text-center space-y-1">
                  <div className="w-36 border-b border-ink"></div>
                  <span className="font-bold text-ink text-[11px]">Principal Seal & Signature</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: CHARACTER CERTIFICATE ================= */}
      {activeTab === "character" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Config Column */}
          <div className="lg:col-span-5 space-y-5 print:hidden">
            <div className="bg-surface border border-line rounded-card p-5 shadow-2xs space-y-4">
              <h2 className="font-semibold text-small text-ink m-0">Character Certificate Parameters</h2>

              <div className="space-y-3 text-small">
                <div>
                  <label className="block font-medium text-ink mb-1">Tenure / Period of Study</label>
                  <input
                    type="text"
                    value={studyPeriod}
                    onChange={e => setStudyPeriod(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-line-input rounded-control text-ink focus:outline-none focus:border-primary shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-ink mb-1">Moral Conduct & Discipline</label>
                  <select
                    value={characterRating}
                    onChange={e => setCharacterRating(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-line-input rounded-control text-ink focus:outline-none focus:border-primary shadow-2xs"
                  >
                    <option>Exemplary</option>
                    <option>Excellent</option>
                    <option>Very Good</option>
                    <option>Good</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-ink mb-1">Co-Curricular / Sports Participation</label>
                  <textarea
                    rows={2}
                    value={coCurricular}
                    onChange={e => setCoCurricular(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-line-input rounded-control text-ink focus:outline-none focus:border-primary shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-ink mb-1">Academic Performance Remark</label>
                  <input
                    type="text"
                    value={academicRemark}
                    onChange={e => setAcademicRemark(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-line-input rounded-control text-ink focus:outline-none focus:border-primary shadow-2xs"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleIssueCertificate("character", "Character Certificate")}
                    className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-control font-semibold text-small shadow-xs transition cursor-pointer"
                  >
                    Issue Character Certificate
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2.5 border border-line-input rounded-control bg-surface hover:bg-surface-subtle text-ink text-small font-medium flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <FiPrinter size={14} /> Print
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Live Preview Column */}
          <div className="lg:col-span-7">
            <div className="bg-surface border border-line rounded-card p-8 shadow-xs space-y-6 print:border-none print:shadow-none print:p-0">
              <div className="flex items-start justify-between border-b-2 border-ink pb-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-ink uppercase m-0">
                    Gyansthali Enlightening Public School
                  </h2>
                  <p className="text-caption text-ink-secondary m-0 mt-0.5">
                    Affiliated to CBSE, New Delhi · Affiliation No: 1730482
                  </p>
                  <p className="text-caption text-ink-secondary m-0">
                    Campus: Sector 14, Mansarovar, Jaipur · Tel: (0141) 278-9000
                  </p>
                </div>
                <div className="w-16 h-16 border-2 border-dashed border-line rounded-control flex flex-col items-center justify-center text-[10px] text-ink-secondary font-mono">
                  <span>[Seal]</span>
                  <span className="text-[8px]">Conduct</span>
                </div>
              </div>

              <div className="text-center py-2">
                <span className="inline-block px-8 py-1.5 border-y-2 border-ink font-bold text-base tracking-widest uppercase text-ink">
                  Character & Conduct Certificate
                </span>
              </div>

              <div className="flex items-center justify-between text-caption font-mono font-medium text-ink-secondary">
                <span>Ref No: <b className="text-ink">CC/2627/0088</b></span>
                <span>Date of Issue: <b className="text-ink">{new Date().toLocaleDateString("en-GB")}</b></span>
              </div>

              <div className="space-y-4 text-body leading-relaxed text-ink/90 text-justify">
                <p className="m-0">
                  This is to certify that <b>{currentStudent.name}</b>, Son/Daughter of <b>Shri {currentStudent.fatherName}</b>, bearing Admission No. <b>{currentStudent.admNo}</b>, has been a regular student of this institution from <b>{studyPeriod}</b>, currently enrolled in <b>Class {currentStudent.classGrade}</b>.
                </p>
                <p className="m-0">
                  During his/her tenure at Gyansthali Enlightening Public School, his/her general conduct, behavioral discipline, and moral character have been found to be <b>{characterRating}</b>.
                </p>
                <p className="m-0">
                  <b>Co-curricular & Sports Highlights:</b> {coCurricular}.
                </p>
                <p className="m-0">
                  <b>Academic Assessment:</b> {academicRemark}.
                </p>
                <p className="m-0">
                  He/She has never been found engaged in any activity detrimental to the discipline and reputation of the institution. We wish him/her brilliant success in all future educational pursuits and life endeavors.
                </p>
              </div>

              <div className="pt-10 flex items-end justify-between text-caption">
                <div className="text-center space-y-1">
                  <div className="w-28 border-b border-ink/40"></div>
                  <span className="text-ink-secondary text-[11px]">Class Teacher</span>
                </div>
                <div className="text-center space-y-1">
                  <div className="w-28 border-b border-ink/40"></div>
                  <span className="text-ink-secondary text-[11px]">Vice Principal</span>
                </div>
                <div className="text-center space-y-1">
                  <div className="w-32 border-b border-ink"></div>
                  <span className="font-bold text-ink text-[11px]">Principal Seal & Sign</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: FEE PAID CERTIFICATE ================= */}
      {activeTab === "fee" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Config Column */}
          <div className="lg:col-span-5 space-y-5 print:hidden">
            <div className="bg-surface border border-line rounded-card p-5 shadow-2xs space-y-4">
              <h2 className="font-semibold text-small text-ink m-0">Tuition Fee Certificate (IT Sec 80C)</h2>

              <div className="space-y-3 text-small">
                <div>
                  <label className="block font-medium text-ink mb-1">Financial Year</label>
                  <select
                    value={feeFY}
                    onChange={e => setFeeFY(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-line-input rounded-control text-ink focus:outline-none focus:border-primary shadow-2xs"
                  >
                    <option value="2026-27">FY 2026-27 (Assessment Year 2027-28)</option>
                    <option value="2025-26">FY 2025-26 (Assessment Year 2026-27)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-ink mb-1">Tuition Fee Paid (₹)</label>
                  <input
                    type="text"
                    value={tuitionFee}
                    onChange={e => setTuitionFee(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-line-input rounded-control text-ink focus:outline-none focus:border-primary shadow-2xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-ink mb-1">Annual / Term Charges (₹)</label>
                  <input
                    type="text"
                    value={termFee}
                    onChange={e => setTermFee(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-line-input rounded-control text-ink focus:outline-none focus:border-primary shadow-2xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-ink mb-1">Parent PAN Number</label>
                  <input
                    type="text"
                    value={parentPan}
                    onChange={e => setParentPan(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-line-input rounded-control text-ink focus:outline-none focus:border-primary shadow-2xs font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block font-medium text-ink mb-1">Payment Receipts Reference</label>
                  <input
                    type="text"
                    value={receiptRefs}
                    onChange={e => setReceiptRefs(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-line-input rounded-control text-ink focus:outline-none focus:border-primary shadow-2xs font-mono text-caption"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleIssueCertificate("fee", "Fee Paid Certificate")}
                    className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-control font-semibold text-small shadow-xs transition cursor-pointer"
                  >
                    Issue Fee Certificate
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2.5 border border-line-input rounded-control bg-surface hover:bg-surface-subtle text-ink text-small font-medium flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <FiPrinter size={14} /> Print
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Live Preview Column */}
          <div className="lg:col-span-7">
            <div className="bg-surface border border-line rounded-card p-8 shadow-xs space-y-6 print:border-none print:shadow-none print:p-0">
              <div className="flex items-start justify-between border-b-2 border-ink pb-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-ink uppercase m-0">
                    Gyansthali Enlightening Public School
                  </h2>
                  <p className="text-caption text-ink-secondary m-0 mt-0.5">
                    CBSE Affiliation: 1730482 · School Code: 20491 · PAN: AABTG5521E
                  </p>
                  <p className="text-caption text-ink-secondary m-0">
                    Mansarovar, Jaipur (Rajasthan) · Email: accounts@gyansthali.edu.in
                  </p>
                </div>
                <div className="w-16 h-16 border-2 border-dashed border-line rounded-control flex flex-col items-center justify-center text-[10px] text-ink-secondary font-mono">
                  <span>[Tax Seal]</span>
                  <span className="text-[8px]">Sec 80C</span>
                </div>
              </div>

              <div className="text-center py-2">
                <span className="inline-block px-6 py-1.5 border-y-2 border-ink font-bold text-base tracking-widest uppercase text-ink">
                  Tuition Fee Certificate
                </span>
                <p className="text-caption text-ink-secondary m-0 mt-1">
                  (Issued for Income Tax deduction under Section 80C of the Income Tax Act, 1961)
                </p>
              </div>

              <div className="flex items-center justify-between text-caption font-mono font-medium text-ink-secondary">
                <span>Ref No: <b className="text-ink">FEE/2627/0215</b></span>
                <span>Date: <b className="text-ink">{new Date().toLocaleDateString("en-GB")}</b></span>
              </div>

              <div className="text-body leading-relaxed text-ink/90 text-justify">
                <p className="m-0">
                  This is to certify that <b>{currentStudent.name}</b>, Child of <b>Shri {currentStudent.fatherName}</b> (PAN: <span className="font-mono font-semibold">{parentPan}</span>), is a bonafide student studying in <b>Class {currentStudent.classGrade}</b>, bearing Admission Number <b>{currentStudent.admNo}</b>.
                </p>
              </div>

              {/* Fee Breakdown Table */}
              <div className="border border-line rounded-card overflow-hidden">
                <table className="w-full text-small text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-head border-b border-line text-ink font-semibold">
                      <th className="py-2.5 px-4">Particulars</th>
                      <th className="py-2.5 px-4">Applicable Financial Year</th>
                      <th className="py-2.5 px-4 text-right">Amount Paid (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/60">
                    <tr>
                      <td className="py-2.5 px-4 font-medium text-ink">Tuition Fee (Eligible u/s 80C)</td>
                      <td className="py-2.5 px-4 text-ink-secondary">FY {feeFY}</td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-ink">₹{tuitionFee}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-medium text-ink">Annual Term & Development Fee</td>
                      <td className="py-2.5 px-4 text-ink-secondary">FY {feeFY}</td>
                      <td className="py-2.5 px-4 text-right font-mono font-medium text-ink">₹{termFee}</td>
                    </tr>
                    <tr className="bg-surface-subtle font-bold text-ink">
                      <td className="py-2.5 px-4" colSpan={2}>Total Fee Remitted</td>
                      <td className="py-2.5 px-4 text-right font-mono text-base text-primary">₹60,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="text-caption text-ink-secondary space-y-1">
                <p className="m-0">Receipt References: <span className="font-mono text-ink">{receiptRefs}</span></p>
                <p className="m-0 italic">
                  Note: As per Section 80C guidelines, deduction is permissible only against tuition fees paid for full-time education. Transport and personal development charges are excluded.
                </p>
              </div>

              <div className="pt-8 flex items-end justify-between text-caption">
                <div className="text-center space-y-1">
                  <div className="w-32 border-b border-ink/40"></div>
                  <span className="text-ink-secondary text-[11px]">Accounts Officer</span>
                </div>
                <div className="text-center space-y-1">
                  <div className="w-36 border-b border-ink"></div>
                  <span className="font-bold text-ink text-[11px]">Principal Seal & Sign</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: DATE OF BIRTH CERTIFICATE ================= */}
      {activeTab === "dob" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Config Column */}
          <div className="lg:col-span-5 space-y-5 print:hidden">
            <div className="bg-surface border border-line rounded-card p-5 shadow-2xs space-y-4">
              <h2 className="font-semibold text-small text-ink m-0">Date of Birth Certificate Details</h2>

              <div className="space-y-3 text-small">
                <div>
                  <label className="block font-medium text-ink mb-1">Date of Birth (in Figures)</label>
                  <input
                    type="text"
                    value={dobFigures}
                    onChange={e => setDobFigures(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-line-input rounded-control text-ink focus:outline-none focus:border-primary shadow-2xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-ink mb-1">Date of Birth (in Words)</label>
                  <input
                    type="text"
                    value={dobWords}
                    onChange={e => setDobWords(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-line-input rounded-control text-ink focus:outline-none focus:border-primary shadow-2xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-medium text-ink mb-1">Place of Birth</label>
                  <input
                    type="text"
                    value={placeOfBirth}
                    onChange={e => setPlaceOfBirth(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-line-input rounded-control text-ink focus:outline-none focus:border-primary shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-ink mb-1">Scholar Register Volume & Entry</label>
                  <input
                    type="text"
                    value={registerEntry}
                    onChange={e => setRegisterEntry(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-line-input rounded-control text-ink focus:outline-none focus:border-primary shadow-2xs font-mono"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleIssueCertificate("dob", "Date of Birth Certificate")}
                    className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-control font-semibold text-small shadow-xs transition cursor-pointer"
                  >
                    Issue DOB Certificate
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2.5 border border-line-input rounded-control bg-surface hover:bg-surface-subtle text-ink text-small font-medium flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <FiPrinter size={14} /> Print
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Live Preview Column */}
          <div className="lg:col-span-7">
            <div className="bg-surface border border-line rounded-card p-8 shadow-xs space-y-6 print:border-none print:shadow-none print:p-0">
              <div className="flex items-start justify-between border-b-2 border-ink pb-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-ink uppercase m-0">
                    Gyansthali Enlightening Public School
                  </h2>
                  <p className="text-caption text-ink-secondary m-0 mt-0.5">
                    Affiliated to CBSE, New Delhi · Affiliation No: 1730482
                  </p>
                  <p className="text-caption text-ink-secondary m-0">
                    Sector 14, Mansarovar, Jaipur · Contact: (0141) 278-9000
                  </p>
                </div>
                <div className="w-16 h-16 border-2 border-dashed border-line rounded-control flex flex-col items-center justify-center text-[10px] text-ink-secondary font-mono">
                  <span>[Birth Record]</span>
                  <span className="text-[8px]">Verified</span>
                </div>
              </div>

              <div className="text-center py-2">
                <span className="inline-block px-8 py-1.5 border-y-2 border-ink font-bold text-base tracking-widest uppercase text-ink">
                  Certificate of Date of Birth
                </span>
                <p className="text-caption text-ink-secondary m-0 mt-1">
                  (Certified extract from Official School Admission Register)
                </p>
              </div>

              <div className="flex items-center justify-between text-caption font-mono font-medium text-ink-secondary">
                <span>Certificate No: <b className="text-ink">DOB/2627/0056</b></span>
                <span>Date: <b className="text-ink">{new Date().toLocaleDateString("en-GB")}</b></span>
              </div>

              <div className="text-body leading-relaxed text-ink/90">
                <p className="m-0 mb-3">
                  This is to solemnly certify that as per the authenticated records in the original Scholar & Admission Register maintained by this institution, the particulars of birth of the student are as recorded below:
                </p>
              </div>

              {/* Particulars Grid */}
              <div className="border border-line rounded-card divide-y divide-line/60 text-small">
                <div className="grid grid-cols-12 p-3 bg-surface">
                  <span className="col-span-5 text-ink-secondary font-medium">1. Name of Student:</span>
                  <span className="col-span-7 font-bold text-ink">{currentStudent.name}</span>
                </div>
                <div className="grid grid-cols-12 p-3 bg-surface-subtle/50">
                  <span className="col-span-5 text-ink-secondary font-medium">2. Father's / Guardian's Name:</span>
                  <span className="col-span-7 font-semibold text-ink">{currentStudent.fatherName}</span>
                </div>
                <div className="grid grid-cols-12 p-3 bg-surface">
                  <span className="col-span-5 text-ink-secondary font-medium">3. Mother's Name:</span>
                  <span className="col-span-7 font-semibold text-ink">{currentStudent.motherName}</span>
                </div>
                <div className="grid grid-cols-12 p-3 bg-surface-subtle/50">
                  <span className="col-span-5 text-ink-secondary font-medium">4. Admission / Scholar No:</span>
                  <span className="col-span-7 font-mono font-bold text-ink">{currentStudent.admNo}</span>
                </div>
                <div className="grid grid-cols-12 p-3 bg-surface">
                  <span className="col-span-5 text-ink-secondary font-medium">5. Date of Birth (in Figures):</span>
                  <span className="col-span-7 font-mono font-bold text-primary text-base">{dobFigures}</span>
                </div>
                <div className="grid grid-cols-12 p-3 bg-surface-subtle/50">
                  <span className="col-span-5 text-ink-secondary font-medium">6. Date of Birth (in Words):</span>
                  <span className="col-span-7 font-semibold text-ink italic">{dobWords}</span>
                </div>
                <div className="grid grid-cols-12 p-3 bg-surface">
                  <span className="col-span-5 text-ink-secondary font-medium">7. Place of Birth:</span>
                  <span className="col-span-7 font-medium text-ink">{placeOfBirth}</span>
                </div>
                <div className="grid grid-cols-12 p-3 bg-surface-subtle/50">
                  <span className="col-span-5 text-ink-secondary font-medium">8. Admission Register Reference:</span>
                  <span className="col-span-7 font-mono text-ink-secondary">{registerEntry}</span>
                </div>
              </div>

              <p className="text-caption text-ink-secondary leading-relaxed m-0">
                Certified that no alteration, overwriting, or discrepancy exists in the scholar register regarding the date of birth of the student.
              </p>

              <div className="pt-8 flex items-end justify-between text-caption">
                <div className="text-center space-y-1">
                  <div className="w-32 border-b border-ink/40"></div>
                  <span className="text-ink-secondary text-[11px]">Admission In-charge</span>
                </div>
                <div className="text-center space-y-1">
                  <div className="w-36 border-b border-ink"></div>
                  <span className="font-bold text-ink text-[11px]">Principal Seal & Sign</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 6: ISSUED REGISTER ================= */}
      {activeTab === "register" && (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "Total Issued", count: issuedRecords.length, color: "text-ink bg-surface" },
              { label: "Transfer Cert.", count: issuedRecords.filter(r => r.type === "tc").length, color: "text-amber-800 bg-amber-50/60" },
              { label: "Bonafide", count: issuedRecords.filter(r => r.type === "bonafide").length, color: "text-blue-800 bg-blue-50/60" },
              { label: "Character", count: issuedRecords.filter(r => r.type === "character").length, color: "text-emerald-800 bg-emerald-50/60" },
              { label: "Fee Paid", count: issuedRecords.filter(r => r.type === "fee").length, color: "text-purple-800 bg-purple-50/60" },
              { label: "Date of Birth", count: issuedRecords.filter(r => r.type === "dob").length, color: "text-teal-800 bg-teal-50/60" }
            ].map(card => (
              <div key={card.label} className={`border border-line rounded-card p-4 shadow-2xs ${card.color}`}>
                <div className="text-caption font-medium opacity-80">{card.label}</div>
                <div className="text-2xl font-bold mt-1 tracking-tight">{card.count}</div>
              </div>
            ))}
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-surface border border-line rounded-card p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-[280px]">
              <div className="relative flex-1">
                <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" />
                <input
                  type="text"
                  placeholder="Search by student name, cert no, or adm no..."
                  value={registerSearch}
                  onChange={e => setRegisterSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-surface-subtle border border-line-input rounded-control text-small text-ink focus:outline-none focus:border-primary shadow-2xs"
                />
              </div>

              <select
                value={registerTypeFilter}
                onChange={e => setRegisterTypeFilter(e.target.value)}
                className="px-3 py-2 bg-surface-subtle border border-line-input rounded-control text-small text-ink focus:outline-none focus:border-primary shadow-2xs font-medium cursor-pointer"
              >
                <option value="all">All Certificate Types</option>
                <option value="tc">Transfer Certificate (TC)</option>
                <option value="bonafide">Bonafide</option>
                <option value="character">Character</option>
                <option value="fee">Fee Paid</option>
                <option value="dob">Date of Birth</option>
              </select>
            </div>

            <button
              onClick={handlePrint}
              className="px-4 py-2 border border-line-input rounded-control bg-surface hover:bg-surface-subtle text-ink text-small font-medium flex items-center gap-1.5 transition cursor-pointer"
            >
              <FiPrinter size={14} /> Print Register
            </button>
          </div>

          {/* Records Table */}
          <div className="bg-surface border border-line rounded-card shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse font-sans text-small min-w-[900px]">
                <thead>
                  <tr className="bg-surface-head border-b border-line text-ink font-semibold">
                    <th className="py-3 px-4 text-left align-middle whitespace-nowrap">Cert No.</th>
                    <th className="py-3 px-4 text-left align-middle whitespace-nowrap">Certificate Type</th>
                    <th className="py-3 px-4 text-left align-middle min-w-[180px]">Student Name</th>
                    <th className="py-3 px-4 text-left align-middle whitespace-nowrap">Class</th>
                    <th className="py-3 px-4 text-left align-middle whitespace-nowrap">Adm. No.</th>
                    <th className="py-3 px-4 text-center align-middle whitespace-nowrap">Issue Date</th>
                    <th className="py-3 px-4 text-left align-middle min-w-[200px]">Purpose / Reason</th>
                    <th className="py-3 px-4 text-center align-middle whitespace-nowrap">Status</th>
                    <th className="py-3 px-4 text-center align-middle whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-ink-secondary">
                        <FiAlertCircle size={28} className="mx-auto mb-2 text-ink-secondary/60" />
                        <p className="font-semibold text-ink m-0">No certificate records found</p>
                        <p className="text-caption text-ink-secondary m-0 mt-0.5">Try adjusting your search query or filter.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map(record => {
                      const badgeColors: Record<string, string> = {
                        tc: "bg-amber-50 text-amber-800 border-amber-200",
                        bonafide: "bg-blue-50 text-blue-800 border-blue-200",
                        character: "bg-emerald-50 text-emerald-800 border-emerald-200",
                        fee: "bg-purple-50 text-purple-800 border-purple-200",
                        dob: "bg-teal-50 text-teal-800 border-teal-200"
                      };

                      return (
                        <tr key={record.id} className="hover:bg-surface-subtle transition-colors">
                          <td className="py-3 px-4 font-mono font-semibold text-ink align-middle whitespace-nowrap">
                            {record.certNo}
                          </td>
                          <td className="py-3 px-4 align-middle whitespace-nowrap">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-caption font-semibold border ${badgeColors[record.type] || "bg-surface-subtle border-line text-ink"}`}>
                              {record.typeLabel}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-ink align-middle">
                            {record.studentName}
                          </td>
                          <td className="py-3 px-4 text-ink align-middle whitespace-nowrap">
                            Class {record.classGrade}
                          </td>
                          <td className="py-3 px-4 font-mono text-ink-secondary align-middle whitespace-nowrap">
                            {record.admNo}
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-ink-secondary align-middle whitespace-nowrap">
                            {record.issueDate}
                          </td>
                          <td className="py-3 px-4 text-ink-secondary text-caption align-middle">
                            {record.purpose}
                          </td>
                          <td className="py-3 px-4 text-center align-middle whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-caption font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                              <span>{record.status}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center align-middle whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => {
                                  setActiveTab(record.type);
                                  showToast(`Viewing template for ${record.studentName}`, "info");
                                }}
                                title="View & Print Certificate"
                                className="p-1.5 rounded text-ink-secondary hover:text-primary hover:bg-surface-subtle transition cursor-pointer"
                              >
                                <FiEye size={15} />
                              </button>
                              <button
                                onClick={handlePrint}
                                title="Direct Print"
                                className="p-1.5 rounded text-ink-secondary hover:text-emerald-700 hover:bg-surface-subtle transition cursor-pointer"
                              >
                                <FiPrinter size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
