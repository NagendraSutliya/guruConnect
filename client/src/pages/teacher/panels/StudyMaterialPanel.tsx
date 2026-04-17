import { useEffect, useRef, useState } from "react";
import api from "../../../api/axiosInstance";
import {
  FiUpload,
  FiTrash2,
  FiSearch,
  FiChevronDown,
  FiX,
} from "react-icons/fi";
import type { ResultClassAssignment } from "../../../types/teacher/types";

const StudyMaterialPanel = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<ResultClassAssignment[]>([]);

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [search, setSearch] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMaterials();
    fetchAssignments();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await api.get("/study-material");
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];
      setMaterials(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await api.get("/teacher-assign/my");
      setAssignments(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ✅ UNIQUE FILTERS (same as ResultPanel) */

  const classes = Array.from(
    new Map(assignments.map((a) => [a.classId._id, a.classId])).values()
  );

  const sections = Array.from(
    new Map(
      assignments
        .filter((a) => a.classId._id === selectedClassId)
        .map((a) => [a.sectionId?._id, a.sectionId])
    ).values()
  );

  const subjects = Array.from(
    new Map(
      assignments
        .filter(
          (a) =>
            a.classId._id === selectedClassId &&
            a.sectionId?._id === selectedSectionId
        )
        .map((a) => [a.subjectId?._id, a.subjectId])
    ).values()
  );

  const handleUpload = async () => {
    if (!title || !selectedClassId || !selectedSubjectId || !file) {
      return alert("All fields are required");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("classId", selectedClassId);
    formData.append("subjectId", selectedSubjectId);
    formData.append("file", file);

    try {
      setLoading(true);
      await api.post("/teacher/material", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setLoading(false);
      setTitle("");
      setSelectedClassId("");
      setSelectedSectionId("");
      setSelectedSubjectId("");
      setFile(null);

      fetchMaterials();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this material?")) return;

    try {
      await api.delete(`/teacher/study-material/${id}`);
      fetchMaterials();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMaterials = materials.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Study Material</h1>

      {/* Upload Section */}
      <div className="bg-white shadow rounded-2xl p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Upload Material</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Class */}
          <div className="flex flex-col">
            <label>Class</label>
            <div className="relative">
              <select
                value={selectedClassId}
                onChange={(e) => {
                  setSelectedClassId(e.target.value);
                  setSelectedSectionId("");
                  setSelectedSubjectId("");
                }}
                className="border p-2 rounded-lg shadow-md w-full appearance-none"
              >
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" />
            </div>
          </div>

          {/* Section */}
          <div className="flex flex-col">
            <label>Section</label>
            <div className="relative">
              <select
                value={selectedSectionId}
                onChange={(e) => {
                  setSelectedSectionId(e.target.value);
                  setSelectedSubjectId("");
                }}
                className="border p-2 rounded-lg shadow-md w-full appearance-none"
              >
                <option value="">Select Section</option>
                {sections.map((s) => (
                  <option key={s?._id} value={s?._id}>
                    {s?.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" />
            </div>
          </div>

          {/* Subject */}
          <div className="flex flex-col">
            <label>Subject</label>
            <div className="relative">
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="border p-2 rounded-lg shadow-md w-full appearance-none"
              >
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s?._id} value={s?._id}>
                    {s?.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" />
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col">
            <label>Title</label>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 rounded-lg shadow-md"
            />
          </div>

          {/* File */}
          <div className="flex flex-col">
            <label>File</label>
            <input
              type="file"
              ref={fileRef}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              // className="border p-2 rounded-lg shadow-md"
            />
          </div>

          {/* Upload Button (right aligned) */}
          <div className="flex justify-end items-end">
            <button
              onClick={handleUpload}
              className="bg-blue-600 text-white mt-4 px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition w-fit"
            >
              <FiUpload className="inline mr-2" />
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border rounded-2xl shadow-sm px-6 py-4 space-y-2">
        <div className="flex justify-end">
          <div className="bg-white flex items-center border rounded-lg overflow-hidden shadow w-full md:w-80">
            <FiSearch className="text-gray-400 ml-2" />

            <input
              type="text"
              placeholder="Search material..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-grow px-2 py-1 outline-none"
            />

            <FiX
              className={`text-gray-400 cursor-pointer mr-2 ${
                search ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              onClick={() => setSearch("")}
            />
          </div>
        </div>

        {/* List */}
        <div className="bg-white shadow rounded-2xl overflow-hidden">
          <table className="w-full table-fixed">
            <thead className="bg-green-100 text-left">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Class</th>
                <th className="p-3">Subject</th>
                <th className="p-3">File</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.map((m) => (
                <tr key={m._id} className="border-t">
                  <td className="p-3">{m.title}</td>
                  <td className="p-3">{m.classId?.name}</td>
                  <td className="p-3">{m.subjectId?.name}</td>
                  <td className="p-3">
                    <a
                      href={`http://localhost:5000${m.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600"
                    >
                      View
                    </a>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(m._id)}
                      className="text-red-500"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredMaterials.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    No materials found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudyMaterialPanel;
