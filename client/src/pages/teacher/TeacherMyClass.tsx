import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { FiMessageSquare, FiAlertCircle, FiSend } from "react-icons/fi";

interface StudentRecord {
  roll: string;
  name: string;
  attendancePct: number;
  homeworkPct: number;
  latestResult: string;
  guardianName: string;
  guardianRelation: string;
  notes?: string;
  healthAlert?: string;
}

const DEFAULT_STUDENTS: StudentRecord[] = [
  { roll: "01", name: "Aditi Sharma", attendancePct: 96, homeworkPct: 100, latestResult: "Term 1 · A2", guardianName: "Sanjay Sharma", guardianRelation: "Father" },
  { roll: "02", name: "Bhavesh Kumar", attendancePct: 92, homeworkPct: 92, latestResult: "Term 1 · B1", guardianName: "Rajesh Kumar", guardianRelation: "Father" },
  { roll: "03", name: "Charu Mehta", attendancePct: 98, homeworkPct: 100, latestResult: "Term 1 · A1", guardianName: "Sunil Mehta", guardianRelation: "Father" },
  { roll: "04", name: "Dev Saini", attendancePct: 71, homeworkPct: 60, latestResult: "Term 1 · C2", guardianName: "Kamlesh & Kusum Saini", guardianRelation: "Parents", notes: "Absent 3 days in a row with fever" },
  { roll: "05", name: "Esha Gupta", attendancePct: 90, homeworkPct: 88, latestResult: "Term 1 · B1", guardianName: "Manoj Gupta", guardianRelation: "Father" },
  { roll: "06", name: "Faizan Ali", attendancePct: 95, homeworkPct: 96, latestResult: "Term 1 · A2", guardianName: "Imran Ali", guardianRelation: "Father" },
  { roll: "07", name: "Garima Joshi", attendancePct: 88, homeworkPct: 80, latestResult: "Term 1 · C1", guardianName: "Mukesh Joshi", guardianRelation: "Father" },
  { roll: "08", name: "Hitesh Yadav", attendancePct: 93, homeworkPct: 90, latestResult: "Term 1 · B2", guardianName: "Dinesh Yadav", guardianRelation: "Father" },
  { roll: "09", name: "Isha Kanwar", attendancePct: 97, homeworkPct: 100, latestResult: "Term 1 · A1", guardianName: "Vikram Kanwar", guardianRelation: "Father" },
  { roll: "10", name: "Jatin Soni", attendancePct: 85, homeworkPct: 76, latestResult: "Term 1 · C2", guardianName: "Vijay Soni", guardianRelation: "Father" },
  { roll: "11", name: "Kriti Bansal", attendancePct: 94, homeworkPct: 95, latestResult: "Term 1 · B1", guardianName: "Ramesh Bansal", guardianRelation: "Father" },
  { roll: "12", name: "Lakshay Jain", attendancePct: 91, homeworkPct: 89, latestResult: "Term 1 · A2", guardianName: "Praveen Jain", guardianRelation: "Father" },
];

interface LeaveRequest {
  id: string;
  student: string;
  dates: string;
  reason: string;
  hasDoc: boolean;
}

