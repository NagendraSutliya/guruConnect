import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiAlertCircle,
  FiSend,
  FiPhoneCall,
  FiDownload,
  FiFilter,
  FiSearch,
  FiDollarSign,
  FiCheckSquare
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface Defaulter {
  id: string;
  name: string;
  admNo: string;
  classGrade: string;
  guardian: string;
  phone: string;
  oldestInstallment: string;
  totalDue: number;
  daysOverdue: number;
  lastReminder: string;
}

const DEFAULTERS_DATA: Defaulter[] = [
  {
    id: "1",
    name: "Aarav Gupta",
    admNo: "2016/0112",
    classGrade: "8-A",
    guardian: "Sunil Gupta",
    phone: "98290 12345",
    oldestInstallment: "Installment 1 (Apr–Jun)",
    totalDue: 34800,
    daysOverdue: 104,
    lastReminder: "Called 3 days ago"
  },
  {
    id: "2",
    name: "Ishita Rao",
    admNo: "2019/0241",
    classGrade: "5-B",
    guardian: "Vikram Rao",
    phone: "98281 99124",
    oldestInstallment: "Installment 2 (Jul–Sep)",
    totalDue: 17900,
    daysOverdue: 86,
    lastReminder: "WhatsApp sent yesterday"
  },
  {
    id: "3",
    name: "Kunal Rathore",
    admNo: "2018/0088",
    classGrade: "10-A",
    guardian: "Govind Rathore",
    phone: "94140 33412",
    oldestInstallment: "Installment 2 (Jul–Sep)",
    totalDue: 21500,
    daysOverdue: 72,
    lastReminder: "No response"
  },
  {
    id: "4",
    name: "Meera Vyas",
    admNo: "2021/0145",
    classGrade: "3-A",
    guardian: "Gaurav Vyas",
    phone: "96490 88712",
    oldestInstallment: "Installment 3 (Oct–Dec)",
    totalDue: 14200,
    daysOverdue: 28,
    lastReminder: "SMS sent 5 Oct"
  },
  {
    id: "5",
    name: "Rohan Saini",
    admNo: "2017/0199",
    classGrade: "7-C",
    guardian: "Mahesh Saini",
    phone: "99830 55198",
    oldestInstallment: "Installment 3 (Oct–Dec)",
    totalDue: 16900,
    daysOverdue: 14,
    lastReminder: "First reminder pending"
  }
];

