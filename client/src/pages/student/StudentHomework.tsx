import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { 
  FiBookOpen, 
  FiClock, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiPlus, 
  FiX, 
  FiUploadCloud, 
  FiFileText 
} from "react-icons/fi";

interface HomeworkItem {
  id: string;
  subject: string;
  title: string;
  teacher: string;
  method: string;
  dueDate: string;
  status: "To do" | "Submitted" | "Checked" | "Redo";
  group: "tomorrow" | "thisWeek" | "checked";
  remark?: string;
  description?: string;
}

const DEFAULT_HOMEWORK: HomeworkItem[] = [
  {
    id: "hw1",
    subject: "Science",
    title: "Ch. 6 Combustion — questions 1–5",
    teacher: "Sunita Rathore",
    method: "photo in app",
    dueDate: "Wed 14 Oct",
    status: "To do",
    group: "tomorrow",
    description: "Answer questions 1 to 5 from the chapter end exercise in your homework notebook. Make sure diagrams of zones of a flame are labelled neatly. Upload clear photos of each page.",
  },
  {
    id: "hw2",
    subject: "Maths",
    title: "Ex. 7.2 all questions",
    teacher: "Ravi Kumar",
    method: "notebook",
    dueDate: "Wed 14 Oct",
    status: "Submitted",
    group: "tomorrow",
    description: "Solve Exercise 7.2 questions 1 through 10 on linear algebraic equations. Bring notebook tomorrow for verification.",
  },
  {
    id: "hw3",
    subject: "English",
    title: "Essay: my favourite festival (150 words)",
    teacher: "Meenakshi Rao",
    method: "due Fri 16 Oct",
    dueDate: "Fri 16 Oct",
    status: "To do",
    group: "thisWeek",
    description: "Write an essay of 150 words in your English notebook highlighting traditions, food, and cultural significance. Check spellings and paragraph transitions.",
  },
  {
    id: "hw4",
    subject: "Hindi",
    title: "पत्र लेखन — मित्र को पत्र",
    teacher: "Kamla Devi",
    method: "notebook",
    dueDate: "10 Oct",
    status: "Checked",
    group: "checked",
    remark: "Neat work. Good vocabulary used in paragraph 2.",
    description: "अपने मित्र को ग्रीष्मावकाश में अपने गाँव आने का निमंत्रण देते हुए एक पत्र लिखिए।",
  },
  {
    id: "hw5",
    subject: "Social science",
    title: "Map work: rivers of India",
    teacher: "Rakesh Meena",
    method: "map sheet",
    dueDate: "10 Oct",
    status: "Redo",
    group: "checked",
    remark: "Label the Godavari and Krishna delta clearly again.",
    description: "On an outline map of India, locate and label the major Himalayan and Peninsular rivers.",
  },
];

