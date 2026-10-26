import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FiDownload,
  FiSend,
  FiMessageSquare,
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiAlertTriangle,
  FiX
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface DefaulterRow {
  id: string;
  name: string;
  classGrade: string;
  guardian: string;
  phone: string;
  overdueAmount: number;
  daysLate: number;
  lastReminder: string;
  note: string;
}

const DEFAULTERS_DATA: DefaulterRow[] = [
  {
    id: "d1",
    name: "Kunal Mehra",
    classGrade: "7-C",
    guardian: "Ajay Mehra",
    phone: "98290 2xxxx",
    overdueAmount: 33800,
    daysLate: 86,
    lastReminder: "WhatsApp · 1 Oct",
    note: "Promised by 15 Oct"
  },
  {
    id: "d2",
    name: "Harsh Vardhan",
    classGrade: "8-A",
    guardian: "Anita Vardhan",
    phone: "98870 5xxxx",
    overdueAmount: 21800,
    daysLate: 86,
    lastReminder: "WhatsApp · 1 Oct",
    note: "—"
  },
  {
    id: "d3",
    name: "Tanya Saini",
    classGrade: "6-C",
    guardian: "Mukesh Saini",
    phone: "94140 7xxxx",
    overdueAmount: 16900,
    daysLate: 86,
    lastReminder: "SMS · 20 Sep",
    note: "Asked for a payment plan"
  },
  {
    id: "d4",
    name: "Aarav Gupta",
    classGrade: "8-A",
    guardian: "Sunil Gupta",
    phone: "98290 12345",
    overdueAmount: 34800,
    daysLate: 104,
    lastReminder: "Called 3 days ago",
    note: "Pending parent visit"
  },
  {
    id: "d5",
    name: "Ishita Rao",
    classGrade: "5-B",
    guardian: "Vikram Rao",
    phone: "98281 99124",
    overdueAmount: 17900,
    daysLate: 54,
    lastReminder: "WhatsApp · 5 Oct",
    note: "Fee concession appeal"
  },
  {
    id: "d6",
    name: "Meera Vyas",
    classGrade: "3-A",
    guardian: "Gaurav Vyas",
    phone: "96490 88712",
    overdueAmount: 14200,
    daysLate: 28,
    lastReminder: "SMS · 5 Oct",
    note: "Will pay via UPI"
  }
];

