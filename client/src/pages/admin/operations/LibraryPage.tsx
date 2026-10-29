import React, { useState } from "react";
import {
  FiBook,
  FiUser,
  FiSearch,
  FiRotateCw,
  FiSend,
  FiPlus,
  FiCheckCircle,
  FiX,
  FiDownload
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface OverdueRecord {
  id: string;
  bookTitle: string;
  memberName: string;
  memberClass: string;
  daysLate: number;
  fineAmount: number;
}

const DEFAULT_OVERDUE: OverdueRecord[] = [
  {
    id: "1",
    bookTitle: "Wings of Fire",
    memberName: "Kunal Rathore",
    memberClass: "10-A",
    daysLate: 12,
    fineAmount: 12
  },
  {
    id: "2",
    bookTitle: "NCERT Exemplar Maths 9",
    memberName: "Ira Joshi",
    memberClass: "9-C",
    daysLate: 9,
    fineAmount: 9
  },
  {
    id: "3",
    bookTitle: "Malgudi Days",
    memberName: "Diya Choudhary",
    memberClass: "7-B",
    daysLate: 7,
    fineAmount: 7
  },
  {
    id: "4",
    bookTitle: "Godaan (Hindi)",
    memberName: "Rachna Bose",
    memberClass: "Staff",
    daysLate: 5,
    fineAmount: 5
  },
  {
    id: "5",
    bookTitle: "Atlas of India",
    memberName: "Harsh Vardhan",
    memberClass: "8-A",
    daysLate: 4,
    fineAmount: 4
  },
  {
    id: "6",
    bookTitle: "Ruskin Bond Omnibus",
    memberName: "Pihu Sethi",
    memberClass: "11-Commerce",
    daysLate: 2,
    fineAmount: 2
  }
];

export default function LibraryPage() {
  const { showToast } = useToast();
  const [deskMode, setDeskMode] = useState<"issue" | "return">("issue");
  const [memberAdmissionNo, setMemberAdmissionNo] = useState("2019/0211");
  const [bookBarcode, setBookBarcode] = useState("ACC-004812");
  const [returnBarcode, setReturnBarcode] = useState("");
  const [overdueList, setOverdueList] = useState<OverdueRecord[]>(DEFAULT_OVERDUE);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);

  // New Book State
  const [newBookForm, setNewBookForm] = useState({
    title: "",
    author: "",
    accessionNo: `ACC-00${DEFAULT_OVERDUE.length + 4820}`,
    category: "Children's Fiction",
    rackLocation: "Rack C-4",
    copies: 5
  });

  const member = {
    name: "Arjun Meena",
    classGrade: "6-B",
    role: "Student member",
    issuedCount: "1 of 2 books issued",
    fines: "no fines"
  };

  const bookPreview = {
    title: "Panchatantra Stories (Hindi)",
    category: "Children's fiction",
    rack: "Rack C-3",
    copiesAvailable: "4 of 6 copies available",
    dueDate: "23 Oct 2026",
    loanDuration: "14 days"
  };

  const handleIssueBook = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Book '${bookPreview.title}' issued to ${member.name} (${memberAdmissionNo})! Due date: ${bookPreview.dueDate}.`, "success");
  };

  const handleReturnBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnBarcode.trim()) return;
    showToast(`Book ${returnBarcode} returned and checked in. Inventory updated.`, "success");
    setReturnBarcode("");
  };

  const handleRemindAll = () => {
    showToast(`WhatsApp & SMS overdue reminder broadcasts sent to all ${overdueList.length} guardians!`, "success");
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookForm.title.trim() || !newBookForm.author.trim()) return;
    setIsAddBookModalOpen(false);
    showToast(`Book '${newBookForm.title}' cataloged with Accession No. ${newBookForm.accessionNo}!`, "success");
    setNewBookForm({
      title: "",
      author: "",
      accessionNo: `ACC-00${Date.now().toString().slice(-4)}`,
      category: "Children's Fiction",
      rackLocation: "Rack C-4",
      copies: 5
    });
  };

  return (
    <div className="space-y-5 animate-fadeIn max-w-content mx-auto pb-12 font-sans">
      {/* Header Row (Matching 33-Library.html) */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[13px] text-ink-secondary">
            Library › Circulation desk
          </div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
            Issue and return
          </h1>
        </div>

        <div className="flex items-center gap-5 text-[13px] text-ink-secondary flex-wrap">
          <span>
            Issued today <b className="font-mono text-ink">46</b>
          </span>
          <span>
            Returned <b className="font-mono text-ink">31</b>
          </span>
          <span>
            Overdue <b className="font-mono text-warning-inline">58</b>
          </span>
          <button
            type="button"
            onClick={() => setIsAddBookModalOpen(true)}
            className="min-h-[40px] px-3.5 rounded-control bg-primary hover:bg-primary-dark text-white text-[13px] font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ml-2"
          >
            <FiPlus size={14} />
            <span>Add book</span>
          </button>
        </div>
      </div>

      {/* Segment Switcher (Matching 33-Library.html) */}
      <div className="grid grid-cols-2 bg-surface-segmented rounded-control p-1 max-w-[340px]">
        <button
          type="button"
          onClick={() => setDeskMode("issue")}
          className={`min-h-[40px] rounded-control font-semibold text-sm transition-all cursor-pointer ${
            deskMode === "issue"
              ? "bg-white text-ink shadow-xs"
              : "bg-transparent text-ink-secondary hover:text-ink"
          }`}
        >
          Issue
        </button>
        <button
          type="button"
          onClick={() => setDeskMode("return")}
          className={`min-h-[40px] rounded-control font-medium text-sm transition-all cursor-pointer ${
            deskMode === "return"
              ? "bg-white text-ink shadow-xs font-semibold"
              : "bg-transparent text-ink-secondary hover:text-ink"
          }`}
        >
          Return / renew
        </button>
      </div>

      {/* Main Circulation Desk and Overdue Register Layout */}
      <div className="flex flex-wrap gap-5 items-start">
        {/* Left: Desk Operations (Matching 33-Library.html) */}
        <section className="flex-1 basis-[360px] bg-white border border-line rounded-card p-5 flex flex-col gap-4 shadow-xs">
          {deskMode === "issue" ? (
            <form onSubmit={handleIssueBook} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
                1. Scan member card or type admission no.
                <input
                  type="text"
                  value={memberAdmissionNo}
                  onChange={e => setMemberAdmissionNo(e.target.value)}
                  className="min-h-[46px] px-3.5 border-2 border-primary rounded-control font-mono text-base text-ink focus:outline-none"
                />
              </label>

              {/* Member Card Preview */}
              <div className="flex gap-3 items-center p-3 bg-primary-row rounded-control border border-nav-text">
                <div className="w-10 h-10 rounded-full bg-primary-tint text-primary flex items-center justify-center font-semibold text-xs shrink-0">
                  AM
                </div>
                <div className="flex flex-col gap-0.5 text-xs">
                  <span className="font-semibold text-sm text-ink">
                    {member.name} · {member.classGrade}
                  </span>
                  <span className="text-ink-secondary">
                    {member.role} · {member.issuedCount} · {member.fines}
                  </span>
                </div>
              </div>

              <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
                2. Scan book barcode
                <input
                  type="text"
                  value={bookBarcode}
                  onChange={e => setBookBarcode(e.target.value)}
                  className="min-h-[46px] px-3.5 border border-line-input rounded-control font-mono text-base text-ink focus:border-primary focus:outline-none"
                />
              </label>

              {/* Book Preview Card */}
              <div className="flex gap-3 p-3 border border-line rounded-control">
                <div className="w-13 h-18 shrink-0 rounded bg-[#E9DFC8] text-tag-text flex items-center justify-center text-[10px] text-center font-medium">
                  [Cover]
                </div>
                <div className="flex flex-col gap-1 text-xs">
                  <span className="font-semibold text-sm text-ink">
                    {bookPreview.title}
                  </span>
                  <span className="text-ink-secondary">
                    {bookPreview.category} · {bookPreview.rack} · {bookPreview.copiesAvailable}
                  </span>
                  <span className="text-ink-secondary">
                    Due back: <b className="text-ink">{bookPreview.dueDate}</b> ({bookPreview.loanDuration})
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="min-h-[46px] rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-sm transition-all cursor-pointer shadow-xs active:scale-[0.98] mt-1"
              >
                Issue book
              </button>
            </form>
          ) : (
            <form onSubmit={handleReturnBook} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
                Scan book accession barcode to return / renew
                <input
                  type="text"
                  required
                  placeholder="e.g. ACC-004812"
                  value={returnBarcode}
                  onChange={e => setReturnBarcode(e.target.value)}
                  className="min-h-[46px] px-3.5 border-2 border-primary rounded-control font-mono text-base text-ink focus:outline-none"
                />
              </label>

              <div className="p-3.5 bg-slate-50 border border-line rounded-control text-xs text-ink-secondary space-y-1">
                <div>Scan barcode on inside cover of the book.</div>
                <div>System checks loan status, calculates overdue fines (₹1/day), and marks book available immediately.</div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 min-h-[44px] rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-sm transition-all cursor-pointer shadow-xs"
                >
                  Confirm Return
                </button>
                <button
                  type="button"
                  onClick={() => showToast("Book loan renewed for 14 additional days!", "info")}
                  className="min-h-[44px] px-4 border border-line-input bg-white hover:bg-slate-50 text-ink rounded-control font-medium text-xs transition"
                >
                  Renew Loan
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Right: Overdue Books Register (Matching 33-Library.html) */}
        <section className="flex-1 basis-[420px] min-w-0 bg-white border border-line rounded-card overflow-hidden shadow-xs">
          <div className="p-4 px-5 border-b border-line-row flex justify-between items-center gap-3 flex-wrap">
            <h2 className="m-0 text-base font-semibold text-ink">Overdue books</h2>
            <button
              type="button"
              onClick={handleRemindAll}
              className="min-h-[38px] px-3.5 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              Remind all guardians
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm min-w-[500px]">
              <thead>
                <tr className="bg-surface-head text-left">
                  <th className="py-2.5 px-4 font-semibold text-xs text-ink">Book</th>
                  <th className="py-2.5 px-4 font-semibold text-xs text-ink">Member</th>
                  <th className="py-2.5 px-4 font-semibold text-xs text-ink text-right">Days late</th>
                  <th className="py-2.5 px-4 font-semibold text-xs text-ink text-right">Fine</th>
                </tr>
              </thead>
              <tbody>
                {overdueList.map(item => (
                  <tr key={item.id} className="border-t border-line-row hover:bg-slate-50/60">
                    <td className="py-2.5 px-4 font-medium text-ink text-xs sm:text-sm">
                      {item.bookTitle}
                    </td>
                    <td className="py-2.5 px-4 text-xs text-ink-secondary">
                      {item.memberName} · {item.memberClass}
                    </td>
                    <td className="py-2.5 px-4 text-xs text-right font-mono text-warning-inline font-medium">
                      {item.daysLate}
                    </td>
                    <td className="py-2.5 px-4 text-xs text-right font-mono text-ink">
                      ₹{item.fineAmount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 px-5 text-xs text-ink-secondary border-t border-line-row">
            Fines (₹1 per day) are added to the student's fee ledger when the book is returned.
          </div>
        </section>
      </div>

      {/* Add Book to Catalog Modal */}
      {isAddBookModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-line rounded-card w-full max-w-md shadow-xl p-6 space-y-4 font-sans animate-in fade-in zoom-in-95 text-xs">
            <div className="flex justify-between items-center pb-2.5 border-b border-line">
              <h3 className="font-semibold text-base text-ink">Catalog New Book</h3>
              <button
                type="button"
                onClick={() => setIsAddBookModalOpen(false)}
                className="text-ink-secondary hover:text-ink text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBook} className="space-y-3.5">
              <div>
                <label className="block text-ink font-medium mb-1">Book Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Discovery of India"
                  value={newBookForm.title}
                  onChange={e => setNewBookForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">Author</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jawaharlal Nehru"
                  value={newBookForm.author}
                  onChange={e => setNewBookForm(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink font-medium mb-1">Accession No.</label>
                  <input
                    type="text"
                    required
                    value={newBookForm.accessionNo}
                    onChange={e => setNewBookForm(prev => ({ ...prev, accessionNo: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-line rounded-control text-ink font-mono text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-ink font-medium mb-1">Number of Copies</label>
                  <input
                    type="number"
                    required
                    value={newBookForm.copies}
                    onChange={e => setNewBookForm(prev => ({ ...prev, copies: Number(e.target.value) }))}
                    className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink font-medium mb-1">Category / Section</label>
                  <select
                    value={newBookForm.category}
                    onChange={e => setNewBookForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  >
                    <option>Children's Fiction</option>
                    <option>Science & Tech</option>
                    <option>History & Civics</option>
                    <option>Hindi Literature</option>
                    <option>Reference / Encyclopedia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-ink font-medium mb-1">Rack / Shelf Location</label>
                  <input
                    type="text"
                    placeholder="Rack B-2"
                    value={newBookForm.rackLocation}
                    onChange={e => setNewBookForm(prev => ({ ...prev, rackLocation: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAddBookModalOpen(false)}
                  className="px-4 py-2 border border-line-input rounded-control text-ink hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-control font-semibold shadow-xs"
                >
                  Save to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
