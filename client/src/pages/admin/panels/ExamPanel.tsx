import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import type { Exam, Option } from "../../../types/exam";
import Toast from "../../../components/Toast";

const ExamPanel = () => {
  const [exams, setExams] = useState<Exam[]>([]);

  const [classes, setClasses] = useState<Option[]>([]);
  const [sections, setSections] = useState<Option[]>([]);
  const [subjects, setSubjects] = useState<Option[]>([]);
  const [toast, setToast] = useState<{ message: string; type?: string } | null>(
    null
  );

  const [form, setForm] = useState({
    name: "",
    classId: "",
    sectionId: "",
    subjectId: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  const [editId, setEditId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);

      const [examRes, classRes, sectionRes, subjectRes] = await Promise.all([
        api.get("/exams"),
        api.get("/classes"),
        api.get("/sections"),
        api.get("/subjects"),
      ]);

      setExams(examRes.data.data || []);
      setClasses(classRes.data.data || []);
      setSections(sectionRes.data.data || []);
      setSubjects(subjectRes.data.data || []);
    } catch (err) {
      console.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    if (!form.name || !form.classId || !form.subjectId || !form.date) {
      alert("Please fill required fields");
      return;
    }

    try {
      setSaving(true);

      if (editId) {
        await api.put(`/exams/${editId}`, form);
      } else {
        await api.post("/exams", form);
      }

      setForm({
        name: "",
        classId: "",
        sectionId: "",
        subjectId: "",
        date: "",
        startTime: "",
        endTime: "",
      });

      setEditId(null);
      load();
    } catch (err) {
      alert("Failed to save exam");
    } finally {
      setSaving(false);
    }
  };

  const edit = (exam: Exam) => {
    setForm({
      name: exam.name,
      classId: exam.classId?._id || "",
      sectionId: exam.sectionId?._id || "",
      subjectId: exam.subjectId?._id || "",
      date: exam.date.split("T")[0],
      startTime: exam.startTime || "",
      endTime: exam.endTime || "",
    });

    setEditId(exam._id);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this exam?")) return;

    try {
      await api.delete(`/exams/${id}`);
      load();
    } catch {
      alert("Failed to delete exam");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6 pb-10">
      <h2 className="text-2xl font-bold text-gray-800">Exam Management</h2>

      {/* FORM */}

      <div className="bg-white p-5 rounded-xl shadow">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Exam Name */}

          <div>
            <label className="text-sm text-gray-600">Exam Name</label>
            <input
              name="name"
              placeholder="Unit/Mock/Final Exam"
              value={form.name}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Class */}

          <div>
            <label className="text-sm text-gray-600">Class</label>
            <select
              name="classId"
              value={form.classId}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="">Select</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Section */}

          <div>
            <label className="text-sm text-gray-600">Section</label>
            <select
              name="sectionId"
              value={form.sectionId}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="">Optional</option>
              {sections.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}

          <div>
            <label className="text-sm text-gray-600">Subject</label>
            <select
              name="subjectId"
              value={form.subjectId}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="">Select</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}

          <div>
            <label className="text-sm text-gray-600">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Start Time */}

          <div>
            <label className="text-sm text-gray-600">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* End Time */}

          <div>
            <label className="text-sm text-gray-600">End Time</label>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={submit}
              disabled={saving}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 w-full"
            >
              {saving ? "Saving..." : editId ? "Update Exam" : "Add Exam"}
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-green-50">
            <tr>
              <th className="p-3">Exam</th>
              <th className="p-3">Class</th>
              <th className="p-3">Section</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Date</th>
              <th className="p-3">Time</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="p-6 text-center">
                  Loading exams...
                </td>
              </tr>
            )}

            {!loading &&
              exams.map((exam) => (
                <tr key={exam._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{exam.name}</td>

                  <td className="p-3">{exam.classId?.name}</td>

                  <td className="p-3">{exam.sectionId?.name || "-"}</td>

                  <td className="p-3">{exam.subjectId?.name}</td>

                  <td className="p-3">
                    {new Date(exam.date).toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    {exam.startTime} - {exam.endTime}
                  </td>

                  <td className="p-3 flex justify-center gap-3">
                    <button
                      onClick={() => edit(exam)}
                      className="text-yellow-600"
                    >
                      <FiEdit size={16} />
                    </button>

                    <button
                      onClick={() => remove(exam._id)}
                      className="text-red-600"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamPanel;
