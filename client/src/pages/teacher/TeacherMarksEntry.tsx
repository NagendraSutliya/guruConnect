import React, { useState, useMemo } from "react";
import { useToast } from "../../context/ToastContext";
import { FiAlertTriangle, FiUpload, FiCheck, FiBookOpen } from "react-icons/fi";

interface StudentMark {
  roll: string;
  name: string;
  pt: string; // Periodic Test /10
  nb: string; // Notebook /5
  se: string; // Subject Enrichment /5
  hy: string; // Half-Yearly /80
}

interface StudentRemark {
  roll: string;
  name: string;
  band: string;
  remark: string;
  art: string;
  pe: string;
  discipline: string;
}

const INITIAL_MARKS: StudentMark[] = [
  { roll: "01", name: "Aditi Sharma", pt: "9", nb: "5", se: "4", hy: "71" },
  { roll: "02", name: "Bhavesh Kumar", pt: "8", nb: "4", se: "4", hy: "62" },
  { roll: "03", name: "Charu Mehta", pt: "10", nb: "5", se: "5", hy: "76" },
  { roll: "04", name: "Dev Saini", pt: "AB", nb: "3", se: "4", hy: "48" },
  { roll: "05", name: "Esha Gupta", pt: "7", nb: "4", se: "3", hy: "55" },
  { roll: "06", name: "Faizan Ali", pt: "9", nb: "5", se: "5", hy: "84" }, // Error: > 80
  { roll: "07", name: "Garima Joshi", pt: "6", nb: "3", se: "4", hy: "39" },
  { roll: "08", name: "Hitesh Yadav", pt: "8", nb: "4", se: "4", hy: "ML" },
  { roll: "09", name: "Isha Kanwar", pt: "10", nb: "5", se: "5", hy: "79" },
  { roll: "10", name: "Jatin Soni", pt: "5", nb: "3", se: "3", hy: "22" },
];

const INITIAL_REMARKS: StudentRemark[] = [
  {
    roll: "01",
    name: "Aditi Sharma",
    band: "Band A2",
    remark: "Aditi is attentive and asks good questions. She should practise diagrams for neater answers.",
    art: "A",
    pe: "A",
    discipline: "A",
  },
  {
    roll: "02",
    name: "Bhavesh Kumar",
    band: "Band B2",
    remark: "Bhavesh works steadily. Regular revision of science terms will improve his scores.",
    art: "B",
    pe: "A",
    discipline: "B",
  },
  {
    roll: "03",
    name: "Charu Mehta",
    band: "Band A1",
    remark: "Excellent understanding and very neat work. Keep reading beyond the textbook.",
    art: "A",
    pe: "B",
    discipline: "A",
  },
  {
    roll: "04",
    name: "Dev Saini",
    band: "Band C2",
    remark: "",
    art: "—",
    pe: "—",
    discipline: "—",
  },
  {
    roll: "05",
    name: "Esha Gupta",
    band: "Band C1",
    remark: "Esha is improving. Daily homework and asking doubts in class will help.",
    art: "A",
    pe: "B",
    discipline: "A",
  },
];

const REMARK_BANK: Record<string, string[]> = {
  A1: [
    "Outstanding performance. Demonstrates deep understanding and intellectual curiosity.",
    "Excellent mastery of all topics. Very consistent and enthusiastic in class.",
  ],
  A2: [
    "Very good grasp of concepts. Regularly participates with thoughtful answers.",
    "Strong conceptual foundation. Minor attention to detail will help reach top honors.",
  ],
  B1: [
    "Good academic progress. Works diligently and completes all assigned work.",
    "Shows steady understanding. Needs slightly more practice in descriptive questions.",
  ],
  B2: [
    "Satisfactory performance. Regular revision and asking doubts will boost scores.",
    "Has good potential. Needs to be more consistent with homework submission.",
  ],
  C1: [
    "Shows steady improvement. Additional practice and structured study time needed.",
    "Capable of much better results. Focus in class and regular homework will help.",
  ],
  C2: [
    "Requires structured guidance and regular revision of fundamentals.",
    "Attendance and class participation need immediate attention to improve grades.",
  ],
};

