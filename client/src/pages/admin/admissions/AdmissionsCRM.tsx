import React, { useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiCopy,
  FiCheck,
  FiFilter,
  FiPhone,
  FiClock,
  FiAlertCircle,
  FiChevronRight,
  FiList,
  FiColumns,
  FiUserPlus,
  FiCalendar
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";
import AdmissionsPanel from "../student/AdmissionsPanel";

interface PipelineLead {
  id: string;
  name: string;
  classGrade: string;
  guardian: string;
  phone: string;
  source: "Walk-in" | "Website" | "Referral" | "Facebook" | "RTE";
  stage: "enquiry" | "followup" | "application" | "verification" | "test" | "approved" | "enrolled";
  followUpText: string;
  isOverdue?: boolean;
  date: string;
}

const INITIAL_LEADS: PipelineLead[] = [
  {
    id: "ENQ-101",
    name: "Ishaan Agarwal",
    classGrade: "Nursery",
    guardian: "Father",
    phone: "98290 12345",
    source: "Website",
    stage: "enquiry",
    followUpText: "Call today",
    isOverdue: false,
    date: "14 Oct"
  },
  {
    id: "ENQ-102",
    name: "Myra Khandelwal",
    classGrade: "Class 1",
    guardian: "Mother",
    phone: "94140 88921",
    source: "Walk-in",
    stage: "enquiry",
    followUpText: "Tomorrow",
    isOverdue: false,
    date: "14 Oct"
  },
  {
    id: "ENQ-103",
    name: "Kabir Saxena",
    classGrade: "Class 6",
    guardian: "Father",
    phone: "99280 44512",
    source: "Referral",
    stage: "enquiry",
    followUpText: "16 Oct",
    isOverdue: false,
    date: "13 Oct"
  },
  {
    id: "ENQ-104",
    name: "Anaya Mathur",
    classGrade: "LKG",
    guardian: "Mother",
    phone: "97720 90123",
    source: "Facebook",
    stage: "followup",
    followUpText: "2 days late",
    isOverdue: true,
    date: "10 Oct"
  },
  {
    id: "ENQ-105",
    name: "Vihaan Soni",
    classGrade: "Class 1",
    guardian: "Father",
    phone: "98870 55142",
    source: "Walk-in",
    stage: "followup",
    followUpText: "Today 4 pm",
    isOverdue: false,
    date: "14 Oct"
  },
  {
    id: "APP-201",
    name: "Sara Bansal",
    classGrade: "Nursery",
    guardian: "Mother",
    phone: "96490 33211",
    source: "Website",
    stage: "application",
    followUpText: "Docs pending",
    isOverdue: true,
    date: "12 Oct"
  },
  {
    id: "APP-202",
    name: "Aditya Rawat",
    classGrade: "Class 11",
    guardian: "Father",
    phone: "94600 77123",
    source: "Referral",
    stage: "application",
    followUpText: "Form complete",
    isOverdue: false,
    date: "13 Oct"
  },
  {
    id: "APP-203",
    name: "Navya Jangid",
    classGrade: "Class 1",
    guardian: "Mother",
    phone: "98281 99042",
    source: "Walk-in",
    stage: "verification",
    followUpText: "Interaction 15 Oct",
    isOverdue: false,
    date: "11 Oct"
  },
  {
    id: "APP-204",
    name: "Reyansh Tak",
    classGrade: "Class 6",
    guardian: "Father",
    phone: "99830 11984",
    source: "Website",
    stage: "test",
    followUpText: "Result pending",
    isOverdue: false,
    date: "13 Oct"
  },
  {
    id: "APP-205",
    name: "Kiara Purohit",
    classGrade: "Nursery",
    guardian: "Mother",
    phone: "95870 33412",
    source: "RTE",
    stage: "test",
    followUpText: "RTE · lottery list",
    isOverdue: false,
    date: "12 Oct"
  },
  {
    id: "APP-206",
    name: "Dhruv Mehta",
    classGrade: "Class 1",
    guardian: "Father",
    phone: "98290 88214",
    source: "Referral",
    stage: "approved",
    followUpText: "Fee due 18 Oct",
    isOverdue: false,
    date: "10 Oct"
  },
  {
    id: "APP-207",
    name: "Aarohi Sethi",
    classGrade: "Nursery",
    guardian: "Mother",
    phone: "94130 55190",
    source: "Website",
    stage: "enrolled",
    followUpText: "Adm. 2026/0018",
    isOverdue: false,
    date: "08 Oct"
  }
];

const STAGES: { key: PipelineLead["stage"]; label: string; count: number }[] = [
  { key: "enquiry", label: "Enquiry", count: 48 },
  { key: "followup", label: "Follow-up", count: 31 },
  { key: "application", label: "Application", count: 22 },
  { key: "verification", label: "Docs Verified", count: 14 },
  { key: "test", label: "Test / Interview", count: 9 },
  { key: "approved", label: "Approved", count: 6 },
  { key: "enrolled", label: "Enrolled", count: 18 }
];

const SEATS = [
  { className: "Nursery", filled: 41, total: 60 },
  { className: "Class 1", filled: 23, total: 120 },
  { className: "Class 6", filled: 8, total: 120 },
  { className: "Class 11", filled: 37, total: 120 }
];

export default function AdmissionsCRM() {
  const { showToast } = useToast();
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [leads, setLeads] = useState<PipelineLead[]>(INITIAL_LEADS);
  const [classFilter, setClassFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New enquiry form state
  const [newEnquiry, setNewEnquiry] = useState({
    name: "",
    classGrade: "Nursery",
    guardian: "Father",
    phone: "",
    source: "Walk-in" as PipelineLead["source"]
  });

  const handleCopyLink = () => {
    const link = `${window.location.origin}/admissions/apply`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    showToast("Application link copied to clipboard!", "success");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCreateEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEnquiry.name || !newEnquiry.phone) {
      showToast("Please provide applicant name and phone number.", "error");
      return;
    }
    const lead: PipelineLead = {
      id: `ENQ-${Math.floor(100 + Math.random() * 900)}`,
      name: newEnquiry.name,
      classGrade: newEnquiry.classGrade,
      guardian: newEnquiry.guardian,
      phone: newEnquiry.phone,
      source: newEnquiry.source,
      stage: "enquiry",
      followUpText: "Follow-up scheduled",
      isOverdue: false,
      date: "Today"
    };
    setLeads([lead, ...leads]);
    setIsAddModalOpen(false);
    setNewEnquiry({ name: "", classGrade: "Nursery", guardian: "Father", phone: "", source: "Walk-in" });
    showToast(`Enquiry for ${lead.name} added successfully!`, "success");
  };

  const moveStage = (leadId: string, direction: "next" | "prev") => {
    const stageOrder: PipelineLead["stage"][] = [
      "enquiry",
      "followup",
      "application",
      "verification",
      "test",
      "approved",
      "enrolled"
    ];
    setLeads(prev =>
      prev.map(item => {
        if (item.id === leadId) {
          const currentIndex = stageOrder.indexOf(item.stage);
          const nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
          if (nextIndex >= 0 && nextIndex < stageOrder.length) {
            return { ...item, stage: stageOrder[nextIndex] };
          }
        }
        return item;
      })
    );
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      l.id.toLowerCase().includes(search.toLowerCase());
    const matchesClass = classFilter === "All" || l.classGrade === classFilter;
    const matchesSource = sourceFilter === "All" || l.source === sourceFilter;
    return matchesSearch && matchesClass && matchesSource;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-navy">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-navy-muted tracking-wide uppercase">
            Admissions › Pipeline · Session 2026-27 Intake
          </div>
          <h1 className="text-2xl font-bold text-navy mt-1">Admission Pipeline</h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-surface border border-line rounded-control p-1">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-control text-xs font-semibold transition ${
                viewMode === "kanban"
                  ? "bg-nav-bg text-gold shadow-sm"
                  : "text-navy-muted hover:text-navy"
              }`}
            >
              <FiColumns size={14} /> Pipeline
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-control text-xs font-semibold transition ${
                viewMode === "table"
                  ? "bg-nav-bg text-gold shadow-sm"
                  : "text-navy-muted hover:text-navy"
              }`}
            >
              <FiList size={14} /> Table View
            </button>
          </div>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-3.5 py-2 border border-line rounded-control bg-surface hover:bg-page text-xs font-medium text-navy transition"
          >
            {copiedLink ? <FiCheck className="text-emerald-600" /> : <FiCopy />}
            <span>Copy application link</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-control bg-teal hover:bg-teal-hover text-white text-xs font-semibold shadow-sm transition"
          >
            <FiUserPlus size={15} /> Add Enquiry
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
        <AdmissionsPanel />
      ) : (
        <>
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 bg-surface border border-line rounded-panel p-3.5 shadow-sm">
            <div className="relative flex-1 min-w-[220px]">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-muted" size={15} />
              <input
                type="text"
                placeholder="Search student, applicant or phone..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-page border border-line rounded-control text-xs text-navy focus:outline-none focus:border-teal"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-navy-muted font-medium">Class:</span>
              <select
                value={classFilter}
                onChange={e => setClassFilter(e.target.value)}
                className="bg-page border border-line rounded-control px-2.5 py-1.5 text-xs text-navy font-medium focus:outline-none"
              >
                <option value="All">All classes</option>
                <option value="Nursery">Nursery</option>
                <option value="LKG">LKG</option>
                <option value="Class 1">Class 1</option>
                <option value="Class 6">Class 6</option>
                <option value="Class 11">Class 11</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-navy-muted font-medium">Source:</span>
              <select
                value={sourceFilter}
                onChange={e => setSourceFilter(e.target.value)}
                className="bg-page border border-line rounded-control px-2.5 py-1.5 text-xs text-navy font-medium focus:outline-none"
              >
                <option value="All">All sources</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Facebook">Facebook</option>
                <option value="RTE">RTE</option>
              </select>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <FiClock size={12} /> 5 follow-ups overdue
              </span>
            </div>
          </div>

          {/* Kanban Board */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-3.5 min-w-max items-start">
              {STAGES.map(stage => {
                const stageLeads = filteredLeads.filter(l => l.stage === stage.key);
                return (
                  <div
                    key={stage.key}
                    className="w-64 bg-slate-50/80 border border-line/80 rounded-panel p-3 flex flex-col gap-2.5 shrink-0"
                  >
                    <div className="flex items-center justify-between px-1">
                      <h3 className="font-semibold text-xs text-navy uppercase tracking-wider">{stage.label}</h3>
                      <span className="font-mono text-xs px-2 py-0.5 bg-surface border border-line rounded-full text-navy-muted">
                        {stageLeads.length}
                      </span>
                    </div>

                    <div className="space-y-2.5 min-h-[140px]">
                      {stageLeads.length === 0 ? (
                        <div className="h-24 border border-dashed border-line rounded-control flex items-center justify-center text-xs text-navy-muted italic">
                          No leads in stage
                        </div>
                      ) : (
                        stageLeads.map(lead => (
                          <div
                            key={lead.id}
                            className="bg-surface border border-line rounded-control p-3 shadow-xs hover:shadow-sm transition space-y-2 group"
                          >
                            <div className="flex items-start justify-between gap-1.5">
                              <div>
                                <div className="font-semibold text-sm text-navy">{lead.name}</div>
                                <div className="text-xs text-navy-muted">
                                  {lead.guardian} · {lead.phone}
                                </div>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal/10 text-teal border border-teal/20">
                                {lead.classGrade}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[11px] pt-2 border-t border-line/50">
                              <span className="text-navy-muted">{lead.source}</span>
                              <span
                                className={`font-semibold ${
                                  lead.isOverdue ? "text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded" : "text-navy-muted"
                                }`}
                              >
                                {lead.followUpText}
                              </span>
                            </div>

                            {/* Quick Move Controls */}
                            <div className="flex items-center justify-between pt-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                              <button
                                onClick={() => moveStage(lead.id, "prev")}
                                disabled={stage.key === "enquiry"}
                                className="text-[10px] text-navy-muted hover:text-navy disabled:opacity-30 disabled:pointer-events-none"
                              >
                                ← Prev
                              </button>
                              <button
                                onClick={() => moveStage(lead.id, "next")}
                                disabled={stage.key === "enrolled"}
                                className="text-[10px] font-semibold text-teal hover:underline disabled:opacity-30 disabled:pointer-events-none flex items-center gap-0.5"
                              >
                                Advance →
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seats Left Capacity Section */}
          <div className="bg-surface border border-line rounded-panel p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm text-navy">Seats Left for Session 2026-27 Intake</h2>
              <span className="text-xs text-navy-muted">Real-time enrolled vs capacity</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {SEATS.map(seat => {
                const percent = Math.round((seat.filled / seat.total) * 100);
                const remaining = seat.total - seat.filled;
                return (
                  <div key={seat.className} className="space-y-1.5 p-3 rounded-control bg-page border border-line/60">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-navy">{seat.className}</span>
                      <span className="font-mono text-navy-muted">
                        {seat.filled} of {seat.total} ({remaining} left)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          percent > 85 ? "bg-amber-600" : "bg-teal"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Add Enquiry Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-line rounded-panel w-full max-w-md shadow-xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h3 className="font-bold text-base text-navy">Add Admission Enquiry</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-navy-muted hover:text-navy text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEnquiry} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-navy mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={newEnquiry.name}
                  onChange={e => setNewEnquiry({ ...newEnquiry, name: e.target.value })}
                  className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none focus:border-teal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-navy mb-1">Applying for Class</label>
                  <select
                    value={newEnquiry.classGrade}
                    onChange={e => setNewEnquiry({ ...newEnquiry, classGrade: e.target.value })}
                    className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none"
                  >
                    <option>Nursery</option>
                    <option>LKG</option>
                    <option>UKG</option>
                    <option>Class 1</option>
                    <option>Class 6</option>
                    <option>Class 11</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-navy mb-1">Lead Source</label>
                  <select
                    value={newEnquiry.source}
                    onChange={e => setNewEnquiry({ ...newEnquiry, source: e.target.value as any })}
                    className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none"
                  >
                    <option value="Walk-in">Walk-in</option>
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Facebook">Facebook</option>
                    <option value="RTE">RTE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-navy mb-1">Guardian</label>
                  <select
                    value={newEnquiry.guardian}
                    onChange={e => setNewEnquiry({ ...newEnquiry, guardian: e.target.value })}
                    className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none"
                  >
                    <option>Father</option>
                    <option>Mother</option>
                    <option>Guardian</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-navy mb-1">Contact Mobile *</label>
                  <input
                    type="tel"
                    required
                    placeholder="98290 xxxxx"
                    value={newEnquiry.phone}
                    onChange={e => setNewEnquiry({ ...newEnquiry, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none focus:border-teal"
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
                  Save Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
