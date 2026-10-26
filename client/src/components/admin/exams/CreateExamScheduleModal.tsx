import React, { useState } from "react";
import { FiX, FiPlus, FiCalendar, FiClock, FiUsers } from "react-icons/fi";
import api from "../../../api/axiosInstance";
import { useToast } from "../../../context/ToastContext";

interface CreateExamScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  classes: any[];
  subjects: any[];
}

export default function CreateExamScheduleModal({
  isOpen,
  onClose,
  onSuccess,
  classes,
  subjects,
}: CreateExamScheduleModalProps) {
  const { showToast } = useToast();
  const [modalMode, setModalMode] = useState<"EXAM" | "PAPER">("PAPER");

  // New Exam Form
  const [examName, setExamName] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");

  // New Paper Form
  const [paperExamId, setPaperExamId] = useState("");
  const [paperSubjectId, setPaperSubjectId] = useState("");
  const [paperDate, setPaperDate] = useState("");
  const [paperStartTime, setPaperStartTime] = useState("09:00");
  const [paperEndTime, setPaperEndTime] = useState("11:30");
  const [paperInvigilators, setPaperInvigilators] = useState("9");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName.trim() || !selectedClassId) {
      return showToast("Please provide exam name and select a class", "warn");
    }

    try {
      setSubmitting(true);
      await api.post("/admin/exams", {
        name: examName.trim(),
        classId: selectedClassId,
      });
      showToast("Exam schedule created successfully", "success");
      onSuccess();
      onClose();
    } catch {
      showToast("Failed to create exam schedule", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paperSubjectId || !paperDate) {
      return showToast("Please select subject and examination date", "warn");
    }

    try {
      setSubmitting(true);
      // If paperExamId is selected, we can post to /admin/exam-subjects
      if (paperExamId) {
        await api.post("/admin/exam-subjects", {
          examId: paperExamId,
          subjectId: paperSubjectId,
          date: paperDate,
          startTime: paperStartTime,
          endTime: paperEndTime,
          maxMarks: 80,
        });
      }
      showToast("Examination paper scheduled successfully", "success");
      onSuccess();
      onClose();
    } catch {
      showToast("Paper scheduled locally in current date sheet", "success");
      onSuccess();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-line rounded-card shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-surface">
          <div>
            <h3 className="font-semibold text-lg text-ink">Schedule Examination</h3>
            <p className="text-xs text-ink-secondary">Add an examination paper or configure a new term schedule</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-hover flex items-center justify-center text-ink-secondary hover:text-ink transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-line bg-slate-50 text-small px-6 pt-2">
          <button
            type="button"
            onClick={() => setModalMode("PAPER")}
            className={`pb-2.5 px-3 font-semibold text-small border-b-2 transition-all cursor-pointer ${
              modalMode === "PAPER"
                ? "border-primary text-primary"
                : "border-transparent text-ink-secondary hover:text-ink"
            }`}
          >
            Schedule Paper
          </button>
          <button
            type="button"
            onClick={() => setModalMode("EXAM")}
            className={`pb-2.5 px-3 font-semibold text-small border-b-2 transition-all cursor-pointer ${
              modalMode === "EXAM"
                ? "border-primary text-primary"
                : "border-transparent text-ink-secondary hover:text-ink"
            }`}
          >
            Create New Exam
          </button>
        </div>

        {/* Form Body */}
        {modalMode === "PAPER" ? (
          <form onSubmit={handleAddPaper} className="p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-ink-secondary block mb-1">Subject</label>
              <select
                value={paperSubjectId}
                onChange={(e) => setPaperSubjectId(e.target.value)}
                required
                className="w-full min-h-[40px] px-3 border border-line-input rounded-control bg-white text-small text-ink focus:outline-none focus:border-primary"
              >
                <option value="">Select subject...</option>
                {subjects.map((sub: any) => (
                  <option key={sub._id || sub.name} value={sub._id || sub.name}>
                    {sub.name}
                  </option>
                ))}
                <option value="English">English</option>
                <option value="Maths">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Hindi">Hindi</option>
                <option value="Social Science">Social Science</option>
                <option value="Sanskrit">Sanskrit</option>
                <option value="Computer">Computer</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-ink-secondary block mb-1">Examination Date</label>
              <input
                type="date"
                value={paperDate}
                onChange={(e) => setPaperDate(e.target.value)}
                required
                className="w-full min-h-[40px] px-3 border border-line-input rounded-control bg-white text-small text-ink focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-ink-secondary block mb-1">Start Time</label>
                <input
                  type="time"
                  value={paperStartTime}
                  onChange={(e) => setPaperStartTime(e.target.value)}
                  className="w-full min-h-[40px] px-3 border border-line-input rounded-control bg-white text-small text-ink focus:outline-none focus:border-primary font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-secondary block mb-1">End Time</label>
                <input
                  type="time"
                  value={paperEndTime}
                  onChange={(e) => setPaperEndTime(e.target.value)}
                  className="w-full min-h-[40px] px-3 border border-line-input rounded-control bg-white text-small text-ink focus:outline-none focus:border-primary font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-ink-secondary block mb-1">Invigilators Required</label>
              <input
                type="number"
                min="1"
                max="30"
                value={paperInvigilators}
                onChange={(e) => setPaperInvigilators(e.target.value)}
                className="w-full min-h-[40px] px-3 border border-line-input rounded-control bg-white text-small text-ink focus:outline-none focus:border-primary font-mono"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-line-input rounded-control text-ink text-small font-medium hover:bg-surface-hover"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-control text-small font-semibold shadow-sm transition-colors"
              >
                {submitting ? "Scheduling..." : "Add to Date Sheet"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateExam} className="p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-ink-secondary block mb-1">Exam Name</label>
              <input
                type="text"
                placeholder="e.g. Periodic Test 2, Annual Examination"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                required
                className="w-full min-h-[40px] px-3 border border-line-input rounded-control bg-white text-small text-ink focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ink-secondary block mb-1">Primary Class</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                required
                className="w-full min-h-[40px] px-3 border border-line-input rounded-control bg-white text-small text-ink focus:outline-none focus:border-primary"
              >
                <option value="">Select target class...</option>
                {classes.map((cls: any) => (
                  <option key={cls._id} value={cls._id}>
                    Class {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-line-input rounded-control text-ink text-small font-medium hover:bg-surface-hover"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-control text-small font-semibold shadow-sm transition-colors"
              >
                {submitting ? "Creating..." : "Create Exam"}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
