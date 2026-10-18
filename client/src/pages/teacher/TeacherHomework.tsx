import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { FiPaperclip, FiBell } from "react-icons/fi";

interface HomeworkSubmission {
  student: string;
  detail: string;
  status: "Checked" | "Submitted" | "Not submitted" | "Redo";
}

const INITIAL_SUBMISSIONS: HomeworkSubmission[] = [
  { student: "Aanya Bhatt", detail: "Photo · 8 Oct 7:40 pm", status: "Checked" },
  { student: "Advik Sharma", detail: "Photo · 8 Oct 8:10 pm", status: "Submitted" },
  { student: "Arnav Saini", detail: "—", status: "Not submitted" },
  { student: "Diya Tak", detail: "Photo · 9 Oct 6:55 am", status: "Redo" },
  { student: "Harshita Jain", detail: "Photo · 8 Oct 9:02 pm", status: "Submitted" },
  { student: "Kabir Meena", detail: "—", status: "Not submitted" },
];

const SYLLABUS_PROGRESS = [
  { classSubject: "7-A Science", percent: 49, target: 55, isBehind: true },
  { classSubject: "7-B Science", percent: 47, target: 55, isBehind: true },
  { classSubject: "8-A Science", percent: 51, target: 55, isBehind: false },
  { classSubject: "8-B Science", percent: 52, target: 55, isBehind: false },
];

