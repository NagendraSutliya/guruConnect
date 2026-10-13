import React, { useState } from "react";
import {
  FiBook,
  FiUser,
  FiSearch,
  FiAlertCircle,
  FiCheckCircle,
  FiRotateCw,
  FiSend,
  FiBookmark
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface OverdueBook {
  id: string;
  title: string;
  member: string;
  classGrade: string;
  daysLate: number;
  fineAmount: number;
}

const DEFAULT_OVERDUE: OverdueBook[] = [
  { id: "1", title: "Wings of Fire · APJ Abdul Kalam", member: "Kunal Rathore", classGrade: "10-A", daysLate: 12, fineAmount: 24 },
  { id: "2", title: "NCERT Exemplar Maths Class 9", member: "Ira Joshi", classGrade: "9-C", daysLate: 9, fineAmount: 18 },
  { id: "3", title: "Malgudi Days · R.K. Narayan", member: "Diya Choudhary", classGrade: "7-B", daysLate: 7, fineAmount: 14 },
  { id: "4", title: "Concepts of Physics (Vol 1) · H.C. Verma", member: "Aman Gupta", classGrade: "11-A", daysLate: 5, fineAmount: 10 }
];

export default function LibraryPage() {
  const { showToast } = useToast();
  const [deskMode, setDeskMode] = useState<"issue" | "return">("issue");
  const [memberId, setMemberId] = useState("2019/0211");
  const [bookBarcode, setBookBarcode] = useState("ACC-004812");
  const [overdueList, setOverdueList] = useState<OverdueBook[]>(DEFAULT_OVERDUE);

  const member = {
    name: "Arjun Meena",
    classGrade: "6-B",
    type: "Student Member",
    currentlyIssued: "1 of 2 books",
    fines: "₹0"
  };

  const bookPreview = {
    title: "Panchatantra Stories (Hindi Edition)",
    author: "Vishnu Sharma / Children Classics",
    shelf: "Rack C-3 · Section Fiction",
    availableCopies: "4 of 6 copies available",
    dueDate: "28 Oct 2026 (14 Days Loan)"
  };

  const handleIssueBook = () => {
    showToast(`Book '${bookPreview.title}' issued to ${member.name}. Return due in 14 days.`, "success");
  };

  const handleRemindAll = () => {
    showToast(`Sent overdue automated SMS & App reminders to all ${overdueList.length} student guardians.`, "success");
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-navy">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-navy-muted tracking-wide uppercase">
            Operations › Library Management
          </div>
          <h1 className="text-2xl font-bold text-navy mt-1">Circulation Desk & Catalog</h1>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="bg-surface border border-line rounded-control px-3 py-1.5 shadow-xs">
            Issued Today: <b className="font-mono text-teal">46</b>
          </div>
          <div className="bg-surface border border-line rounded-control px-3 py-1.5 shadow-xs">
            Returned: <b className="font-mono text-emerald-700">31</b>
          </div>
          <div className="bg-surface border border-line rounded-control px-3 py-1.5 shadow-xs">
            Overdue: <b className="font-mono text-amber-800">58</b>
          </div>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="inline-flex bg-page p-1 border border-line rounded-control">
        <button
          onClick={() => setDeskMode("issue")}
          className={`px-5 py-1.5 rounded-control text-xs font-bold transition ${
            deskMode === "issue" ? "bg-teal text-white shadow-xs" : "text-navy-muted hover:text-navy"
          }`}
        >
          Issue Book
        </button>
        <button
          onClick={() => setDeskMode("return")}
          className={`px-5 py-1.5 rounded-control text-xs font-bold transition ${
            deskMode === "return" ? "bg-teal text-white shadow-xs" : "text-navy-muted hover:text-navy"
          }`}
        >
          Return / Renew
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Issue / Return Scanner Desk matching Screen 33 */}
        <div className="lg:col-span-6 bg-surface border border-line rounded-panel p-5 shadow-sm space-y-4">
          <h2 className="font-semibold text-sm text-navy border-b border-line pb-3">
            1. Scan Member Card or Admission No.
          </h2>

          <div>
            <input
              type="text"
              value={memberId}
              onChange={e => setMemberId(e.target.value)}
              className="w-full px-3 py-2.5 font-mono text-sm bg-page border-2 border-teal/70 rounded-control text-navy focus:outline-none"
              placeholder="Scan Barcode or type 2019/0211"
            />
          </div>

          {/* Member Card Preview */}
          <div className="p-3 bg-page rounded-control border border-line flex items-center gap-3 text-xs">
            <div className="w-10 h-10 rounded-full bg-teal/15 text-teal font-bold flex items-center justify-center shrink-0">
              AM
            </div>
            <div>
              <div className="font-bold text-navy">{member.name} · {member.classGrade}</div>
              <div className="text-navy-muted text-[11px]">
                {member.type} · Currently holding: {member.currentlyIssued} · Outstanding fines: {member.fines}
              </div>
            </div>
          </div>

          <h2 className="font-semibold text-sm text-navy pt-2 border-b border-line pb-3">
            2. Scan Book Accession Barcode
          </h2>

          <div>
            <input
              type="text"
              value={bookBarcode}
              onChange={e => setBookBarcode(e.target.value)}
              className="w-full px-3 py-2.5 font-mono text-sm bg-page border border-line rounded-control text-navy focus:outline-none focus:border-teal"
              placeholder="e.g. ACC-004812"
            />
          </div>

          {/* Book Details Preview */}
          <div className="p-3 bg-page rounded-control border border-line flex items-start gap-3 text-xs">
            <div className="w-12 h-16 rounded bg-amber-100/70 border border-amber-200 flex items-center justify-center text-amber-900 font-bold text-[9px] text-center p-1 shrink-0">
              [Book Cover]
            </div>
            <div className="space-y-1">
              <div className="font-bold text-navy">{bookPreview.title}</div>
              <div className="text-navy-muted text-[11px]">{bookPreview.author}</div>
              <div className="text-navy-muted text-[11px] font-medium">{bookPreview.shelf}</div>
              <div className="text-teal font-semibold text-[11px]">{bookPreview.dueDate}</div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleIssueBook}
              className="w-full py-3 bg-teal hover:bg-teal-hover text-white rounded-control font-bold text-xs shadow-xs transition"
            >
              Issue Book to Member
            </button>
          </div>
        </div>

        {/* Right: Overdue Books Register from Screen 33 */}
        <div className="lg:col-span-6 bg-surface border border-line rounded-panel shadow-sm overflow-hidden">
          <div className="p-4 border-b border-line flex items-center justify-between gap-3 bg-page/30">
            <div>
              <h2 className="font-bold text-sm text-navy">Overdue Borrowed Books</h2>
              <p className="text-[11px] text-navy-muted">Late fine: ₹2 per overdue day</p>
            </div>
            <button
              onClick={handleRemindAll}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-control text-xs font-bold shadow-xs transition"
            >
              <FiSend size={13} /> Remind Guardians
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-page/70 border-b border-line text-navy-muted font-semibold">
                  <th className="py-2.5 px-4">Book Title</th>
                  <th className="py-2.5 px-4">Student</th>
                  <th className="py-2.5 px-4 text-center">Days Late</th>
                  <th className="py-2.5 px-4 text-right">Fine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {overdueList.map(book => (
                  <tr key={book.id} className="hover:bg-page/40 transition">
                    <td className="py-2.5 px-4 font-bold text-navy">{book.title}</td>
                    <td className="py-2.5 px-4">
                      <div className="text-navy font-medium">{book.member}</div>
                      <div className="text-navy-muted text-[10px]">{book.classGrade}</div>
                    </td>
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-amber-800">
                      {book.daysLate}d
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-navy">
                      ₹{book.fineAmount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
