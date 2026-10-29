import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { FiDownload, FiExternalLink, FiFileText, FiCheck, FiFolder, FiSearch } from "react-icons/fi";

interface StudyItem {
  id: string;
  type: "PDF" | "LINK";
  title: string;
  educator: string;
  date: string;
  size?: string;
  subject: string;
  saved?: boolean;
}

const STUDY_MATERIALS: StudyItem[] = [
  { id: "m1", type: "PDF", title: "Ch. 6 Combustion & Flame — Comprehensive Chapter Notes", educator: "Sunita Rathore", date: "12 Oct 2026", size: "1.2 MB", subject: "Science", saved: true },
  { id: "m2", type: "PDF", title: "Ch. 6 Practice Worksheet & Numerical Questions", educator: "Sunita Rathore", date: "12 Oct 2026", size: "340 KB", subject: "Science", saved: false },
  { id: "m3", type: "LINK", title: "Video Demonstration: Different Zones of a Candle Flame", educator: "Science Department", date: "09 Oct 2026", subject: "Science" },
  { id: "m4", type: "PDF", title: "Ch. 5 Coal and Petroleum — Revision Flashcards & Summary", educator: "Sunita Rathore", date: "28 Sep 2026", size: "860 KB", subject: "Science", saved: true },
  { id: "m5", type: "PDF", title: "Half-Yearly Examination Prescribed Syllabus & Blueprint", educator: "Academic Office", date: "28 Sep 2026", size: "450 KB", subject: "Science", saved: false },
  { id: "m6", type: "PDF", title: "Linear Equations in One Variable — Step-by-Step Solved Proofs", educator: "Ravi Kumar", date: "10 Oct 2026", size: "2.1 MB", subject: "Maths", saved: true },
  { id: "m7", type: "PDF", title: "Active and Passive Voice Rules with 50 Practice Exercises", educator: "Meenakshi Rao", date: "05 Oct 2026", size: "750 KB", subject: "English", saved: true },
  { id: "m8", type: "PDF", title: "पत्र लेखन प्रारूप एवं औपचारिक पत्र उदाहरण संग्रह", educator: "Kamla Devi", date: "03 Oct 2026", size: "620 KB", subject: "Hindi", saved: true },
  { id: "m9", type: "PDF", title: "Map Work Guide: River Systems and National Parks of India", educator: "Rakesh Meena", date: "01 Oct 2026", size: "3.4 MB", subject: "Social Science", saved: false },
];

const StudentMaterial: React.FC = () => {
  const { showToast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState("Science");
  const [search, setSearch] = useState("");
  const [materials, setMaterials] = useState<StudyItem[]>(STUDY_MATERIALS);

  const subjects = ["Science", "Maths", "English", "Hindi", "Social Science"];

  const filtered = materials.filter((m) => {
    const matchesSubject = m.subject.toLowerCase() === selectedSubject.toLowerCase();
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleAction = (item: StudyItem) => {
    if (item.type === "LINK") {
      showToast("Opening shared educational video resource...", "info");
      window.open("https://youtube.com", "_blank");
      return;
    }

    if (item.saved) {
      showToast(`Opening locally saved offline copy of "${item.title}"`, "success");
    } else {
      setMaterials((prev) =>
        prev.map((m) => (m.id === item.id ? { ...m, saved: true } : m))
      );
      showToast(`Downloaded "${item.title}" for offline revision!`, "success");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn font-sans text-ink">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-small text-ink-secondary">Academic Library · Class 8-B</div>
          <h1 className="text-title font-semibold text-ink m-0">Subject Study Materials & Notes</h1>
        </div>

        {/* Search */}
        <div className="relative min-w-[280px]">
          <input
            type="text"
            placeholder="Search notes or worksheets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full min-h-[40px] px-3.5 pl-9 rounded-control border border-line-input bg-surface-subtle text-small text-ink placeholder:text-ink-secondary focus:bg-surface focus:border-primary focus:outline-none transition-colors"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" size={15} />
        </div>
      </div>

      {/* Subject Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-line pb-2 overflow-x-auto">
        {subjects.map((sub) => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`px-4 py-2 rounded-control text-small font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedSubject === sub
                ? "bg-nav-bg text-white shadow-2xs"
                : "bg-surface text-ink-secondary hover:text-ink hover:bg-surface-subtle border border-line"
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Materials Table Card */}
      <div className="bg-surface border border-line rounded-card overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line-row text-caption text-ink-secondary bg-surface-subtle/40">
                <th className="py-3 px-6 font-semibold">Format</th>
                <th className="py-3 px-6 font-semibold">Resource Title</th>
                <th className="py-3 px-6 font-semibold">Educator</th>
                <th className="py-3 px-6 font-semibold">Date Shared</th>
                <th className="py-3 px-6 font-semibold">File Size</th>
                <th className="py-3 px-6 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-row text-small">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-surface-subtle/50 transition-colors">
                  <td className="py-3.5 px-6">
                    <span className="w-9 h-9 rounded-control bg-primary-tint text-primary font-semibold text-micro flex items-center justify-center border border-primary/20">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-ink max-w-md">
                    {item.title}
                  </td>
                  <td className="py-3.5 px-6 text-ink-secondary">
                    {item.educator}
                  </td>
                  <td className="py-3.5 px-6 text-ink-secondary font-mono text-caption">
                    {item.date}
                  </td>
                  <td className="py-3.5 px-6 font-mono text-caption text-ink-secondary">
                    {item.size || "Web Link"}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => handleAction(item)}
                      className="px-3 py-1.5 rounded-control text-small font-semibold text-primary hover:bg-primary-tint/50 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      {item.type === "LINK" ? (
                        <>
                          <FiExternalLink size={14} /> Open Video
                        </>
                      ) : item.saved ? (
                        <>
                          <FiCheck size={14} /> Saved Offline
                        </>
                      ) : (
                        <>
                          <FiDownload size={14} /> Download PDF
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-small text-ink-secondary">
            No study material files found matching "{search}" under {selectedSubject}.
          </div>
        )}
      </div>

      <div className="text-caption text-ink-secondary text-center px-4 leading-relaxed">
        Study materials uploaded by teachers can be stored offline for continuous revision without cellular data usage.
      </div>
    </div>
  );
};

export default StudentMaterial;