const TeacherMyClass: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [students] = useState<StudentRecord[]>(DEFAULT_STUDENTS);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    { id: "lr1", student: "Isha Kanwar", dates: "14–15 Oct", reason: "fever", hasDoc: true },
    { id: "lr2", student: "Kriti Bansal", dates: "20 Oct", reason: "family function", hasDoc: false },
  ]);
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeText, setNoticeText] = useState("");

  const handleApproveLeave = (id: string, name: string) => {
    setLeaveRequests((prev) => prev.filter((r) => r.id !== id));
    showToast(`Leave approved for ${name}. Attendance updated as Leave.`, "success");
  };

  const handleRejectLeave = (id: string, name: string) => {
    setLeaveRequests((prev) => prev.filter((r) => r.id !== id));
    showToast(`Leave request rejected for ${name}`, "info");
  };

  const handleSendNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeText.trim()) return;
    showToast("Class notice broadcasted to parents of 8-B", "success");
    setNoticeText("");
    setShowNoticeModal(false);
  };

  return (
    <div className="flex flex-col gap-5 w-full animate-fadeIn font-sans">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="m-0 text-title font-semibold tracking-tight text-ink">
            My class · 8-B
          </h1>
          <span className="text-body text-ink-secondary">
            38 students · class teacher Sunita Rathore · Room 21
          </span>
        </div>

        <button
          onClick={() => setShowNoticeModal(true)}
          className="min-h-[44px] px-4 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-ink font-medium text-body transition-colors shadow-2xs"
        >
          Send class notice
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface border border-line rounded-card p-3.5 flex flex-col gap-1">
          <span className="text-micro font-medium text-ink-secondary">Today's attendance</span>
          <span className="font-mono text-xl font-medium text-ink">94.7%</span>
        </div>
        <div className="bg-surface border border-line rounded-card p-3.5 flex flex-col gap-1">
          <span className="text-micro font-medium text-ink-secondary">Below 75% this term</span>
          <span className="font-mono text-xl font-medium text-warning-inline font-bold">1</span>
        </div>
        <div className="bg-surface border border-line rounded-card p-3.5 flex flex-col gap-1">
          <span className="text-micro font-medium text-ink-secondary">Homework done (week)</span>
          <span className="font-mono text-xl font-medium text-ink">91%</span>
        </div>
        <div className="bg-surface border border-line rounded-card p-3.5 flex flex-col gap-1">
          <span className="text-micro font-medium text-ink-secondary">Remarks submitted</span>
          <span className="font-mono text-xl font-medium text-ink">26 / 38</span>
        </div>
      </div>

      {/* Main Grid: Student Table & Aside */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (span 8): Table */}
        <section className="lg:col-span-8 bg-surface border border-line rounded-card overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-body min-w-[640px]">
              <thead>
                <tr className="bg-surface-head text-ink-secondary font-semibold text-small">
                  <th className="py-3 px-4 text-right w-14">Roll</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4 text-right">Attendance</th>
                  <th className="py-3 px-4 text-right">Homework</th>
                  <th className="py-3 px-4">Latest result</th>
                  <th className="py-3 px-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-row">
                {students.map((s) => (
                  <tr
                    key={s.roll}
                    className="hover:bg-surface-subtle transition-colors cursor-pointer group"
                    onClick={() => setSelectedStudent(s)}
                  >
                    <td className="py-2.5 px-4 text-right font-mono text-ink-secondary text-small">
                      {s.roll}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-ink group-hover:text-primary transition-colors">
                      {s.name}
                    </td>
                    <td
                      className={`py-2.5 px-4 text-right font-mono text-small ${
                        s.attendancePct < 75 ? "text-warning-inline font-bold" : "text-ink"
                      }`}
                    >
                      {s.attendancePct}%
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-small text-ink">
                      {s.homeworkPct}%
                    </td>
                    <td className="py-2.5 px-4 text-small text-ink-secondary">
                      {s.latestResult}
                    </td>
                    <td
                      className="py-2.5 px-4 text-right"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/teacher/messages");
                      }}
                    >
                      <button className="text-small font-medium text-primary hover:underline inline-flex items-center gap-1">
                        Message parent
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right Column (span 4): Aside Cards */}
        <aside className="lg:col-span-4 flex flex-col gap-4">
          {/* Leave Requests from Parents */}
          <section className="bg-surface border border-line rounded-card p-4 flex flex-col gap-3">
            <h2 className="m-0 text-h2 font-semibold text-ink">
              Leave requests from parents
            </h2>

            {leaveRequests.length === 0 ? (
              <p className="text-small text-ink-secondary m-0 py-2">
                No pending leave requests.
              </p>
            ) : (
              <div className="divide-y divide-line-row">
                {leaveRequests.map((lr) => (
                  <div key={lr.id} className="py-3 flex flex-col gap-2">
                    <div className="flex flex-col">
                      <span className="text-body font-semibold text-ink">{lr.student}</span>
                      <span className="text-small text-ink-secondary">
                        {lr.dates} · {lr.reason} {lr.hasDoc && "· doctor note attached"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveLeave(lr.id, lr.student)}
                        className="px-3 py-1.5 rounded-control bg-primary text-white text-small font-semibold hover:bg-primary-dark transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectLeave(lr.id, lr.student)}
                        className="px-3 py-1.5 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-small font-medium text-ink transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Needs Attention Alert */}
          <section className="bg-warning-bg border border-warning-border rounded-card p-4 flex flex-col gap-1.5">
            <h2 className="m-0 text-h2 font-semibold text-warning-strong flex items-center gap-1.5">
              <FiAlertCircle size={16} /> Needs attention
            </h2>
            <p className="text-small text-warning-strong leading-relaxed m-0">
              Dev Saini: attendance 71% this term, absent 3 days in a row. Talk to the parents or tell the principal.
            </p>
          </section>
        </aside>
      </div>

      {/* Student Card Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn">
          <div className="bg-surface border border-line rounded-card p-6 max-w-md w-full shadow-xl flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-tint text-primary-dark font-bold text-lg flex items-center justify-center border border-primary/20">
                  {selectedStudent.name[0]}
                </div>
                <div>
                  <h3 className="text-h2 font-semibold text-ink m-0">
                    {selectedStudent.name}
                  </h3>
                  <span className="text-caption text-ink-secondary">
                    Class 8-B · Roll {selectedStudent.roll}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-ink-secondary hover:text-ink text-body font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 py-2 border-y border-line-row">
              <div className="flex flex-col">
                <span className="text-micro text-ink-secondary">Attendance (Term)</span>
                <span
                  className={`text-body font-mono font-semibold ${
                    selectedStudent.attendancePct < 75 ? "text-warning-inline" : "text-ink"
                  }`}
                >
                  {selectedStudent.attendancePct}%
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-micro text-ink-secondary">Homework Done</span>
                <span className="text-body font-mono font-semibold text-ink">
                  {selectedStudent.homeworkPct}%
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-micro text-ink-secondary">Latest Result</span>
                <span className="text-body font-semibold text-ink">
                  {selectedStudent.latestResult}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-micro text-ink-secondary">Guardian</span>
                <span className="text-body font-semibold text-ink">
                  {selectedStudent.guardianName}
                </span>
              </div>
            </div>

            {selectedStudent.notes && (
              <div className="p-3 bg-surface-head rounded-control text-small text-ink">
                <strong>Teacher Notes:</strong> {selectedStudent.notes}
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  setSelectedStudent(null);
                  navigate("/teacher/messages");
                }}
                className="px-4 py-2 rounded-control bg-primary text-white text-small font-semibold hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
              >
                <FiMessageSquare size={14} /> Message Parent
              </button>
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-control border border-line-input bg-surface text-small font-medium text-ink hover:bg-surface-subtle transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Class Notice Modal */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn">
          <form
            onSubmit={handleSendNotice}
            className="bg-surface border border-line rounded-card p-6 max-w-lg w-full shadow-xl flex flex-col gap-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-h2 font-semibold text-ink m-0">
                  Send Class Notice · 8-B
                </h3>
                <span className="text-small text-ink-secondary">
                  Notice will be delivered instantly to parents of all 38 students.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowNoticeModal(false)}
                className="text-ink-secondary hover:text-ink text-body font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <textarea
              rows={4}
              required
              value={noticeText}
              onChange={(e) => setNoticeText(e.target.value)}
              placeholder="e.g. Please bring the science project materials tomorrow for the lab session."
              className="w-full p-3 rounded-control border border-line-input bg-surface text-body text-ink placeholder:text-ink-secondary focus:border-primary focus:outline-none"
            />

            <div className="flex justify-end gap-2.5 pt-2 border-t border-line-row">
              <button
                type="button"
                onClick={() => setShowNoticeModal(false)}
                className="px-4 py-2 rounded-control border border-line-input bg-surface text-small font-medium text-ink hover:bg-surface-subtle transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-control bg-primary text-white text-small font-semibold hover:bg-primary-dark transition-colors inline-flex items-center gap-1.5"
              >
                <FiSend size={14} /> Send Notice
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeacherMyClass;
