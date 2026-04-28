import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axiosInstance";
import Toast from "../../../components/Toast";
import RoutineModal from "../../modals/admin/RoutineModal";
import type { Assignment } from "../../../types/admin/teacherassignment";
import type { Routine } from "../../../types/admin/routine";
import { FiChevronDown } from "react-icons/fi";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const defaultTimeSlots = [
  "08:00-09:00",
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "Lunch",
  "01:00-02:00",
  "02:00-03:00",
  "03:00-04:00",
];

const RoutinePanel = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [routine, setRoutine] = useState<Routine[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Routine | null>(null);

  const [toast, setToast] = useState<any>(null);

  const showToast = (message: string, type = "info") =>
    setToast({ message, type });

  /* ================= LOAD ================= */
  useEffect(() => {
    api
      .get("/admin/teacher-assign")
      .then((res) => setAssignments(res.data.data || []))
      .catch(() => showToast("Failed to load assignments", "error"));
  }, []);

  useEffect(() => {
    if (!selectedClassId || !selectedSectionId) return;

    api
      .get("/admin/routine", {
        params: { classId: selectedClassId, sectionId: selectedSectionId },
      })
      .then((res) => setRoutine(res.data.data || []))
      .catch(() => showToast("Failed to load routine", "error"));
  }, [selectedClassId, selectedSectionId]);

  /* ================= FILTERS ================= */
  const classes = useMemo(() => {
    return Array.from(
      new Map(assignments.map((a) => [a.classId._id, a.classId])).values()
    );
  }, [assignments]);

  const sections = useMemo(() => {
    const filtered = assignments.filter(
      (a) => a.classId._id === selectedClassId && a.sectionId
    );

    return Array.from(
      new Map(filtered.map((a) => [a.sectionId!._id, a.sectionId!])).values()
    );
  }, [assignments, selectedClassId]);

  const subjects = useMemo(() => {
    return assignments.filter(
      (a) =>
        a.classId._id === selectedClassId &&
        a.sectionId?._id === selectedSectionId &&
        a.subjectId &&
        a.teacherId
    );
  }, [assignments, selectedClassId, selectedSectionId]);

  /* ================= TIME ================= */
  const timeSlots = useMemo(() => {
    return routine.length
      ? Array.from(new Set(routine.map((r) => `${r.startTime}-${r.endTime}`)))
      : defaultTimeSlots;
  }, [routine]);

  const getSlot = (day: string, time: string) => {
    const [start, end] = time.split("-");
    return routine.find(
      (r) => r.day === day && r.startTime === start && r.endTime === end
    );
  };

  /* ================= MODAL ================= */
  const openModal = (day: string, time?: string, slot?: Routine) => {
    if (slot) {
      setEditingSlot(slot);
    } else {
      const [start, end] = time?.split("-") || ["", ""];
      setEditingSlot({
        classId: selectedClassId,
        sectionId: selectedSectionId,
        subjectId: "",
        teacherId: "",
        day,
        startTime: start,
        endTime: end,
      });
    }
    setModalOpen(true);
  };

  /* ================= SAVE ================= */
  const saveRoutine = async (form: Routine) => {
    try {
      if (form._id) {
        await api.put(`/admin/routine/${form._id}`, form);
        showToast("Routine updated", "success");
      } else {
        await api.post("/admin/routine", [form]);
        showToast("Routine added", "success");
      }

      setModalOpen(false);

      const res = await api.get("/admin/routine", {
        params: { classId: selectedClassId, sectionId: selectedSectionId },
      });

      setRoutine(res.data.data || []);
    } catch {
      showToast("Failed to save routine", "error");
    }
  };

  /* ================= DELETE ================= */
  const deleteSlot = async (slot: Routine) => {
    if (!confirm("Delete this slot?")) return;

    try {
      await api.delete(`/admin/routine/${slot._id}`);
      setRoutine((prev) => prev.filter((r) => r._id !== slot._id));
      showToast("Deleted", "success");
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const subjectMap = useMemo(() => {
    const map: Record<string, { subject: string; teacher: string }> = {};

    subjects.forEach((s) => {
      map[s.subjectId._id] = {
        subject: s.subjectId.name,
        teacher: s.teacherId.name,
      };
    });

    return map;
  }, [subjects]);

  /* ================= RENDER ================= */
  return (
    <div className="space-y-4 pb-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type as any}
          onClose={() => setToast(null)}
        />
      )}
      <div className="sticky flex justify-between items-center top-0 z-20 bg-gray-100 py-1 mb-4">
        <h2 className="text-2xl font-bold mb-6">Section Routine</h2>
      </div>

      {/* FILTERS */}
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Class
          </label>
          <div className="relative">
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full border rounded-md px-4 py-2 pr-8 appearance-none shadow 
            focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-500"
            >
              <option value="">Select Class</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        <div className="flex-1">
          <label className="text-sm">Section</label>
          <div className="relative">
            <select
              value={selectedSectionId}
              disabled={!selectedClassId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="w-full border rounded-md px-4 py-2 pr-8 appearance-none shadow 
              focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-500"
            >
              <option value="">Select Section</option>
              {sections.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>

      {/* EMPTY STATES */}
      {!selectedClassId || !selectedSectionId ? (
        <div className="bg-white border rounded-2xl shadow-sm p-10 text-center">
          {/* ICON */}
          <div className="text-5xl mb-4">📅</div>

          {/* TITLE */}
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Routine Selected
          </h3>

          {/* DESCRIPTION */}
          <p className="text-gray-500 mb-4">
            Please select a{" "}
            <span className="font-medium text-indigo-600">Class</span> and{" "}
            <span className="font-medium text-indigo-600">Section</span> to view
            or manage the timetable.
          </p>

          {/* HINT */}
          <div className="text-sm text-gray-400">
            💡 Tip: Start by choosing a class from the dropdown above
          </div>
        </div>
      ) : subjects.length === 0 ? (
        <div className="bg-white border rounded-2xl shadow-sm p-10 text-center">
          <div className="text-5xl mb-4">📚</div>

          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Assignments Found
          </h3>

          <p className="text-gray-500">
            No subjects or teachers are assigned to this class and section yet.
          </p>

          <div className="text-sm text-gray-400 mt-3">
            Assign subjects and teachers first to create a routine
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto border">
          <table className="w-full border-collapse text-sm">
            {/* HEADER */}
            <thead>
              <tr className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
                <th className="p-4 border text-left">Time</th>
                {days.map((d) => (
                  <th key={d} className="p-4 border">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {timeSlots.map((time) => (
                <tr key={time} className="hover:bg-gray-50 transition">
                  {/* TIME */}
                  <td className="p-4 border font-semibold bg-gray-50 text-gray-700">
                    {time}
                  </td>

                  {/* CELLS */}
                  {days.map((day) => {
                    const slot = getSlot(day, time);

                    return (
                      <td
                        key={day}
                        onClick={() => openModal(day, time, slot)}
                        className="border p-2 h-12 align-top cursor-pointer group"
                      >
                        {slot ? (
                          <div className="h-full flex flex-col justify-between rounded-xl bg-indigo-100 border border-indigo-300 p-2 hover:shadow-md transition">
                            {/* SUBJECT */}
                            <div className="font-semibold text-indigo-800 text-sm">
                              {subjectMap[slot.subjectId]?.subject || "Unknown"}
                            </div>

                            {/* TEACHER */}
                            <div className="text-xs text-gray-600">
                              {subjectMap[slot.subjectId]?.teacher || ""}
                            </div>

                            {/* DELETE */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSlot(slot);
                              }}
                              className="text-red-500 text-xs opacity-0 group-hover:opacity-100 transition"
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-300 text-xs border-2 border-dashed rounded-xl group-hover:border-indigo-400 group-hover:text-indigo-500 transition">
                            + Add
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      <RoutineModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveRoutine}
        subjects={subjects}
        initialData={editingSlot}
      />
    </div>
  );
};

export default RoutinePanel;