const calculateGrade = (total: number): string => {
  if (total >= 91) return "A1";
  if (total >= 81) return "A2";
  if (total >= 71) return "B1";
  if (total >= 61) return "B2";
  if (total >= 51) return "C1";
  if (total >= 41) return "C2";
  if (total >= 33) return "D";
  return "E";
};

const TeacherMarksEntry: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"marks" | "remarks">("marks");
  const [selectedSection, setSelectedSection] = useState("8-B Science · Draft");
  const [marks, setMarks] = useState<StudentMark[]>(INITIAL_MARKS);
  const [remarks, setRemarks] = useState<StudentRemark[]>(INITIAL_REMARKS);

  // Check for validation errors (e.g. mark > max)
  const validationErrors = useMemo(() => {
    const errors: { roll: string; field: string; val: number; max: number }[] = [];
    marks.forEach((m) => {
      const ptVal = parseFloat(m.pt);
      if (!isNaN(ptVal) && ptVal > 10) errors.push({ roll: m.roll, field: "PT", val: ptVal, max: 10 });
      const nbVal = parseFloat(m.nb);
      if (!isNaN(nbVal) && nbVal > 5) errors.push({ roll: m.roll, field: "NB", val: nbVal, max: 5 });
      const seVal = parseFloat(m.se);
      if (!isNaN(seVal) && seVal > 5) errors.push({ roll: m.roll, field: "SE", val: seVal, max: 5 });
      const hyVal = parseFloat(m.hy);
      if (!isNaN(hyVal) && hyVal > 80) errors.push({ roll: m.roll, field: "Half-Yearly", val: hyVal, max: 80 });
    });
    return errors;
  }, [marks]);

  const handleMarkChange = (roll: string, field: "pt" | "nb" | "se" | "hy", value: string) => {
    setMarks((prev) =>
      prev.map((m) => (m.roll === roll ? { ...m, [field]: value.toUpperCase() } : m))
    );
  };

  const handleRemarkChange = (roll: string, value: string) => {
    setRemarks((prev) =>
      prev.map((r) => (r.roll === roll ? { ...r, remark: value } : r))
    );
  };

  const handleApplyRemarkPreset = (roll: string, bandKey: string) => {
    const list = REMARK_BANK[bandKey] || REMARK_BANK["B1"];
    const chosen = list[0];
    handleRemarkChange(roll, chosen);
    showToast("Applied remark template", "info");
  };

  const handleImportExcel = () => {
    showToast("Excel template downloaded. Drop filled sheet here to import.", "info");
  };

  const handleSubmitMarks = () => {
    if (validationErrors.length > 0) {
      showToast("Cannot submit: Please fix values exceeding maximum marks.", "error");
      return;
    }
    showToast("Marks submitted for verification to Exam Coordinator", "success");
  };

  const handleSubmitRemarks = () => {
    showToast("Class teacher remarks successfully submitted", "success");
  };

  return (
    <div className="flex flex-col gap-5 w-full animate-fadeIn font-sans">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="m-0 text-title font-semibold tracking-tight text-ink">
          Marks and remarks
        </h1>
        <span className="text-body text-ink-secondary">
          Half-Yearly · Term 1 · only your classes and subjects
        </span>
      </div>

      {/* Tabs */}
      <div role="tablist" className="flex gap-2 border-b border-line">
        <button
          role="tab"
          aria-selected={activeTab === "marks"}
          onClick={() => setActiveTab("marks")}
          className={`min-h-[44px] px-4 font-semibold text-body border-b-2 transition-colors ${
            activeTab === "marks"
              ? "border-primary text-primary"
              : "border-transparent text-ink-secondary hover:text-ink font-normal"
          }`}
        >
          Marks entry
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "remarks"}
          onClick={() => setActiveTab("remarks")}
          className={`min-h-[44px] px-4 font-semibold text-body border-b-2 transition-colors ${
            activeTab === "remarks"
              ? "border-primary text-primary"
              : "border-transparent text-ink-secondary hover:text-ink font-normal"
          }`}
        >
          Remarks · class teacher
        </button>
      </div>

      {/* TAB 1: MARKS ENTRY */}
      {activeTab === "marks" && (
        <div className="flex flex-col gap-4">
          {/* Class Subject Pills */}
          <div className="flex gap-2 flex-wrap">
            {["8-B Science · Draft", "8-A Science · Submitted", "7-A Science · Submitted", "7-B Science · Submitted"].map(
              (sec) => (
                <button
                  key={sec}
                  onClick={() => setSelectedSection(sec)}
                  className={`text-caption font-semibold px-3 py-1.5 rounded-full transition-colors ${
                    selectedSection === sec
                      ? "bg-nav-bg text-white"
                      : "bg-surface-head text-ink-secondary hover:bg-line-input"
                  }`}
                >
                  {sec}
                </button>
              )
            )}
          </div>

          {/* Validation Notice Banner */}
          {validationErrors.length > 0 ? (
            <div className="bg-warning-bg border border-warning-border rounded-control p-3.5 text-body text-warning-strong flex items-center gap-2">
              <FiAlertTriangle className="text-warning-accent shrink-0" size={18} />
              <span>
                Science 8-B · Draft · autosaved 10:42 · {validationErrors.length} entry above maximum (Roll{" "}
                {validationErrors[0].roll} {validationErrors[0].field} {validationErrors[0].val} of {validationErrors[0].max}). Due tomorrow 5 pm.
              </span>
            </div>
          ) : (
            <div className="bg-success-bg border border-success-text/20 rounded-control p-3 text-small text-success-text flex items-center gap-2">
              <FiCheck className="text-success-text shrink-0" size={16} />
              <span>All mark entries are validated and autosaved. Ready for verification.</span>
            </div>
          )}

          {/* Gradebook Table */}
          <section className="bg-surface border border-line rounded-card overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-body min-w-[760px]">
                <thead>
                  <tr className="bg-surface-head text-ink-secondary font-semibold text-small">
                    <th className="py-3 px-4 w-14">Roll</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-3 w-20">PT /10</th>
                    <th className="py-3 px-3 w-20">NB /5</th>
                    <th className="py-3 px-3 w-20">SE /5</th>
                    <th className="py-3 px-3 w-24">HY /80</th>
                    <th className="py-3 px-4 text-right w-20">Total</th>
                    <th className="py-3 px-4 w-20">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-row">
                  {marks.map((m) => {
                    const hyVal = parseFloat(m.hy);
                    const isHyInvalid = !isNaN(hyVal) && hyVal > 80;

                    const ptNum = parseFloat(m.pt);
                    const nbNum = parseFloat(m.nb);
                    const seNum = parseFloat(m.se);
                    const hyNum = parseFloat(m.hy);

                    let totalStr = "—";
                    let gradeStr = "—";

                    if (!isHyInvalid) {
                      if (m.hy === "ML" || m.pt === "ML") {
                        totalStr = "ML";
                        gradeStr = "—";
                      } else {
                        const validPt = !isNaN(ptNum) ? ptNum : 0;
                        const validNb = !isNaN(nbNum) ? nbNum : 0;
                        const validSe = !isNaN(seNum) ? seNum : 0;
                        const validHy = !isNaN(hyNum) ? hyNum : 0;
                        const sum = validPt + validNb + validSe + validHy;
                        totalStr = sum.toString();
                        gradeStr = calculateGrade(sum);
                      }
                    }

                    return (
                      <tr key={m.roll} className="hover:bg-surface-subtle transition-colors">
                        <td className="py-2.5 px-4 font-mono text-ink-secondary text-small">
                          {m.roll}
                        </td>
                        <td className="py-2.5 px-4 font-medium text-ink">{m.name}</td>
                        <td className="py-2 px-3">
                          <input
                            aria-label={`PT for ${m.name}`}
                            value={m.pt}
                            onChange={(e) => handleMarkChange(m.roll, "pt", e.target.value)}
                            className="w-16 min-h-[36px] text-center rounded-small border border-line-input bg-surface font-mono text-body text-ink focus:border-primary focus:outline-none"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            aria-label={`NB for ${m.name}`}
                            value={m.nb}
                            onChange={(e) => handleMarkChange(m.roll, "nb", e.target.value)}
                            className="w-16 min-h-[36px] text-center rounded-small border border-line-input bg-surface font-mono text-body text-ink focus:border-primary focus:outline-none"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            aria-label={`SE for ${m.name}`}
                            value={m.se}
                            onChange={(e) => handleMarkChange(m.roll, "se", e.target.value)}
                            className="w-16 min-h-[36px] text-center rounded-small border border-line-input bg-surface font-mono text-body text-ink focus:border-primary focus:outline-none"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            aria-label={`HY for ${m.name}`}
                            value={m.hy}
                            onChange={(e) => handleMarkChange(m.roll, "hy", e.target.value)}
                            className={`w-16 min-h-[36px] text-center rounded-small font-mono text-body font-semibold transition-colors focus:outline-none ${
                              isHyInvalid
                                ? "border-2 border-warning-accent bg-warning-bg text-ink"
                                : "border border-line-input bg-surface text-ink focus:border-primary"
                            }`}
                          />
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-body font-medium text-ink">
                          {totalStr}
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="inline-block text-caption font-semibold px-2 py-0.5 rounded-full bg-primary-tint text-primary-dark">
                            {gradeStr}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end gap-3 p-4 bg-surface-subtle border-t border-line">
              <button
                onClick={handleImportExcel}
                className="min-h-[44px] px-4 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-ink font-medium text-body flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <FiUpload size={16} /> Import from Excel
              </button>
              <button
                onClick={handleSubmitMarks}
                disabled={validationErrors.length > 0}
                className="min-h-[44px] px-6 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-body transition-colors disabled:bg-primary-disabled disabled:cursor-not-allowed shadow-2xs"
              >
                Submit for verification
              </button>
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: REMARKS (CLASS TEACHER) */}
      {activeTab === "remarks" && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center gap-3 flex-wrap">
            <span className="text-body text-ink">
              8-B · Term 1 · <strong>26 of 38</strong> remarks done · due 16 Oct
            </span>
            <button
              onClick={handleSubmitRemarks}
              className="min-h-[44px] px-5 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-body transition-colors shadow-2xs"
            >
              Submit remarks
            </button>
          </div>

          <section className="bg-surface border border-line rounded-card overflow-hidden shadow-2xs">
            <div className="divide-y divide-line-row">
              {remarks.map((r) => (
                <div
                  key={r.roll}
                  className="grid grid-cols-1 md:grid-cols-[180px_1fr_220px] gap-3.5 items-start p-4 hover:bg-surface-subtle transition-colors"
                >
                  {/* Left: Student Name & Band */}
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-body text-ink">{r.name}</span>
                    <span className="text-caption text-ink-secondary">{r.band}</span>
                    <button
                      onClick={() => handleApplyRemarkPreset(r.roll, r.band.replace("Band ", ""))}
                      className="text-micro text-primary hover:underline font-semibold mt-1 inline-flex items-center gap-1 text-left"
                    >
                      <FiBookOpen size={12} /> Suggest remark
                    </button>
                  </div>

                  {/* Center: Remark Input */}
                  <textarea
                    rows={2}
                    value={r.remark}
                    placeholder="[Choose from the remark bank or write personal observation]"
                    onChange={(e) => handleRemarkChange(r.roll, e.target.value)}
                    className="p-2.5 rounded-control border border-line-input bg-surface text-small text-ink leading-relaxed focus:border-primary focus:outline-none resize-none"
                  />

                  {/* Right: Co-scholastic grades */}
                  <div className="flex gap-1.5 flex-wrap">
                    <span className="text-caption font-semibold px-2.5 py-1 rounded-full bg-surface-head text-ink">
                      Art {r.art}
                    </span>
                    <span className="text-caption font-semibold px-2.5 py-1 rounded-full bg-surface-head text-ink">
                      PE {r.pe}
                    </span>
                    <span className="text-caption font-semibold px-2.5 py-1 rounded-full bg-surface-head text-ink">
                      Discipline {r.discipline}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <span className="text-small text-ink-secondary">
            Pick from the remark bank for the student's performance band, then edit. Attendance is filled automatically.
          </span>
        </div>
      )}
    </div>
  );
};

export default TeacherMarksEntry;