const TeacherHomework: React.FC = () => {
  const { showToast } = useToast();
  const [selectedClass, setSelectedClass] = useState("7-A Science");
  const [topic, setTopic] = useState("Ch. 6 Combustion and flame — zones of a flame");
  const [description, setDescription] = useState(
    "Draw and label the three zones of a candle flame. Answer Q 3 and Q 4."
  );
  const [dueDate, setDueDate] = useState("2026-10-15");
  const [submissionType, setSubmissionType] = useState("Photo in app");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [submissions] = useState<HomeworkSubmission[]>(INITIAL_SUBMISSIONS);

  const handlePostHomework = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Homework posted to ${selectedClass} (40 students). Goes in 4:00 pm daily diary.`, "success");
  };

  const handleRemindNotSubmitted = () => {
    showToast("Sent reminder push notification to 6 parents with pending submissions", "info");
  };

  const handleFileAttach = () => {
    setAttachment("Worksheet_Ch6_Flame.pdf");
    showToast("Attached Worksheet_Ch6_Flame.pdf", "info");
  };

  return (
    <div className="flex flex-col gap-5 w-full animate-fadeIn font-sans">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="m-0 text-title font-semibold tracking-tight text-ink">
          Homework and syllabus
        </h1>
        <span className="text-body text-ink-secondary">
          Homework goes to parents in the daily diary at 4:00 pm.
        </span>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (span 5): Post Homework Card */}
        <section className="lg:col-span-5 bg-surface border border-line rounded-card p-5 flex flex-col gap-4 shadow-2xs">
          <h2 className="m-0 text-h2 font-semibold text-ink">Post homework</h2>

          <form onSubmit={handlePostHomework} className="flex flex-col gap-3.5">
            <label className="flex flex-col gap-1.5 text-small font-semibold text-ink">
              <span>Classes</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="min-h-[44px] px-3 rounded-control border border-line-input bg-surface text-body text-ink focus:border-primary focus:outline-none"
              >
                <option value="7-A Science">7-A Science</option>
                <option value="7-B Science">7-B Science</option>
                <option value="8-A Science">8-A Science</option>
                <option value="8-B Science">8-B Science</option>
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-small font-semibold text-ink">
              <span>Topic</span>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="min-h-[44px] px-3 rounded-control border border-line-input bg-surface text-body text-ink focus:border-primary focus:outline-none"
              >
                <option value="Ch. 6 Combustion and flame — zones of a flame">
                  Ch. 6 Combustion and flame — zones of a flame
                </option>
                <option value="Ch. 5 Coal and Petroleum — distillation">
                  Ch. 5 Coal and Petroleum — distillation
                </option>
                <option value="Ch. 4 Materials: Metals and Non-Metals">
                  Ch. 4 Materials: Metals and Non-Metals
                </option>
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-small font-semibold text-ink">
              <span>What to do</span>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="p-3 rounded-control border border-line-input bg-surface text-body text-ink focus:border-primary focus:outline-none resize-none leading-relaxed"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5 text-small font-semibold text-ink">
                <span>Due</span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="min-h-[44px] px-3 rounded-control border border-line-input bg-surface text-body text-ink focus:border-primary focus:outline-none"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-small font-semibold text-ink">
                <span>Submission</span>
                <select
                  value={submissionType}
                  onChange={(e) => setSubmissionType(e.target.value)}
                  className="min-h-[44px] px-3 rounded-control border border-line-input bg-surface text-body text-ink focus:border-primary focus:outline-none"
                >
                  <option value="Photo in app">Photo in app</option>
                  <option value="Notebook only">Notebook only</option>
                </select>
              </label>
            </div>

            {attachment ? (
              <div className="p-2.5 bg-surface-subtle border border-line rounded-control text-small text-ink flex items-center justify-between">
                <span className="truncate">{attachment}</span>
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="text-ink-secondary hover:text-red-600 font-semibold text-caption ml-2"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleFileAttach}
                className="min-h-[44px] px-4 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-ink font-medium text-body flex items-center justify-center gap-2 transition-colors"
              >
                <FiPaperclip size={16} /> Attach PDF or image
              </button>
            )}

            <button
              type="submit"
              className="min-h-[46px] px-6 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-body transition-colors mt-1"
            >
              Post to {selectedClass.split(" ")[0]} (40 students)
            </button>
          </form>
        </section>

        {/* Right Column (span 7): Check Submissions & Syllabus Progress */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Check Submissions Card */}
          <section className="bg-surface border border-line rounded-card overflow-hidden shadow-2xs">
            <div className="p-3.5 px-5 border-b border-line-row flex justify-between items-center gap-3">
              <h2 className="m-0 text-h2 font-semibold text-ink">
                Check · 7-A · Ch. 5 Q1–8
              </h2>
              <button
                onClick={handleRemindNotSubmitted}
                className="min-h-[36px] px-3 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-ink font-medium text-small transition-colors flex items-center gap-1.5"
              >
                <FiBell size={14} /> Remind 6 not submitted
              </button>
            </div>

            <div className="divide-y divide-line-row">
              {submissions.map((sub, idx) => (
                <div
                  key={idx}
                  className="p-3 px-5 flex justify-between items-center gap-3 hover:bg-surface-subtle transition-colors"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-body font-medium text-ink truncate">
                      {sub.student}
                    </span>
                    <span className="text-caption text-ink-secondary truncate">
                      {sub.detail}
                    </span>
                  </div>

                  <div>
                    {sub.status === "Checked" && (
                      <span className="inline-block text-caption font-semibold px-2.5 py-1 rounded-full bg-success-bg text-success-text">
                        Checked
                      </span>
                    )}
                    {sub.status === "Submitted" && (
                      <span className="inline-block text-caption font-semibold px-2.5 py-1 rounded-full bg-primary-tint text-primary-dark">
                        Submitted
                      </span>
                    )}
                    {sub.status === "Not submitted" && (
                      <span className="inline-block text-caption font-semibold px-2.5 py-1 rounded-full bg-warning-bg text-warning-text">
                        Not submitted
                      </span>
                    )}
                    {sub.status === "Redo" && (
                      <span className="inline-block text-caption font-semibold px-2.5 py-1 rounded-full bg-tag-bg text-tag-text">
                        Redo
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Syllabus Done vs Planned Card */}
          <section className="bg-surface border border-line rounded-card p-5 flex flex-col gap-3 shadow-2xs">
            <h2 className="m-0 text-h2 font-semibold text-ink">
              Syllabus done vs planned
            </h2>

            <div className="flex flex-col gap-3.5 pt-1">
              {SYLLABUS_PROGRESS.map((s, idx) => (
                <div key={idx} className="grid grid-cols-[110px_1fr_48px] gap-3 items-center text-small">
                  <span className="font-semibold text-ink truncate">{s.classSubject}</span>

                  <div className="relative h-3 bg-line-row rounded-full overflow-visible">
                    <div
                      className={`h-full rounded-full transition-all ${
                        s.isBehind ? "bg-warning-chart" : "bg-primary"
                      }`}
                      style={{ width: `${s.percent}%` }}
                    />
                    {/* Planned target line */}
                    <div
                      className="absolute -top-1 -bottom-1 w-0.5 bg-ink"
                      style={{ left: `${s.target}%` }}
                      title={`Target: ${s.target}%`}
                    />
                  </div>

                  <span className="font-mono text-small text-ink text-right">
                    {s.percent}%
                  </span>
                </div>
              ))}
            </div>
            <span className="text-micro text-ink-secondary pt-1">
              Black marker indicates the expected syllabus target for mid-October (55%).
            </span>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TeacherHomework;
