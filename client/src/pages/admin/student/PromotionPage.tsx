import React, { useState } from "react";
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiArrowRight,
  FiUserCheck,
  FiUserX,
  FiLogOut,
  FiFilter,
  FiSave
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface StudentPromotionRecord {
  id: string;
  roll: string;
  name: string;
  result: string;
  attendance: string;
  decision: "promote" | "detain" | "leave";
  isFailed?: boolean;
  tcRequested?: boolean;
}

const INITIAL_STUDENTS: StudentPromotionRecord[] = [
  { id: "1", roll: "01", name: "Aanya Bhatt", result: "Pass · A2", attendance: "95%", decision: "promote" },
  { id: "2", roll: "02", name: "Aarav Gupta", result: "Pass · A1", attendance: "96%", decision: "promote" },
  { id: "3", roll: "03", name: "Ananya Saxena", result: "Pass · B1", attendance: "92%", decision: "promote" },
  { id: "4", roll: "04", name: "Aryan Jangid", result: "Pass · B2", attendance: "88%", decision: "promote" },
  { id: "5", roll: "05", name: "Bhavya Joshi", result: "Pass · A2", attendance: "94%", decision: "promote" },
  {
    id: "6",
    roll: "06",
    name: "Chirag Saini",
    result: "Fail in Maths, Hindi",
    attendance: "71%",
    decision: "detain",
    isFailed: true
  },
  { id: "7", roll: "07", name: "Devansh Tak", result: "Pass · C1", attendance: "84%", decision: "promote" },
  {
    id: "8",
    roll: "08",
    name: "Gauri Vyas",
    result: "Pass · B1 · TC requested",
    attendance: "90%",
    decision: "leave",
    tcRequested: true
  },
  { id: "9", roll: "09", name: "Harshit Meena", result: "Pass · B2", attendance: "86%", decision: "promote" },
  { id: "10", roll: "10", name: "Ishita Rao", result: "Pass · A1", attendance: "98%", decision: "promote" }
];

