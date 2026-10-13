import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiMail,
  FiPhone,
  FiAlertTriangle,
  FiCheckCircle,
  FiFilter,
  FiClock,
  FiUser
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface Employee {
  id: string;
  empId: string;
  name: string;
  role: string;
  department: string;
  joinedDate: string;
  status: "Present" | "On leave" | "Late";
  periodsPerWeek?: number;
  phone: string;
  email: string;
  docWarning?: string;
}

const EMPLOYEES: Employee[] = [
  {
    id: "1",
    empId: "EMP-0142",
    name: "Sunita Rathore",
    role: "TGT Science · Class Teacher 8-B",
    department: "Science",
    joinedDate: "Jul 2019",
    status: "Present",
    periodsPerWeek: 26,
    phone: "98290 14210",
    email: "sunita.r@shiksha.edu"
  },
  {
    id: "2",
    empId: "EMP-0118",
    name: "Vikram Singh",
    role: "TGT Maths",
    department: "Maths",
    joinedDate: "Apr 2017",
    status: "Present",
    periodsPerWeek: 28,
    phone: "98870 99120",
    email: "vikram.s@shiksha.edu"
  },
  {
    id: "3",
    empId: "EMP-0097",
    name: "Rachna Bose",
    role: "PGT English · Dept Head",
    department: "Languages",
    joinedDate: "Jul 2015",
    status: "On leave",
    periodsPerWeek: 24,
    phone: "94140 33819",
    email: "rachna.b@shiksha.edu"
  },
  {
    id: "4",
    empId: "EMP-0210",
    name: "Mohan Lal",
    role: "Senior Driver · Bus 4 Route",
    department: "Transport",
    joinedDate: "Oct 2020",
    status: "Present",
    phone: "99280 44102",
    email: "mohan.lal@shiksha.edu",
    docWarning: "Police verification expires in 14 days"
  },
  {
    id: "5",
    empId: "EMP-0185",
    name: "Farah Ali",
    role: "Art & Craft Instructor",
    department: "Arts",
    joinedDate: "Nov 2021",
    status: "Present",
    periodsPerWeek: 22,
    phone: "97720 18821",
    email: "farah.a@shiksha.edu"
  },
  {
    id: "6",
    empId: "EMP-0164",
    name: "Rekha Jain",
    role: "Senior Accountant · Fees & Billing",
    department: "Administration",
    joinedDate: "Aug 2018",
    status: "Present",
    phone: "96490 22104",
    email: "rekha.j@shiksha.edu"
  }
];