export default function DefaultersPage() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOverdue, setFilterOverdue] = useState<"all" | "60" | "30">("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === DEFAULTERS_DATA.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(DEFAULTERS_DATA.map(d => d.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkWhatsApp = () => {
    showToast(
      `Dispatched automated WhatsApp fee payment links to ${selectedIds.length || DEFAULTERS_DATA.length} parents.`,
      "success"
    );
  };

  const filtered = DEFAULTERS_DATA.filter(d => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.admNo.includes(searchTerm) ||
      d.phone.includes(searchTerm);
    if (filterOverdue === "60") return matchesSearch && d.daysOverdue >= 60;
    if (filterOverdue === "30") return matchesSearch && d.daysOverdue >= 30;
    return matchesSearch;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-navy">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-navy-muted tracking-wide uppercase">
            Fees & Accounts › Recovery Register
          </div>
          <h1 className="text-2xl font-bold text-navy mt-1">Fee Defaulters & Dues Register</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => showToast("Exporting defaulters roster to Excel...", "info")}
            className="flex items-center gap-2 px-3.5 py-2 border border-line rounded-control bg-surface hover:bg-page text-xs font-medium text-navy transition"
          >
            <FiDownload size={14} /> Export (Excel)
          </button>
          <button
            onClick={handleBulkWhatsApp}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-control text-xs font-bold shadow-xs transition"
          >
            <FiSend size={14} /> Send WhatsApp Reminders ({selectedIds.length || "All"})
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-line rounded-panel p-4 shadow-sm space-y-1">
          <div className="text-xs text-navy-muted font-medium">Total Outstanding Dues</div>
          <div className="font-mono text-2xl font-bold text-amber-800">₹14,82,400</div>
          <div className="text-[11px] text-navy-muted">98 students with unpaid installments</div>
        </div>

        <div className="bg-surface border border-line rounded-panel p-4 shadow-sm space-y-1">
          <div className="text-xs text-red-700 font-medium">Overdue &gt; 60 Days</div>
          <div className="font-mono text-2xl font-bold text-red-700">₹4,12,000</div>
          <div className="text-[11px] text-navy-muted">21 high-risk student accounts</div>
        </div>

        <div className="bg-surface border border-line rounded-panel p-4 shadow-sm space-y-1">
          <div className="text-xs text-emerald-700 font-medium">Recovered This Month</div>
          <div className="font-mono text-2xl font-bold text-emerald-700">₹6,48,200</div>
          <div className="text-[11px] text-navy-muted">43 reminders successfully settled</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-surface border border-line rounded-panel p-3.5 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-muted" size={15} />
          <input
            type="text"
            placeholder="Search student, adm no. or guardian mobile..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-page border border-line rounded-control text-xs text-navy focus:outline-none focus:border-teal"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilterOverdue("all")}
            className={`px-3 py-1.5 rounded-control font-semibold transition ${
              filterOverdue === "all"
                ? "bg-nav-bg text-gold shadow-xs"
                : "border border-line bg-page text-navy-muted hover:text-navy"
            }`}
          >
            All Defaulters
          </button>
          <button
            onClick={() => setFilterOverdue("30")}
            className={`px-3 py-1.5 rounded-control font-semibold transition ${
              filterOverdue === "30"
                ? "bg-nav-bg text-gold shadow-xs"
                : "border border-line bg-page text-navy-muted hover:text-navy"
            }`}
          >
            &gt; 30 Days Overdue
          </button>
          <button
            onClick={() => setFilterOverdue("60")}
            className={`px-3 py-1.5 rounded-control font-semibold transition ${
              filterOverdue === "60"
                ? "bg-nav-bg text-gold shadow-xs"
                : "border border-line bg-page text-navy-muted hover:text-navy"
            }`}
          >
            &gt; 60 Days Critical
          </button>
        </div>
      </div>

      {/* Defaulters Table */}
      <div className="bg-surface border border-line rounded-panel shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-page/70 border-b border-line text-navy-muted font-semibold">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === DEFAULTERS_DATA.length}
                    onChange={toggleSelectAll}
                    className="rounded text-teal focus:ring-teal"
                  />
                </th>
                <th className="py-3 px-4">Student & Class</th>
                <th className="py-3 px-4">Adm No.</th>
                <th className="py-3 px-4">Guardian Contact</th>
                <th className="py-3 px-4">Oldest Due Installment</th>
                <th className="py-3 px-4 text-right">Total Due</th>
                <th className="py-3 px-4 text-center">Days Overdue</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-page/40 transition">
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelectOne(item.id)}
                      className="rounded text-teal focus:ring-teal"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-navy">{item.name}</div>
                    <div className="text-navy-muted text-[11px]">{item.classGrade}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-navy-muted">{item.admNo}</td>
                  <td className="py-3 px-4">
                    <div className="text-navy font-medium">{item.guardian}</div>
                    <div className="font-mono text-navy-muted text-[11px]">{item.phone}</div>
                  </td>
                  <td className="py-3 px-4 text-navy-muted">{item.oldestInstallment}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-navy">
                    ₹{item.totalDue.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        item.daysOverdue >= 60
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {item.daysOverdue} days
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to="/admin/collect-fees"
                      className="px-3 py-1 bg-teal hover:bg-teal-hover text-white rounded-control font-semibold text-[11px] inline-flex items-center gap-1 transition"
                    >
                      Collect ₹
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