export default function PromotionPage() {
  const { showToast } = useToast();
  const [currentClass, setCurrentClass] = useState("5-A");
  const [targetClass, setTargetClass] = useState("Class 6");
  const [sectionRule, setSectionRule] = useState("same");
  const [students, setStudents] = useState<StudentPromotionRecord[]>(INITIAL_STUDENTS);

  const handleDecision = (id: string, decision: "promote" | "detain" | "leave") => {
    setStudents(prev =>
      prev.map(s => (s.id === id ? { ...s, decision } : s))
    );
  };

  const handlePromoteAll = () => {
    setStudents(prev =>
      prev.map(s => ({
        ...s,
        decision: s.isFailed ? "detain" : s.tcRequested ? "leave" : "promote"
      }))
    );
    showToast("Decisions reset to auto-recommended results.", "info");
  };

  const promoteCount = students.filter(s => s.decision === "promote").length;
  const detainCount = students.filter(s => s.decision === "detain").length;
  const leaveCount = students.filter(s => s.decision === "leave").length;

  const handleConfirm = () => {
    showToast(
      `Successfully processed promotions: ${promoteCount} promoted to ${targetClass}, ${detainCount} detained, ${leaveCount} flagged for TC.`,
      "success"
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-navy">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-navy-muted tracking-wide uppercase">
            Students › Academic Transition · 2026-27 → 2027-28
          </div>
          <h1 className="text-2xl font-bold text-navy mt-1">
            Promote Class {currentClass} to {targetClass}
          </h1>
          <p className="text-xs text-navy-muted mt-0.5">
            Suggested decisions come from published annual examination results. Override any decision with reason.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-medium text-navy">
            <span>New Section Rule:</span>
            <select
              value={sectionRule}
              onChange={e => setSectionRule(e.target.value)}
              className="bg-surface border border-line rounded-control px-2.5 py-1.5 text-xs text-navy font-medium focus:outline-none"
            >
              <option value="same">Keep same section (6-A)</option>
              <option value="balance">Balance by gender</option>
              <option value="alpha">Alphabetical across sections</option>
            </select>
          </label>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-line rounded-panel p-4 shadow-sm space-y-1">
          <div className="text-xs text-navy-muted font-medium">Students in {currentClass}</div>
          <div className="font-mono text-2xl font-bold text-navy">{students.length}</div>
        </div>

        <div className="bg-surface border border-line rounded-panel p-4 shadow-sm space-y-1">
          <div className="text-xs text-emerald-700 font-medium">Promote to {targetClass}</div>
          <div className="font-mono text-2xl font-bold text-emerald-700">{promoteCount}</div>
        </div>

        <div className="bg-surface border border-line rounded-panel p-4 shadow-sm space-y-1">
          <div className="text-xs text-amber-800 font-medium">Detain in Class 5</div>
          <div className="font-mono text-2xl font-bold text-amber-800">{detainCount}</div>
        </div>

        <div className="bg-surface border border-line rounded-panel p-4 shadow-sm space-y-1">
          <div className="text-xs text-navy-muted font-medium">Leaving (TC requested)</div>
          <div className="font-mono text-2xl font-bold text-navy-muted">{leaveCount}</div>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-surface border border-line rounded-panel shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-line flex items-center justify-between bg-page/40">
          <div className="flex items-center gap-3 text-xs font-medium">
            <span>Select Class:</span>
            <select
              value={currentClass}
              onChange={e => setCurrentClass(e.target.value)}
              className="bg-surface border border-line rounded-control px-2 py-1 text-xs"
            >
              <option value="5-A">Class 5-A</option>
              <option value="5-B">Class 5-B</option>
              <option value="6-A">Class 6-A</option>
              <option value="8-A">Class 8-A</option>
              <option value="10-A">Class 10-A</option>
            </select>
          </div>
          <button
            onClick={handlePromoteAll}
            className="text-xs text-teal font-semibold hover:underline"
          >
            Reset to Recommended Results
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-page/70 border-b border-line text-navy-muted font-semibold">
                <th className="py-3 px-4 w-16">Roll</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Annual Result</th>
                <th className="py-3 px-4 text-right">Attendance</th>
                <th className="py-3 px-4 text-center">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {students.map(student => (
                <tr
                  key={student.id}
                  className={`hover:bg-page/40 transition ${
                    student.decision === "detain"
                      ? "bg-amber-50/40"
                      : student.decision === "leave"
                      ? "bg-slate-50/70"
                      : ""
                  }`}
                >
                  <td className="py-3 px-4 font-mono text-navy-muted">{student.roll}</td>
                  <td className="py-3 px-4 font-semibold text-navy">{student.name}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-medium ${
                        student.isFailed
                          ? "text-amber-800 font-semibold"
                          : student.tcRequested
                          ? "text-navy-muted italic"
                          : "text-navy"
                      }`}
                    >
                      {student.result}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono">{student.attendance}</td>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleDecision(student.id, "promote")}
                        className={`px-3 py-1 rounded-control text-xs font-semibold transition ${
                          student.decision === "promote"
                            ? "bg-teal text-white shadow-xs"
                            : "border border-line bg-surface text-navy-muted hover:text-navy"
                        }`}
                      >
                        Promote
                      </button>
                      <button
                        onClick={() => handleDecision(student.id, "detain")}
                        className={`px-3 py-1 rounded-control text-xs font-semibold transition ${
                          student.decision === "detain"
                            ? "bg-amber-700 text-white shadow-xs"
                            : "border border-line bg-surface text-navy-muted hover:text-navy"
                        }`}
                      >
                        Detain
                      </button>
                      <button
                        onClick={() => handleDecision(student.id, "leave")}
                        className={`px-3 py-1 rounded-control text-xs font-semibold transition ${
                          student.decision === "leave"
                            ? "bg-slate-700 text-white shadow-xs"
                            : "border border-line bg-surface text-navy-muted hover:text-navy"
                        }`}
                      >
                        Leave
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Warning & Confirm */}
        <div className="p-4 border-t border-line flex flex-wrap items-center justify-between gap-4 bg-page/30">
          <p className="text-xs text-navy-muted max-w-2xl leading-relaxed">
            Confirming automatically generates 2027-28 enrollments, new roll numbers, and annual fee plans. Unpaid dues carry forward into the next ledger. Can be reverted prior to first attendance of new session.
          </p>
          <button
            onClick={handleConfirm}
            className="flex items-center gap-2 px-5 py-2.5 rounded-control bg-teal hover:bg-teal-hover text-white text-xs font-bold shadow-sm transition"
          >
            <FiCheckCircle size={15} /> Confirm Decisions for {students.length} Students
          </button>
        </div>
      </div>
    </div>
  );
}