export default function DefaultersPage() {
  const { showToast } = useToast();
  const [selectedIds, setSelectedIds] = useState<string[]>(["d1", "d2"]);
  const [ageingFilter, setAgeingFilter] = useState<"ALL" | "15-30" | "31-60" | "OVER-60">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderType, setReminderType] = useState<"WhatsApp" | "SMS">("WhatsApp");

  // Filtering
  const filteredData = useMemo(() => {
    return DEFAULTERS_DATA.filter((row) => {
      const matchesSearch =
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.classGrade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.guardian.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.phone.includes(searchTerm);

      if (!matchesSearch) return false;

      if (ageingFilter === "15-30") return row.daysLate >= 15 && row.daysLate <= 30;
      if (ageingFilter === "31-60") return row.daysLate > 30 && row.daysLate <= 60;
      if (ageingFilter === "OVER-60") return row.daysLate > 60;
      return true;
    });
  }, [searchTerm, ageingFilter]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map(r => r.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectedTotalAmount = useMemo(() => {
    return DEFAULTERS_DATA.filter(r => selectedIds.includes(r.id)).reduce(
      (sum, r) => sum + r.overdueAmount,
      0
    );
  }, [selectedIds]);

  const handleExportCSV = () => {
    const headers = "Student Name,Class,Guardian,Phone,Overdue (INR),Days Late,Last Reminder,Note\n";
    const rows = DEFAULTERS_DATA.map(
      r => `"${r.name}","${r.classGrade}","${r.guardian}","${r.phone}",${r.overdueAmount},${r.daysLate},"${r.lastReminder}","${r.note}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `defaulters_with_contacts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Defaulters register with contacts exported to CSV!", "success");
  };

  const handleSendReminder = (type: "WhatsApp" | "SMS") => {
    setReminderType(type);
    setIsReminderModalOpen(true);
  };

  const confirmSendReminder = () => {
    setIsReminderModalOpen(false);
    showToast(`${reminderType} reminders with dynamic payment links dispatched to ${selectedIds.length} parents!`, "success");
  };

  return (
    <div className="space-y-5 animate-fadeIn max-w-content mx-auto pb-12">
      {/* Header Row (Matching 22-Defaulters.html) */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[13px] text-ink-secondary">
            Fees › Defaulters
          </div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
            Defaulters · 184 students · ₹7,67,500
          </h1>
          <div className="text-[13px] text-ink-secondary">
            Installments unpaid more than 15 days after the due date
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="min-h-[42px] px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-[13px] font-semibold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
        >
          <FiDownload size={14} className="text-ink-secondary" />
          <span>Export with contacts</span>
        </button>
      </div>

      {/* Top 3 Summary Ageing Cards (Matching 22-Defaulters.html) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Card 1: 15-30 days */}
        <button
          type="button"
          onClick={() => setAgeingFilter(ageingFilter === "15-30" ? "ALL" : "15-30")}
          className={`text-left bg-white border rounded-card p-4 flex flex-col gap-1 shadow-xs transition-all cursor-pointer ${
            ageingFilter === "15-30" ? "border-primary ring-2 ring-primary/20" : "border-line hover:border-slate-300"
          }`}
        >
          <span className="text-[12.5px] text-ink-secondary font-medium">15–30 days late</span>
          <span className="font-mono text-xl sm:text-[22px] font-semibold text-ink">₹3,12,400</span>
          <span className="text-[12.5px] text-ink-secondary">96 students</span>
        </button>

        {/* Card 2: 31-60 days */}
        <button
          type="button"
          onClick={() => setAgeingFilter(ageingFilter === "31-60" ? "ALL" : "31-60")}
          className={`text-left bg-white border rounded-card p-4 flex flex-col gap-1 shadow-xs transition-all cursor-pointer ${
            ageingFilter === "31-60" ? "border-[#8F4A09] ring-2 ring-[#8F4A09]/20" : "border-line hover:border-slate-300"
          }`}
        >
          <span className="text-[12.5px] text-ink-secondary font-medium">31–60 days late</span>
          <span className="font-mono text-xl sm:text-[22px] font-semibold text-[#8F4A09]">₹2,21,300</span>
          <span className="text-[12.5px] text-ink-secondary">52 students</span>
        </button>

        {/* Card 3: Over 60 days */}
        <button
          type="button"
          onClick={() => setAgeingFilter(ageingFilter === "OVER-60" ? "ALL" : "OVER-60")}
          className={`text-left bg-white border rounded-card p-4 flex flex-col gap-1 shadow-xs transition-all cursor-pointer ${
            ageingFilter === "OVER-60" ? "border-[#8F4A09] ring-2 ring-[#8F4A09]/20" : "border-line hover:border-slate-300"
          }`}
        >
          <span className="text-[12.5px] text-ink-secondary font-medium">Over 60 days late</span>
          <span className="font-mono text-xl sm:text-[22px] font-semibold text-[#8F4A09]">₹2,33,800</span>
          <span className="text-[12.5px] text-ink-secondary">36 students · report cards on hold</span>
        </button>
      </div>

      {/* Defaulters Section & Actions */}
      <section className="bg-white border border-line rounded-card overflow-hidden shadow-xs">
        {/* Selected Banner (Matching 22-Defaulters.html) */}
        <div className="flex justify-between items-center flex-wrap gap-3 px-4 py-3 bg-[#E3EFEF] border-b border-[#EEF1EF]">
          <span className="text-sm font-semibold text-ink">
            {selectedIds.length} selected · ₹{selectedTotalAmount.toLocaleString("en-IN")}
          </span>
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              disabled={selectedIds.length === 0}
              onClick={() => handleSendReminder("SMS")}
              className={`min-h-[38px] px-3.5 rounded-control border border-line-input text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedIds.length === 0
                  ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                  : "bg-white hover:bg-slate-50 text-ink shadow-xs"
              }`}
            >
              <FiMessageSquare size={13} />
              <span>Send SMS</span>
            </button>
            <button
              type="button"
              disabled={selectedIds.length === 0}
              onClick={() => handleSendReminder("WhatsApp")}
              className={`min-h-[38px] px-3.5 rounded-control text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                selectedIds.length === 0
                  ? "bg-[#9DB5B5] cursor-not-allowed"
                  : "bg-primary hover:bg-[#08393F] active:scale-[0.98]"
              }`}
            >
              <FiSend size={13} />
              <span>Send WhatsApp reminder with pay link</span>
            </button>
          </div>
        </div>

        {/* Table Filter Input */}
        <div className="p-3 border-b border-line bg-surface flex items-center justify-between gap-3">
          <div className="relative max-w-xs w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" size={13} />
            <input
              type="text"
              placeholder="Search in defaulters list..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 pl-8 pr-3 bg-white border border-line-input rounded-control text-xs text-ink focus:outline-none focus:border-primary"
            />
          </div>
          {ageingFilter !== "ALL" && (
            <button
              type="button"
              onClick={() => setAgeingFilter("ALL")}
              className="text-xs text-primary font-semibold hover:underline"
            >
              Clear filter ({ageingFilter})
            </button>
          )}
        </div>

        {/* Defaulters Table (Matching 22-Defaulters.html) */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs sm:text-small min-w-[880px]">
            <thead>
              <tr className="bg-[#F2F4F2] text-left text-ink border-b border-line">
                <th className="px-4 py-3 w-10 text-center">
                  <input
                    type="checkbox"
                    aria-label="Select all defaulters"
                    checked={selectedIds.length === filteredData.length && filteredData.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-[#C9D1CD] text-primary focus:ring-primary cursor-pointer"
                  />
                </th>
                <th className="px-3 py-3 font-semibold">Student</th>
                <th className="px-4 py-3 font-semibold">Guardian</th>
                <th className="px-4 py-3 font-semibold text-right">Overdue</th>
                <th className="px-4 py-3 font-semibold text-right">Days late</th>
                <th className="px-4 py-3 font-semibold">Last reminder</th>
                <th className="px-4 py-3 font-semibold">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF1EF]">
              {filteredData.map((row) => {
                const isSelected = selectedIds.includes(row.id);
                return (
                  <tr
                    key={row.id}
                    className={`transition-colors ${
                      isSelected ? "bg-[#F4F9F9]" : "bg-white hover:bg-slate-50/60"
                    }`}
                  >
                    <td className="px-4 py-2.5 text-center">
                      <input
                        type="checkbox"
                        aria-label={`Select ${row.name}`}
                        checked={isSelected}
                        onChange={() => toggleSelectOne(row.id)}
                        className="w-4 h-4 rounded border-[#C9D1CD] text-primary focus:ring-primary cursor-pointer"
                      />
                    </td>

                    <td className="px-3 py-2.5">
                      <span className="flex flex-col">
                        <span className="font-semibold text-ink">{row.name}</span>
                        <span className="text-[12px] text-ink-secondary">{row.classGrade}</span>
                      </span>
                    </td>

                    <td className="px-4 py-2.5">
                      <span className="flex flex-col">
                        <span className="text-ink">{row.guardian}</span>
                        <span className="text-[12px] text-ink-secondary">{row.phone}</span>
                      </span>
                    </td>

                    <td className="px-4 py-2.5 text-right font-mono font-semibold text-[#8F4A09]">
                      ₹{row.overdueAmount.toLocaleString("en-IN")}
                    </td>

                    <td className="px-4 py-2.5 text-right font-mono text-ink">
                      {row.daysLate}
                    </td>

                    <td className="px-4 py-2.5 text-ink-secondary">
                      {row.lastReminder}
                    </td>

                    <td className="px-4 py-2.5 text-ink-secondary">
                      {row.note}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================== */}
      {/* REMINDER MODAL                                                 */}
      {/* ============================================================== */}
      {isReminderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-line rounded-card shadow-2xl w-full max-w-md overflow-hidden animate-scaleUp">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-line bg-surface">
              <h3 className="font-semibold text-base text-ink">
                Dispatch {reminderType} Reminders
              </h3>
              <button
                type="button"
                onClick={() => setIsReminderModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-ink-secondary hover:bg-slate-200 transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3 bg-slate-50 border border-line rounded text-xs space-y-1 text-ink">
                <div><b>Recipients:</b> {selectedIds.length} guardians</div>
                <div><b>Total Outstanding:</b> ₹{selectedTotalAmount.toLocaleString("en-IN")}</div>
                <div><b>Channel:</b> School verified {reminderType} gateway</div>
              </div>

              <div className="text-xs text-ink-secondary leading-relaxed">
                Parents will receive an official notification with student breakdown, overdue days, and an instant UPI/NetBanking payment link.
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsReminderModalOpen(false)}
                  className="px-4 py-2 border border-line-input rounded-control text-xs font-semibold text-ink hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmSendReminder}
                  className="px-4 py-2 bg-primary hover:bg-[#08393F] text-white rounded-control text-xs font-semibold shadow-xs"
                >
                  Send Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
