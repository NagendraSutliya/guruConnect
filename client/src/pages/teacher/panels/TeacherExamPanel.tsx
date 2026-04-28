import React, { useEffect, useState, useMemo, useRef } from "react";
import api from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { FiChevronDown, FiMoreVertical, FiSearch, FiX } from "react-icons/fi";
import useClickOutside from "../../../hooks/useClickOutside";
import Toast from "../../../components/Toast";

const TeacherExamPanel = () => {
  const [exams, setExams] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openExam, setOpenExam] = useState<string | null>(null);

  const [paperModal, setPaperModal] = useState(false);
  const [paperContent, setPaperContent] = useState("");
  const [activeExam, setActiveExam] = useState<any>(null);
  const [activeSubject, setActiveSubject] = useState<any>(null);
  const [savingPaper, setSavingPaper] = useState(false);

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<any>(null);

  const menuRefs = useRef<
    Record<string, React.RefObject<HTMLDivElement | null>>
  >({});
  const modalRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  const showToast = (message: string, type = "info") =>
    setToast({ message, type });

  /* ================= CLICK OUTSIDE FOR MENU ================= */
  useEffect(() => {
    if (!openMenu) return;
    const currentRef = menuRefs.current[openMenu];
    if (!currentRef) return;

    const handleClick = (event: MouseEvent) => {
      if (!currentRef.current) return;
      if (!currentRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [openMenu]);

  /* ================= CLICK OUTSIDE FOR MODAL ================= */
  useClickOutside(modalRef, () => setPaperModal(false));

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get("/teacher/exams/full");
        setExams(res.data.data || []);
      } catch (err) {
        console.error(err);
        showToast("Failed to load exams ❌", "error");
      }
    };
    loadData();
  }, []);

  /* AUTO OPEN FIRST EXAM */
  useEffect(() => {
    if (exams.length && !openExam) {
      setOpenExam(exams[0]._id);
    }
  }, [exams]);

  /* ================= NAVIGATION ================= */
  const goToUploadMarks = (examId: string, subjectId: string) => {
    navigate("/teacher/results/upload-marks", { state: { examId, subjectId } });
  };

  const goToResult = (examId: string, subjectId: string) => {
    navigate("/teacher/results", { state: { examId, subjectId } });
  };

  /* ================= FILE UPLOAD ================= */
  const uploadFiles = async (
    examId: string,
    subjectId: string,
    files: FileList,
    type: "question" | "answer"
  ) => {
    if (uploading) return;

    try {
      setUploading(true);
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("files", file));
      formData.append("examId", examId);
      formData.append("subjectId", subjectId);
      formData.append("type", type);

      await api.post("/exam-files/upload-multiple", formData);
      showToast("Files uploaded successfully ✅", "success");
    } catch (err) {
      console.error(err);
      showToast("Upload failed ❌", "error");
    } finally {
      setUploading(false);
    }
  };

  /* ================= SAVE TYPED PAPER ================= */
  const saveTypedPaper = async () => {
    if (!paperContent.trim())
      return showToast("Paper cannot be empty ⚠️", "warning");

    try {
      setSavingPaper(true);
      await api.post("/exam-files/save-typed-paper", {
        examId: activeExam,
        subjectId: activeSubject,
        content: paperContent,
      });

      showToast("Paper saved successfully ✍️", "success");
      setPaperModal(false);
      setPaperContent("");
      setActiveExam(null);
      setActiveSubject(null);
    } catch (err) {
      console.error(err);
      showToast("Failed to save paper ❌", "error");
    } finally {
      setSavingPaper(false);
    }
  };

  /* ================= HELPERS ================= */
  const isToday = (date: string) => {
    const today = new Date();
    const d = new Date(date);
    return d.toDateString() === today.toDateString();
  };

  const isUploadAllowed = (status: string, isSubmitted?: boolean) =>
    status === "completed" && !isSubmitted;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-green-500 text-white animate-pulse";
      case "upcoming":
        return "bg-yellow-400 text-black";
      case "completed":
        return "bg-red-400 text-white";
      default:
        return "bg-gray-200";
    }
  };

  /* ================= FILTER ================= */
  const filteredExams = useMemo(() => {
    const filtered = exams.filter((exam) => {
      const matchesSearch = exam.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || exam.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    const order: any = { ongoing: 1, upcoming: 2, completed: 3 };
    return [...filtered].sort((a, b) => order[a.status] - order[b.status]);
  }, [exams, search, statusFilter]);

  /* ================= STATS ================= */
  const total = exams.length;
  const ongoing = exams.filter((e) => e.status === "ongoing").length;
  const completed = exams.filter((e) => e.status === "completed").length;

  return (
    <div className="space-y-4 pb-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">📘 Exam Schedule</h2>

        <div className="flex gap-3 items-center mt-6">
          <div className="bg-white flex items-center border rounded-lg overflow-hidden shadow">
            <FiSearch className="text-gray-400 ml-2" />
            <input
              type="text"
              placeholder="Search exam..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1 text-sm outline-none"
            />
            <FiX
              className={`text-gray-400 cursor-pointer mr-2 ${
                search ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              onClick={() => setSearch("")}
            />
          </div>

          <div className="relative">
            <select
              className="border px-3 py-1 text-sm rounded-lg appearance-none pr-8 bg-white shadow-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
            <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {/* STATS */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-200 p-4 rounded-lg shadow text-center">
            Total Exams: <b>{total}</b>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow text-center">
            Ongoing: <b>{ongoing}</b>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow text-center">
            Completed: <b>{completed}</b>
          </div>
        </div>

        {filteredExams.map((exam) => (
          <div key={exam._id} className="bg-white shadow rounded-xl p-5">
            <div
              className="flex justify-between cursor-pointer"
              onClick={() =>
                setOpenExam(openExam === exam._id ? null : exam._id)
              }
            >
              <div>
                <h3 className="font-semibold">{exam.name}</h3>
                <p className="text-sm text-gray-500">
                  {exam.classId?.name} • {exam.sectionId?.name}
                </p>
              </div>

              <div className="mt-2">
                <span
                  className={`px-3 py-2 text-sm font-semibold rounded ${getStatusColor(
                    exam.status
                  )}`}
                >
                  {exam.status}
                </span>
              </div>
            </div>

            {openExam === exam._id && (
              <div className="mt-4 space-y-3">
                {exam.subjects?.map((sub: any) => {
                  // initialize menu ref
                  if (!menuRefs.current[sub._id]) {
                    menuRefs.current[sub._id] = React.createRef();
                  }

                  return (
                    <div
                      key={sub._id}
                      className="border rounded-lg p-3 flex justify-between"
                    >
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="font-medium">{sub.subjectId?.name}</p>

                        <p className="text-sm text-gray-500">
                          {new Date(sub.date).toLocaleDateString()} •{" "}
                          {sub.startTime} - {sub.endTime}
                        </p>

                        {isToday(sub.date) && (
                          <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                            Today
                          </span>
                        )}

                        {sub.isSubmitted && (
                          <span className="text-xs bg-green-100 px-2 py-1 rounded">
                            Submitted
                          </span>
                        )}

                        {sub.hasTypedPaper && (
                          <span className="text-xs bg-orange-100 px-2 py-1 rounded">
                            Typed
                          </span>
                        )}
                      </div>

                      {/* MENU */}
                      <div ref={menuRefs.current[sub._id]} className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenu(openMenu === sub._id ? null : sub._id);
                          }}
                          className="p-2 hover:bg-gray-200 rounded-full"
                        >
                          <FiMoreVertical />
                        </button>

                        {openMenu === sub._id && (
                          <div className="absolute w-56 right-0 bg-white border rounded-lg shadow-lg z-10 py-2">
                            <label className="block p-2 hover:bg-gray-100 cursor-pointer">
                              📄 Upload Question Paper
                              <input
                                type="file"
                                hidden
                                multiple
                                onChange={(e) => {
                                  if (!e.target.files) return;

                                  const subjectIdSafe = sub.subjectId?._id;
                                  if (!subjectIdSafe) {
                                    return showToast(
                                      "Subject ID missing ❌",
                                      "error"
                                    );
                                  }
                                  uploadFiles(
                                    exam._id,
                                    subjectIdSafe,
                                    e.target.files,
                                    "question"
                                  );
                                }}
                              />
                            </label>

                            <button
                              onClick={() => {
                                setActiveExam(exam._id);
                                setActiveSubject(sub.subjectId?._id);
                                setPaperModal(true);
                                setOpenMenu(null);
                              }}
                              className="block w-full text-left p-2 hover:bg-gray-100"
                            >
                              ✍️ Type Question Paper
                            </button>

                            <label className="block p-2 hover:bg-gray-100 cursor-pointer">
                              📤 Upload Answer Sheets
                              <input
                                type="file"
                                hidden
                                multiple
                                onChange={(e) => {
                                  if (!e.target.files) return;

                                  const subjectIdSafe = sub.subjectId?._id;
                                  if (!subjectIdSafe) {
                                    return alert(
                                      "Subject ID missing, cannot upload files"
                                    );
                                  }
                                  uploadFiles(
                                    exam._id,
                                    subjectIdSafe,
                                    e.target.files,
                                    "answer"
                                  );
                                }}
                              />
                            </label>

                            <button
                              disabled={
                                !isUploadAllowed(exam.status, sub.isSubmitted)
                              }
                              onClick={() =>
                                goToUploadMarks(exam._id, sub.subjectId?._id)
                              }
                              className={`block w-full text-left p-2 ${
                                isUploadAllowed(exam.status, sub.isSubmitted)
                                  ? "hover:bg-gray-100"
                                  : "text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              📊 Upload Marks
                            </button>

                            <button
                              onClick={() =>
                                goToResult(exam._id, sub.subjectId?._id)
                              }
                              className="block w-full text-left p-2 hover:bg-gray-100"
                            >
                              📈 View Result
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MODAL */}
      {paperModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6 max-h-[90vh] overflow-auto"
          >
            <h2 className="text-xl font-semibold mb-4">
              ✍️ Create Question Paper
            </h2>

            <textarea
              value={paperContent}
              onChange={(e) => setPaperContent(e.target.value)}
              className="w-full h-64 border rounded-lg p-3"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setPaperModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveTypedPaper}
                disabled={savingPaper}
                className="px-4 py-2 bg-orange-600 text-white rounded"
              >
                {savingPaper ? "Saving..." : "Save Paper"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INFO PANEL */}
      <div className="mt-6 bg-blue-100 border-l-4 border-blue-400 p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-blue-800 mb-2">
          📌 Important Information
        </h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Ensure all question papers are uploaded before the exam date.</li>
          <li>Typed papers should be saved and verified for accuracy.</li>
          <li>Upload marks only after students submit their answer sheets.</li>
          <li>Check the "Today" tags for exams happening today.</li>
        </ul>
      </div>
    </div>
  );
};

export default TeacherExamPanel;