export default function StaffDirectory() {
  const { showToast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>(EMPLOYEES);
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newEmp, setNewEmp] = useState({
    name: "",
    role: "",
    department: "Teaching",
    phone: "",
    email: "",
    periodsPerWeek: "24"
  });

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.phone) {
      showToast("Please provide employee name and contact details.", "error");
      return;
    }
    const created: Employee = {
      id: String(Date.now()),
      empId: `EMP-0${Math.floor(220 + Math.random() * 80)}`,
      name: newEmp.name,
      role: newEmp.role || "Staff Member",
      department: newEmp.department,
      joinedDate: "Today",
      status: "Present",
      periodsPerWeek: parseInt(newEmp.periodsPerWeek) || undefined,
      phone: newEmp.phone,
      email: newEmp.email || `${newEmp.name.toLowerCase().replace(/\s+/g, ".")}@shiksha.edu`
    };
    setEmployees([created, ...employees]);
    setIsAddModalOpen(false);
    setNewEmp({ name: "", role: "", department: "Teaching", phone: "", email: "", periodsPerWeek: "24" });
    showToast(`Employee ${created.name} onboarded with ID ${created.empId}!`, "success");
  };

  const filtered = employees.filter(e => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.empId.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase());
    const matchesDept = departmentFilter === "All" || e.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-navy">
      {/* Sub Navigation */}
      <div className="flex items-center gap-2 border-b border-line pb-2 text-xs font-semibold overflow-x-auto">
        <span className="text-teal border-b-2 border-teal pb-2 px-1">Directory</span>
        <Link to="/admin/staff/leave" className="text-navy-muted hover:text-navy px-2 pb-2">
          Leave Management
        </Link>
        <Link to="/admin/staff/attendance" className="text-navy-muted hover:text-navy px-2 pb-2">
          Staff Attendance
        </Link>
        <Link to="/admin/payroll" className="text-navy-muted hover:text-navy px-2 pb-2">
          Payroll Runs
        </Link>
      </div>

      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">
            Staff Directory <span className="text-base font-normal text-navy-muted">· 96 active employees</span>
          </h1>
          <p className="text-xs text-navy-muted mt-0.5">
            58 teaching faculty · 23 administration and support · 15 transport & ground crew
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal hover:bg-teal-hover text-white rounded-control text-xs font-bold shadow-xs transition"
        >
          <FiPlus size={15} /> Add Employee
        </button>
      </div>

      {/* Document Expiry Alert Banner from Screen 26 */}
      <div className="bg-amber-50 border border-amber-200 rounded-control p-3.5 flex items-center justify-between gap-3 text-xs text-amber-900">
        <div className="flex items-center gap-2.5">
          <FiAlertTriangle className="text-amber-700 shrink-0" size={16} />
          <span>
            <b>3 mandatory staff compliance documents</b> expire within 30 days: police verification (2), medical fitness certificate (1).
          </span>
        </div>
        <button
          onClick={() => showToast("Opening compliance renewal queue...", "info")}
          className="text-amber-800 font-bold hover:underline shrink-0"
        >
          Review Renewals →
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-surface border border-line rounded-panel p-3.5 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-muted" size={15} />
          <input
            type="text"
            placeholder="Search by employee name, ID, subject, or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-page border border-line rounded-control text-xs text-navy focus:outline-none focus:border-teal"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-navy-muted font-medium">Department:</span>
          <select
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}
            className="bg-page border border-line rounded-control px-2.5 py-1.5 text-xs text-navy font-medium focus:outline-none"
          >
            <option value="All">All departments</option>
            <option value="Science">Science</option>
            <option value="Maths">Maths</option>
            <option value="Languages">Languages</option>
            <option value="Transport">Transport</option>
            <option value="Arts">Arts</option>
            <option value="Administration">Administration</option>
          </select>
        </div>
      </div>

      {/* Staff Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(emp => (
          <div
            key={emp.id}
            className="bg-surface border border-line rounded-panel p-4 shadow-sm hover:shadow-md transition space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-full bg-teal/15 text-teal font-bold flex items-center justify-center text-sm shrink-0">
                {emp.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-sm text-navy truncate">{emp.name}</div>
                <div className="text-xs text-navy-muted truncate">{emp.role}</div>
                <div className="text-[11px] font-mono text-navy-muted mt-0.5">
                  {emp.empId} · Joined {emp.joinedDate}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-line/60 flex items-center justify-between text-xs">
              <span
                className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                  emp.status === "Present"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-amber-50 text-amber-800 border border-amber-200"
                }`}
              >
                {emp.status}
              </span>
              <span className="text-navy-muted text-[11px]">
                {emp.periodsPerWeek ? `${emp.periodsPerWeek} periods/week` : emp.department}
              </span>
            </div>

            {emp.docWarning && (
              <div className="p-2 rounded bg-amber-50/70 border border-amber-200 text-[10px] text-amber-800 flex items-center gap-1.5">
                <FiAlertTriangle size={12} className="shrink-0" />
                <span className="truncate">{emp.docWarning}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-line rounded-panel w-full max-w-md shadow-xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h3 className="font-bold text-base text-navy">Onboard New Employee</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-navy-muted hover:text-navy text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-navy mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={newEmp.name}
                  onChange={e => setNewEmp({ ...newEmp, name: e.target.value })}
                  className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none focus:border-teal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-navy mb-1">Department</label>
                  <select
                    value={newEmp.department}
                    onChange={e => setNewEmp({ ...newEmp, department: e.target.value })}
                    className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none"
                  >
                    <option value="Science">Science</option>
                    <option value="Maths">Maths</option>
                    <option value="Languages">Languages</option>
                    <option value="Transport">Transport</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-navy mb-1">Designation / Role</label>
                  <input
                    type="text"
                    placeholder="e.g. TGT Social Science"
                    value={newEmp.role}
                    onChange={e => setNewEmp({ ...newEmp, role: e.target.value })}
                    className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none focus:border-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-navy mb-1">Mobile Contact *</label>
                  <input
                    type="tel"
                    required
                    placeholder="98290 xxxxx"
                    value={newEmp.phone}
                    onChange={e => setNewEmp({ ...newEmp, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none focus:border-teal"
                  />
                </div>
                <div>
                  <label className="block font-medium text-navy mb-1">Weekly Period Load</label>
                  <input
                    type="number"
                    value={newEmp.periodsPerWeek}
                    onChange={e => setNewEmp({ ...newEmp, periodsPerWeek: e.target.value })}
                    className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none focus:border-teal font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-line rounded-control text-navy hover:bg-page font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal hover:bg-teal-hover text-white rounded-control font-semibold shadow-xs transition"
                >
                  Save & Onboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