const StudentHomework: React.FC = () => {
  const { showToast } = useToast();
  const [homeworkList, setHomeworkList] = useState<HomeworkItem[]>(DEFAULT_HOMEWORK);
  const [selectedHomework, setSelectedHomework] = useState<HomeworkItem>(DEFAULT_HOMEWORK[0]);
  const [activeFilter, setActiveFilter] = useState<"all" | "todo" | "submitted" | "checked">("all");
  const [photos, setPhotos] = useState<string[]>(["Page 1", "Page 2"]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredList = homeworkList.filter((item) => {
    if (activeFilter === "todo") return item.status === "To do" || item.status === "Redo";
    if (activeFilter === "submitted") return item.status === "Submitted";
    if (activeFilter === "checked") return item.status === "Checked" || item.status === "Redo";
    return true;
  });

  const getStatusBadge = (status: HomeworkItem["status"]) => {
    switch (status) {
      case "To do":
        return "bg-[#FFF6EC] text-[#7A4106] border border-[#EBC99C]/60";
      case "Submitted":
        return "bg-[#E3EFEF] text-[#08393F] border border-[#C5DEDD]";
      case "Checked":
        return "bg-[#E4F1E8] text-[#1E5A33] border border-[#BCE1C7]";
      case "Redo":
        return "bg-[#F1EEE6] text-[#5A4A24] border border-[#D5CDB8]";
      default:
        return "bg-surface-subtle text-ink-secondary";
    }
  };

  const handleAddPhoto = () => {
    if (photos.length >= 5) {
      showToast("Maximum 5 photos allowed per submission.", "error");
      return;
    }
    const nextNum = photos.length + 1;
    setPhotos([...photos, `Page ${nextNum}`]);
    showToast(`Added Page ${nextNum} image slot.`, "info");
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotos(photos.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (photos.length === 0) {
      showToast("Please upload at least 1 photo of your completed homework.", "error");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setHomeworkList((prev) =>
        prev.map((item) =>
          item.id === selectedHomework.id ? { ...item, status: "Submitted" } : item
        )
      );
      setSelectedHomework((prev) => ({ ...prev, status: "Submitted" }));
      showToast("Homework photos submitted successfully at 7:40 pm!", "success");
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn font-sans text-ink">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-small text-ink-secondary">Academics · Class 8-B</div>
          <h1 className="text-title font-semibold text-ink m-0">Homework & Submissions</h1>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-surface-subtle p-1 rounded-control border border-line overflow-x-auto">
          {[
            { id: "all", label: "All (5)" },
            { id: "todo", label: "To do (3)" },
            { id: "submitted", label: "Submitted (1)" },
            { id: "checked", label: "Checked (2)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-control text-small font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === tab.id
                  ? "bg-surface text-ink shadow-2xs"
                  : "text-ink-secondary hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Desktop Web Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Homework List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {filteredList.map((hw) => {
            const isSelected = selectedHomework.id === hw.id;
            return (
              <div
                key={hw.id}
                onClick={() => setSelectedHomework(hw)}
                className={`p-4 rounded-card border transition-all cursor-pointer text-left shadow-2xs ${
                  isSelected
                    ? "bg-surface border-primary ring-2 ring-primary/10"
                    : "bg-surface border-line hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-small font-semibold text-ink">
                    {hw.subject}
                  </span>
                  <span className={`text-caption font-semibold px-2.5 py-0.5 rounded-full ${getStatusBadge(hw.status)}`}>
                    {hw.status}
                  </span>
                </div>

                <div className="text-body font-semibold text-ink line-clamp-1 mb-1">
                  {hw.title}
                </div>

                <div className="flex items-center justify-between text-caption text-ink-secondary pt-2 border-t border-line-row">
                  <span>Due {hw.dueDate}</span>
                  <span>{hw.teacher}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Workspace & Submission Area (7 cols) */}
        <div className="lg:col-span-7 bg-surface border border-line rounded-card p-6 shadow-2xs flex flex-col gap-5">
          {/* Header Info */}
          <div className="flex flex-col gap-2 pb-4 border-b border-line-row">
            <div className="flex items-center justify-between">
              <span className="text-caption font-semibold text-primary uppercase tracking-wider">
                {selectedHomework.subject} · {selectedHomework.teacher}
              </span>
              <span className={`text-caption font-semibold px-3 py-1 rounded-full ${getStatusBadge(selectedHomework.status)}`}>
                {selectedHomework.status}
              </span>
            </div>

            <h2 className="text-title font-semibold text-ink m-0">
              {selectedHomework.title}
            </h2>

            <div className="flex items-center gap-4 text-small text-ink-secondary">
              <span className="flex items-center gap-1.5">
                <FiClock size={14} /> Due Date: <strong className="text-ink">{selectedHomework.dueDate}</strong>
              </span>
              <span>Method: {selectedHomework.method}</span>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <span className="text-small font-semibold text-ink">Task Instructions</span>
            <p className="text-small text-ink-secondary leading-relaxed bg-surface-subtle p-4 rounded-control border border-line m-0">
              {selectedHomework.description || "Complete the exercises neatly in your notebook."}
            </p>
          </div>

          {/* Teacher Remark Banner (if checked / redo) */}
          {selectedHomework.remark && (
            <div className={`p-4 rounded-control border flex items-start gap-3 ${
              selectedHomework.status === "Redo"
                ? "bg-amber-50/70 border-amber-200 text-amber-900"
                : "bg-emerald-50/70 border-emerald-200 text-emerald-900"
            }`}>
              <FiCheckCircle size={18} className="mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-small font-semibold">Teacher's Feedback</span>
                <span className="text-caption mt-0.5">{selectedHomework.remark}</span>
              </div>
            </div>
          )}

          {/* Photos Upload & Submission Section */}
          <div className="flex flex-col gap-3 pt-2 border-t border-line-row">
            <div className="flex items-center justify-between">
              <span className="text-small font-semibold text-ink">
                Submission Photos (Up to 5 images or PDF)
              </span>
              <span className="text-caption text-ink-secondary">
                {photos.length} of 5 added
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {photos.map((label, idx) => (
                <div
                  key={idx}
                  className="aspect-[3/4] rounded-control bg-surface-subtle border border-line flex flex-col justify-between p-3 relative group"
                >
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="self-end p-1 rounded-full bg-white hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer border border-line"
                    title="Remove"
                  >
                    <FiX size={12} />
                  </button>
                  <div className="flex flex-col items-center justify-center my-auto text-ink-secondary">
                    <FiFileText size={24} className="text-primary/70 mb-1" />
                    <span className="text-caption font-semibold">{label}</span>
                  </div>
                </div>
              ))}

              {photos.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="aspect-[3/4] rounded-control border border-dashed border-line hover:border-primary/60 bg-surface hover:bg-surface-subtle transition-colors flex flex-col items-center justify-center gap-1.5 text-small font-semibold text-ink-secondary hover:text-primary cursor-pointer"
                >
                  <FiPlus size={20} />
                  <span>Add photo</span>
                </button>
              )}
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="text-caption text-ink-secondary">
                {selectedHomework.status === "Submitted"
                  ? "✓ Submitted. You can replace photos until the due date."
                  : "Photos queue and upload automatically when online."}
              </span>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-small transition-all active:scale-98 cursor-pointer disabled:opacity-60 shadow-2xs"
              >
                {isSubmitting
                  ? "Submitting..."
                  : selectedHomework.status === "Submitted"
                  ? "Update Submission"
                  : `Submit ${photos.length} Photos`}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentHomework;
