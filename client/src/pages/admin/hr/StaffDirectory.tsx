import React, { useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiDownload,
  FiAlertTriangle,
  FiX,
  FiUserCheck,
  FiPhone,
  FiMail,
  FiFilter
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";
import TeacherProfileModal, {
  type TeacherProfileData
} from "../../../components/admin/staff/TeacherProfileModal";

export const INITIAL_STAFF: TeacherProfileData[] = [
  {
    id: "1",
    empId: "EMP-0142",
    name: "Sunita Rathore",
    hindiName: "सुनीता राठौड़",
    role: "TGT Science · Class teacher 8-B",
    department: "Science",
    joinedDate: "1 Jul 2019",
    status: "Permanent",
    todayStatus: "Present",
    classTeacher: "Class teacher 8-B",
    reportsTo: "Vice Principal",
    periodsPerWeek: 26,
    sections: "4 sections",
    attendanceRate: "98.6%",
    lateArrivals: 2,
    leaveLeft: { cl: 8, sl: 9, el: 22 },
    experience: "10 yrs",
    tenureHere: "7 years in this school",
    netPay: "₹48,300",
    paidDate: "1 Oct",
    phone: "98290 14210",
    email: "sunita.rathore@shiksha.edu",
    needsAttention:
      "Medical fitness certificate expires 15 Dec 2026 · Half-Yearly Science 8-B marks due 12 Oct · CPD hours 32 of 50 for this year"
  },
  {
    id: "2",
    empId: "EMP-0118",
    name: "Vikram Singh",
    hindiName: "विक्रम सिंह",
    role: "TGT Maths",
    department: "Maths",
    joinedDate: "15 Apr 2017",
    status: "Permanent",
    todayStatus: "Present",
    reportsTo: "Vice Principal",
    periodsPerWeek: 28,
    sections: "4 sections",
    attendanceRate: "96.4%",
    lateArrivals: 4,
    leaveLeft: { cl: 5, sl: 8, el: 18 },
    experience: "9 yrs",
    tenureHere: "9 years in this school",
    netPay: "₹43,280",
    paidDate: "1 Oct",
    phone: "98870 99120",
    email: "vikram.singh@shiksha.edu",
    needsAttention: "2 days leave without pay in Sept, 4 late arrivals (0.5 day deducted in payroll)"
  },
  {
    id: "3",
    empId: "EMP-0097",
    name: "Rachna Bose",
    hindiName: "रचना बोस",
    role: "PGT English · Dept Head",
    department: "Languages",
    joinedDate: "1 Jul 2015",
    status: "Permanent",
    todayStatus: "On leave",
    reportsTo: "Principal",
    periodsPerWeek: 24,
    sections: "3 sections",
    attendanceRate: "99.1%",
    lateArrivals: 0,
    leaveLeft: { cl: 7, sl: 10, el: 26 },
    experience: "14 yrs",
    tenureHere: "11 years in this school",
    netPay: "₹55,900",
    paidDate: "1 Oct",
    phone: "94140 33819",
    email: "rachna.bose@shiksha.edu",
    needsAttention: "On casual leave till 12 Oct · Syllabus coverage 78% on track"
  },
  {
    id: "4",
    empId: "EMP-0231",
    name: "Pooja Meena",
    hindiName: "पूजा मीणा",
    role: "PRT · Class teacher 2-B",
    department: "Primary wing",
    joinedDate: "16 Sep 2026",
    status: "Probation",
    todayStatus: "Present",
    classTeacher: "Class teacher 2-B",
    reportsTo: "Primary Coordinator",
    periodsPerWeek: 28,
    sections: "1 section (All subjects)",
    attendanceRate: "100%",
    lateArrivals: 0,
    leaveLeft: { cl: 2, sl: 2, el: 0 },
    experience: "2 yrs",
    tenureHere: "New joinee (1 month)",
    netPay: "₹12,433",
    paidDate: "1 Oct (15 days pro-rata)",
    phone: "97840 55190",
    email: "pooja.meena@shiksha.edu",
    needsAttention: "Probation review scheduled for March 2027 · Police verification clear"
  },
  {
    id: "5",
    empId: "EMP-0104",
    name: "Rakesh Jain",
    hindiName: "राकेश जैन",
    role: "PGT Accountancy",
    department: "Commerce",
    joinedDate: "1 Apr 2016",
    status: "Permanent",
    todayStatus: "Present",
    reportsTo: "Vice Principal",
    periodsPerWeek: 24,
    sections: "3 sections",
    attendanceRate: "97.5%",
    lateArrivals: 1,
    leaveLeft: { cl: 6, sl: 8, el: 20 },
    experience: "12 yrs",
    tenureHere: "10 years in this school",
    netPay: "₹52,100",
    paidDate: "1 Oct",
    phone: "98290 88204",
    email: "rakesh.jain@shiksha.edu",
    needsAttention: "Salary revision from 1 Sep · August arrears adjustment approved"
  },
  {
    id: "6",
    empId: "EMP-0076",
    name: "Kamla Devi",
    hindiName: "कमला देवी",
    role: "TGT Hindi",
    department: "Languages",
    joinedDate: "1 Jul 2012",
    status: "Permanent",
    todayStatus: "Present",
    reportsTo: "Vice Principal",
    periodsPerWeek: 26,
    sections: "4 sections",
    attendanceRate: "95.8%",
    lateArrivals: 3,
    leaveLeft: { cl: 7, sl: 7, el: 16 },
    experience: "15 yrs",
    tenureHere: "14 years in this school",
    netPay: "₹38,600",
    paidDate: "1 Oct",
    phone: "94140 11928",
    email: "kamla.devi@shiksha.edu",
    needsAttention: "Police verification renewal pending (due in 28 days) · Loan EMI ends this month"
  },
  {
    id: "7",
    empId: "EMP-0188",
    name: "Neha Saini",
    hindiName: "नेहा सैनी",
    role: "Admission counsellor",
    department: "Front office",
    joinedDate: "1 Jan 2022",
    status: "Permanent",
    todayStatus: "Present",
    reportsTo: "Administrative Officer",
    periodsPerWeek: 0,
    attendanceRate: "99.4%",
    lateArrivals: 1,
    leaveLeft: { cl: 9, sl: 10, el: 18 },
    experience: "5 yrs",
    tenureHere: "4 years in this school",
    netPay: "₹28,400",
    paidDate: "1 Oct",
    phone: "99280 66201",
    email: "neha.saini@shiksha.edu",
    needsAttention: "48 open parent enquiries in CRM · Nursery admission campaign lead"
  },
  {
    id: "8",
    empId: "EMP-0150",
    name: "Deepak Choudhary",
    hindiName: "दीपक चौधरी",
    role: "Physical Education Teacher (PET)",
    department: "Sports",
    joinedDate: "1 Jul 2020",
    status: "Permanent",
    todayStatus: "Present",
    reportsTo: "Vice Principal",
    periodsPerWeek: 30,
    sections: "All Senior sections",
    attendanceRate: "98.2%",
    lateArrivals: 2,
    leaveLeft: { cl: 8, sl: 9, el: 22 },
    experience: "8 yrs",
    tenureHere: "6 years in this school",
    netPay: "₹32,600",
    paidDate: "1 Oct",
    phone: "98870 77114",
    email: "deepak.c@shiksha.edu",
    needsAttention: "District basketball tournament preparation · First aid box replenishment due"
  },
  {
    id: "9",
    empId: "EMP-0164",
    name: "Mohan Lal",
    hindiName: "मोहन लाल",
    role: "Senior Driver · Bus 4",
    department: "Transport",
    joinedDate: "1 Apr 2021",
    status: "Permanent",
    todayStatus: "Present",
    reportsTo: "Transport Incharge",
    periodsPerWeek: 0,
    attendanceRate: "98.9%",
    lateArrivals: 1,
    leaveLeft: { cl: 9, sl: 10, el: 15 },
    experience: "14 yrs",
    tenureHere: "5 years in this school",
    netPay: "₹17,851",
    paidDate: "1 Oct",
    phone: "99280 44102",
    email: "mohan.lal@shiksha.edu",
    needsAttention: "Commercial heavy driving licence valid to Mar 2029 · Bus 4 GPS tracker active"
  },
  {
    id: "10",
    empId: "EMP-0177",
    name: "Devendra Sharma",
    hindiName: "देवेन्द्र शर्मा",
    role: "Sports Coach · Athletics",
    department: "Sports",
    joinedDate: "1 Aug 2021",
    status: "Permanent",
    todayStatus: "Present",
    reportsTo: "PET Deepak Choudhary",
    periodsPerWeek: 26,
    attendanceRate: "97.8%",
    lateArrivals: 2,
    leaveLeft: { cl: 6, sl: 9, el: 20 },
    experience: "6 yrs",
    tenureHere: "5 years in this school",
    netPay: "₹26,800",
    paidDate: "1 Oct",
    phone: "97840 22109",
    email: "devendra.s@shiksha.edu"
  },
  {
    id: "11",
    empId: "EMP-0168",
    name: "Rekha Jain",
    hindiName: "रेखा जैन",
    role: "Senior Accountant · Fees & Ledger",
    department: "Administration",
    joinedDate: "15 Aug 2018",
    status: "Permanent",
    todayStatus: "Present",
    reportsTo: "Accounts Officer",
    periodsPerWeek: 0,
    attendanceRate: "99.5%",
    lateArrivals: 0,
    leaveLeft: { cl: 10, sl: 10, el: 24 },
    experience: "11 yrs",
    tenureHere: "8 years in this school",
    netPay: "₹35,600",
    paidDate: "1 Oct",
    phone: "96490 22104",
    email: "rekha.jain@shiksha.edu"
  },
  {
    id: "12",
    empId: "EMP-0185",
    name: "Farah Ali",
    hindiName: "फराह अली",
    role: "Art & Craft Instructor",
    department: "Arts",
    joinedDate: "1 Nov 2021",
    status: "Permanent",
    todayStatus: "Present",
    reportsTo: "Vice Principal",
    periodsPerWeek: 22,
    attendanceRate: "98.0%",
    lateArrivals: 1,
    leaveLeft: { cl: 13, sl: 10, el: 15 },
    experience: "7 yrs",
    tenureHere: "5 years in this school",
    netPay: "₹30,500",
    paidDate: "1 Oct",
    phone: "97720 18821",
    email: "farah.ali@shiksha.edu"
  }
];

export default function StaffDirectory() {
  const { showToast } = useToast();
  const [staffList, setStaffList] = useState<TeacherProfileData[]>(INITIAL_STAFF);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<"All" | "Present" | "On leave" | "Probation">("All");

  const [selectedStaff, setSelectedStaff] = useState<TeacherProfileData | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);

  // Form state for onboarding new staff
  const [newStaffForm, setNewStaffForm] = useState({
    name: "",
    hindiName: "",
    role: "",
    department: "Science",
    empId: `EMP-0${INITIAL_STAFF.length + 150}`,
    phone: "",
    email: "",
    periodsPerWeek: 24,
    classTeacher: "",
    status: "Probation" as "Permanent" | "Probation" | "Contract"
  });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffForm.name.trim() || !newStaffForm.phone.trim()) return;

    const created: TeacherProfileData = {
      id: String(Date.now()),
      empId: newStaffForm.empId,
      name: newStaffForm.name,
      hindiName: newStaffForm.hindiName,
      role: newStaffForm.role || "Teacher",
      department: newStaffForm.department,
      joinedDate: "Today",
      status: newStaffForm.status,
      todayStatus: "Present",
      classTeacher: newStaffForm.classTeacher || undefined,
      reportsTo: "Vice Principal",
      periodsPerWeek: Number(newStaffForm.periodsPerWeek) || 0,
      attendanceRate: "100%",
      lateArrivals: 0,
      leaveLeft: { cl: 12, sl: 10, el: 0 },
      experience: "1 yr",
      tenureHere: "New joinee",
      netPay: "₹32,000",
      phone: newStaffForm.phone,
      email: newStaffForm.email || `${newStaffForm.name.toLowerCase().replace(/\s+/g, ".")}@shiksha.edu`
    };

    setStaffList(prev => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewStaffForm({
      name: "",
      hindiName: "",
      role: "",
      department: "Science",
      empId: `EMP-0${staffList.length + 152}`,
      phone: "",
      email: "",
      periodsPerWeek: 24,
      classTeacher: "",
      status: "Probation"
    });
    showToast(`Staff member ${created.name} onboarded with ID ${created.empId}!`, "success");
  };

  const handleUpdateStaff = (updated: TeacherProfileData) => {
    setStaffList(prev => prev.map(s => (s.id === updated.id ? updated : s)));
    setSelectedStaff(updated);
  };

  const handleExportCSV = () => {
    const headers = "EMP ID,Name,Role,Department,Status,Phone,Email,Periods/Wk\n";
    const rows = filteredStaff
      .map(s => `"${s.empId}","${s.name}","${s.role}","${s.department}","${s.todayStatus}","${s.phone}","${s.email}",${s.periodsPerWeek}`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Staff_Directory_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    showToast("Staff directory exported to CSV!", "success");
  };

  const filteredStaff = staffList.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.empId.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search);

    const matchesDept = selectedDept === "All" || s.department === selectedDept;

    const matchesStatus =
      selectedStatus === "All"
        ? true
        : selectedStatus === "Probation"
        ? s.status === "Probation"
        : s.todayStatus === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-5 animate-fadeIn max-w-content mx-auto pb-12 font-sans">
      {/* Header Row (Matching 26-Staff.html) */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[13px] text-ink-secondary">
            Staff › Directory
          </div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight flex items-baseline gap-2">
            Staff{" "}
            <span className="font-normal text-ink-secondary text-lg">
              · 96 active
            </span>
          </h1>
          <div className="text-[13px] text-ink-secondary">
            58 teaching · 23 admin and support · 15 transport
          </div>
        </div>

        <div className="flex gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleExportCSV}
            className="min-h-[42px] px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-[13px] font-semibold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <FiDownload size={14} className="text-ink-secondary" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="min-h-[42px] px-4 rounded-control bg-primary hover:bg-primary-dark text-white text-[13px] font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 active:scale-[0.98]"
          >
            <FiPlus size={15} />
            <span>Add employee</span>
          </button>
        </div>
      </div>

      {/* Compliance Expiry Warning Banner (Screen 26) */}
      <div className="bg-warning-bg border border-warning-border rounded-control px-4 py-3 text-[13.5px] text-warning-strong flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <FiAlertTriangle className="text-warning-inline shrink-0" size={16} />
          <span>
            <b>3 documents expire within 30 days:</b> police verification (2), medical fitness (1).
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsComplianceModalOpen(true)}
          className="text-warning-text font-semibold hover:underline text-[13px] cursor-pointer"
        >
          Review renewals →
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white border border-line rounded-card p-3 flex flex-wrap items-center gap-3 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" size={15} />
          <input
            type="search"
            placeholder="Search by staff name, EMP code, department, or mobile..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-page border border-line rounded-control text-xs text-ink focus:outline-none focus:border-primary placeholder:text-ink-secondary/70"
          />
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-ink-secondary font-medium">Department:</span>
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink font-medium focus:outline-none focus:border-primary"
          >
            <option value="All">All departments</option>
            <option value="Science">Science (12)</option>
            <option value="Maths">Maths (8)</option>
            <option value="Languages">Languages (14)</option>
            <option value="Primary wing">Primary wing (16)</option>
            <option value="Commerce">Commerce (4)</option>
            <option value="Front office">Front office (6)</option>
            <option value="Sports">Sports (6)</option>
            <option value="Transport">Transport (15)</option>
            <option value="Administration">Administration (15)</option>
          </select>
        </div>

        {/* Status Pill Filters */}
        <div className="flex items-center gap-1.5 text-xs">
          {(["All", "Present", "On leave", "Probation"] as const).map(st => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded-control text-[12px] font-medium transition-colors cursor-pointer ${
                selectedStatus === st
                  ? "bg-primary text-white"
                  : "bg-page text-ink-secondary hover:text-ink border border-line"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Grid Cards (Matching 26-Staff.html) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {filteredStaff.map(emp => {
          const initials = emp.name
            .split(" ")
            .map(n => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <article
              key={emp.id}
              onClick={() => setSelectedStaff(emp)}
              className="bg-white border border-line rounded-card p-4 flex flex-col gap-3 shadow-xs hover:shadow-sm hover:border-primary/50 transition-all cursor-pointer group"
            >
              <div className="flex gap-3 items-center">
                <div className="w-11 h-11 flex-none rounded-full bg-primary-tint text-primary flex items-center justify-center font-semibold text-sm border border-primary/15 group-hover:scale-105 transition-transform">
                  {initials}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <div className="font-semibold text-[14.5px] text-ink group-hover:text-primary transition-colors truncate">
                    {emp.name}
                  </div>
                  <span className="text-[12.5px] text-ink-secondary truncate">
                    {emp.role}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1 text-[12.5px] text-ink-secondary">
                <span className="text-ink font-medium">{emp.department} department</span>
                <span className="font-mono text-[12px] text-ink-secondary">
                  {emp.empId} · joined {emp.joinedDate}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2.5 border-t border-line/60 text-xs mt-auto">
                <span
                  className={`text-[11.5px] font-semibold px-2 py-0.5 rounded-full ${
                    emp.status === "Probation"
                      ? "bg-primary-tint text-primary"
                      : emp.todayStatus === "Present"
                      ? "bg-success-bg text-success-text"
                      : "bg-warning-bg text-warning-text"
                  }`}
                >
                  {emp.status === "Probation"
                    ? "Probation"
                    : emp.todayStatus === "Present"
                    ? "Present"
                    : "On leave"}
                </span>

                <span className="text-[12px] text-ink-secondary truncate">
                  {emp.status === "Probation"
                    ? "Confirms Mar 2027"
                    : emp.todayStatus === "On leave"
                    ? "Back 12 Oct"
                    : emp.periodsPerWeek
                    ? `${emp.periodsPerWeek} periods/wk`
                    : emp.department === "Transport"
                    ? "Licence valid"
                    : "Active shift"}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {filteredStaff.length === 0 && (
        <div className="bg-white border border-line rounded-card p-12 text-center text-ink-secondary">
          No staff members match the selected criteria.
        </div>
      )}

      {/* Screen 27: Teacher Profile Modal */}
      <TeacherProfileModal
        isOpen={Boolean(selectedStaff)}
        onClose={() => setSelectedStaff(null)}
        staff={selectedStaff}
        onUpdate={handleUpdateStaff}
      />

      {/* Add Employee Onboarding Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-line rounded-card w-full max-w-lg shadow-xl p-6 space-y-4 font-sans animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2.5 border-b border-line">
              <h3 className="font-semibold text-lg text-ink">Onboard New Employee</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-ink-secondary hover:text-ink text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink-secondary font-medium mb-1">
                    Full Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anjali Sharma"
                    value={newStaffForm.name}
                    onChange={e => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                    className="w-full p-2 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-ink-secondary font-medium mb-1">
                    Full Name (Hindi)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. अंजलि शर्मा"
                    value={newStaffForm.hindiName}
                    onChange={e => setNewStaffForm({ ...newStaffForm, hindiName: e.target.value })}
                    className="w-full p-2 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none font-hindi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink-secondary font-medium mb-1">
                    Designation / Role *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TGT Social Science"
                    value={newStaffForm.role}
                    onChange={e => setNewStaffForm({ ...newStaffForm, role: e.target.value })}
                    className="w-full p-2 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-ink-secondary font-medium mb-1">
                    Department *
                  </label>
                  <select
                    value={newStaffForm.department}
                    onChange={e => setNewStaffForm({ ...newStaffForm, department: e.target.value })}
                    className="w-full p-2 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  >
                    <option value="Science">Science</option>
                    <option value="Maths">Maths</option>
                    <option value="Languages">Languages</option>
                    <option value="Primary wing">Primary wing</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Front office">Front office</option>
                    <option value="Sports">Sports</option>
                    <option value="Transport">Transport</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink-secondary font-medium mb-1">
                    Employee Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStaffForm.empId}
                    onChange={e => setNewStaffForm({ ...newStaffForm, empId: e.target.value })}
                    className="w-full p-2 bg-white border border-line rounded-control text-ink font-mono text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-ink-secondary font-medium mb-1">
                    Employment Status
                  </label>
                  <select
                    value={newStaffForm.status}
                    onChange={e => setNewStaffForm({ ...newStaffForm, status: e.target.value as any })}
                    className="w-full p-2 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  >
                    <option value="Probation">Probation (New)</option>
                    <option value="Permanent">Permanent</option>
                    <option value="Contract">Contractual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink-secondary font-medium mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="98XXXXXXXX"
                    value={newStaffForm.phone}
                    onChange={e => setNewStaffForm({ ...newStaffForm, phone: e.target.value })}
                    className="w-full p-2 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-ink-secondary font-medium mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    placeholder="name@shiksha.edu"
                    value={newStaffForm.email}
                    onChange={e => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
                    className="w-full p-2 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink-secondary font-medium mb-1">
                    Periods / Week
                  </label>
                  <input
                    type="number"
                    value={newStaffForm.periodsPerWeek}
                    onChange={e => setNewStaffForm({ ...newStaffForm, periodsPerWeek: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-ink-secondary font-medium mb-1">
                    Class Teacher Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Class teacher 7-A (Optional)"
                    value={newStaffForm.classTeacher}
                    onChange={e => setNewStaffForm({ ...newStaffForm, classTeacher: e.target.value })}
                    className="w-full p-2 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-line-input rounded-control text-ink hover:bg-slate-50 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-control font-semibold cursor-pointer shadow-xs"
                >
                  Onboard Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Compliance Review Modal */}
      {isComplianceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-line rounded-card w-full max-w-lg shadow-xl p-6 space-y-4 font-sans animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-2.5 border-b border-line">
              <h3 className="font-semibold text-base text-ink">
                Expiring Compliance Documents (3 Documents)
              </h3>
              <button
                type="button"
                onClick={() => setIsComplianceModalOpen(false)}
                className="text-ink-secondary hover:text-ink text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 border border-line rounded-control bg-page space-y-1">
                <div className="flex justify-between font-semibold text-ink">
                  <span>Kamla Devi (EMP-0076) · TGT Hindi</span>
                  <span className="text-amber-800">Expires in 28 days</span>
                </div>
                <div className="text-ink-secondary">
                  Document: <b>Police Verification Certificate</b> (Mandatory under CBSE Safety Norms).
                </div>
              </div>

              <div className="p-3 border border-line rounded-control bg-page space-y-1">
                <div className="flex justify-between font-semibold text-ink">
                  <span>Sunita Rathore (EMP-0142) · TGT Science</span>
                  <span className="text-amber-800">Expires in 20 days</span>
                </div>
                <div className="text-ink-secondary">
                  Document: <b>Annual Medical Fitness Certificate</b> (Civil Surgeon / MBBS).
                </div>
              </div>

              <div className="p-3 border border-line rounded-control bg-page space-y-1">
                <div className="flex justify-between font-semibold text-ink">
                  <span>Mohan Lal (EMP-0164) · Driver Bus 4</span>
                  <span className="text-amber-800">Expires in 14 days</span>
                </div>
                <div className="text-ink-secondary">
                  Document: <b>Heavy Vehicle Commercial Driver Background Verification</b>.
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-line">
              <button
                type="button"
                onClick={() => {
                  setIsComplianceModalOpen(false);
                  showToast("Bulk SMS reminders sent to 3 staff members for document renewal!", "success");
                }}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-control text-xs font-semibold shadow-xs"
              >
                Send Renewal Reminders
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
