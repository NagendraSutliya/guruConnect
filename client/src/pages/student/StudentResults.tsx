import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { FiDownload, FiAward, FiCheckCircle, FiFileText } from "react-icons/fi";

const StudentResults: React.FC = () => {
  const { showToast } = useToast();
  const [selectedTerm, setSelectedTerm] = useState("term1");

  const subjectResults = [
    { name: "English", max: 100, marks: 91, pct: 91, grade: "A1", remark: "Fluent and expressive" },
    { name: "Hindi", max: 100, marks: 88, pct: 88, grade: "A2", remark: "Good grammar and vocabulary" },
    { name: "Maths", max: 100, marks: 95, pct: 95, grade: "A1", remark: "High conceptual clarity" },
    { name: "Science", max: 100, marks: 96, pct: 96, grade: "A1", remark: "Excellent understanding" },
    { name: "Social science", max: 100, marks: 89, pct: 89, grade: "A2", remark: "Thorough map and history recall" },
    { name: "Sanskrit", max: 100, marks: 94, pct: 94, grade: "A1", remark: "Good grasp of grammar" },
  ];

  const handleDownload = () => {
    showToast("Generating official Term 1 digital report card PDF...", "info");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn font-sans text-ink">
      {/* Top Header & Term Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-small text-ink-secondary">Examinations · Class 8-B</div>
          <h1 className="text-title font-semibold text-ink m-0">Results & Report Card</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-surface-subtle p-1 rounded-control border border-line">
            <button
              type="button"
              onClick={() => setSelectedTerm("term1")}
              className={`px-4 py-2 rounded-control text-small font-semibold transition-all cursor-pointer ${
                selectedTerm === "term1"
                  ? "bg-surface text-ink shadow-2xs"
                  : "text-ink-secondary hover:text-ink"
              }`}
            >
              Term 1 (Published)
            </button>
            <button
              type="button"
              onClick={() => showToast("Half-Yearly examination results will be published after November evaluations.", "info")}
              className="px-4 py-2 rounded-control text-small font-semibold text-ink-muted cursor-not-allowed"
            >
              Half-Yearly · after Nov
            </button>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            className="px-4 py-2 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-small transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <FiDownload size={15} /> Download Report Card
          </button>
        </div>
      </div>

      {/* 3 Summary Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-line rounded-card p-5 flex flex-col gap-1 shadow-2xs">
          <span className="text-small text-ink-secondary">Overall Aggregate</span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-primary">92.4%</span>
            <span className="text-caption text-ink-secondary">/ 100%</span>
          </div>
          <span className="text-caption text-emerald-700 font-semibold mt-1">
            Top academic distinction band
          </span>
        </div>

        <div className="bg-surface border border-line rounded-card p-5 flex flex-col gap-1 shadow-2xs">
          <span className="text-small text-ink-secondary">Overall Final Grade</span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-primary">A1</span>
            <span className="text-caption text-ink-secondary">CBSE Grading Scale</span>
          </div>
          <span className="text-caption text-ink-secondary mt-1">
            Outstanding performance
          </span>
        </div>

        <div className="bg-surface border border-line rounded-card p-5 flex flex-col gap-1 shadow-2xs">
          <span className="text-small text-ink-secondary">Term Attendance</span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-primary">98%</span>
            <span className="text-caption text-ink-secondary">Present</span>
          </div>
          <span className="text-caption text-emerald-700 font-semibold mt-1">
            Only 2 days absent this session
          </span>
        </div>
      </div>

      {/* Subject Performance Breakdown Table */}
      <div className="bg-surface border border-line rounded-card overflow-hidden shadow-2xs">
        <div className="px-6 py-4 border-b border-line-row bg-surface-subtle/50 flex items-center justify-between">
          <span className="text-body font-semibold text-ink">
            Subject-wise Marks & Evaluation
          </span>
          <span className="text-caption text-ink-secondary font-mono">
            Total: 553 / 600
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line-row text-caption text-ink-secondary bg-surface-subtle/20">
                <th className="py-3 px-6 font-semibold">Subject</th>
                <th className="py-3 px-6 font-semibold">Max</th>
                <th className="py-3 px-6 font-semibold">Obtained</th>
                <th className="py-3 px-6 font-semibold w-1/3">Visual Progress</th>
                <th className="py-3 px-6 font-semibold">Grade</th>
                <th className="py-3 px-6 font-semibold">Teacher Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-row text-small">
              {subjectResults.map((sub, idx) => (
                <tr key={idx} className="hover:bg-surface-subtle/60 transition-colors">
                  <td className="py-4 px-6 font-semibold text-ink">
                    {sub.name}
                  </td>
                  <td className="py-4 px-6 font-mono text-ink-secondary">
                    {sub.max}
                  </td>
                  <td className="py-4 px-6 font-mono font-semibold text-ink">
                    {sub.marks}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-surface-subtle rounded-full overflow-hidden border border-line-row">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-700"
                          style={{ width: `${sub.pct}%` }}
                        />
                      </div>
                      <span className="font-mono text-caption text-ink-secondary w-8 text-right">
                        {sub.pct}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-primary">
                    {sub.grade}
                  </td>
                  <td className="py-4 px-6 text-ink-secondary text-caption">
                    {sub.remark}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Class Teacher's Remark Card */}
      <div className="bg-surface border border-line rounded-card p-6 shadow-2xs flex flex-col gap-2">
        <div className="flex items-center gap-2 text-primary font-semibold text-small">
          <FiAward size={18} />
          <span>Class Teacher's Final Appraisal · Sunita Rathore</span>
        </div>
        <p className="text-body text-ink leading-relaxed m-0 italic bg-surface-subtle p-4 rounded-control border border-line">
          "Excellent understanding and very neat work. Charu exhibits consistent curiosity and discipline in both academics and classroom discussions. Keep reading beyond the textbook."
        </p>
      </div>

      {/* DPDP Compliance Notice */}
      <div className="text-caption text-ink-secondary text-center px-4 leading-relaxed">
        Published official results under school evaluation framework. In compliance with DPDP safety rules, ranks and fees are withheld from student view.
      </div>
    </div>
  );
};

export default StudentResults;
