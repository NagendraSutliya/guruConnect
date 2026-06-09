import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import { useToast } from "../../../context/ToastContext";
import type { Student, StudentFormData } from "../../../types/admin/student";
import {
  FiEdit,
  FiEye,
  FiSearch,
  FiToggleLeft,
  FiToggleRight,
  FiTrash2,
  FiX,
  FiUserPlus,
  FiDownload,
  FiCopy,
  FiCheckCircle,
} from "react-icons/fi";
import {  FaUserCheck, FaUserTimes, FaUsers } from "react-icons/fa";
import AddStudentModal from "../../../components/admin/modals/AddStudentModal";
import ViewStudentModal from "../../../components/admin/modals/ViewStudentModal";
import Pagination from "../../../components/common/Pagination";

const StudentPanel = () => {
  const { showToast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form, setForm] = useState<StudentFormData>({
    name: "",
    email: "",
    password: "",
    rollNo: "",
    admissionNo: "",
    enrollmentNo: "",
    classId: "",
    sectionId: "",
    parentName: "",
    parentPhone: "",
    phone: "",
    dob: "",
    admissionDate: "",
    gender: "",
    category: "",
    religion: "",
    nationality: "Indian",
    bloodGroup: "",
    previousSchool: "",
    previousClass: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >(() => (localStorage.getItem("studentFilter") as any) || "all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [newStudentCreds, setNewStudentCreds] = useState<{
    email: string;
    password: string;
  } | null>(null);


  useEffect(() => {
  if (showForm || showViewModal) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [showForm, showViewModal]);

  // Load students
  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/students");
      setStudents(res.data.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load students ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  // Load classes and sections
  const loadClasses = async () => {
    try {
      const res = await api.get("/admin/classes");
      setClasses(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadStudents();
    loadClasses();
  }, []);

  // Dynamic sections based on class
  useEffect(() => {
    if (!form.classId) {
      setSections([]);
      setForm({ ...form, sectionId: "" });
      return;
    }

    const loadSections = async () => {
      try {
        const res = await api.get(`/admin/sections/class/${form.classId}`);
        setSections(res.data.data || []);
        // Only reset sectionId if the current one isn't in the new list
        setForm((prev) => ({ ...prev, sectionId: "" }));
      } catch (err) {
        setSections([]);
        setForm((prev) => ({ ...prev, sectionId: "" }));
        console.log(err);
      }
    };

    loadSections();
  }, [form.classId]);

  // Add or edit student
  const saveStudent = async () => {
    if (!form.name || !form.email || !form.classId) {
      return showToast("Please fill all required fields ⚠️", "warn");
    }

    try {
      setActionLoading("save");

      if (editingStudent) {
        await api.put(`/admin/students/${editingStudent._id}`, form);
        showToast("Student updated ✏️", "success");
      } else {
        const res = await api.post("/admin/students", form);
        const creds = res.data.data;
        setNewStudentCreds({ email: creds.email, password: creds.password });
        showToast("Student created successfully ✅", "success");
      }

      setForm({
        name: "",
        email: "",
        password: "",
        rollNo: "",
        admissionNo: "",
        enrollmentNo: "",
        classId: "",
        sectionId: "",
        parentName: "",
        parentPhone: "",
        dob: "",
        admissionDate: "",
        gender: "",
        category: "",
        religion: "",
        nationality: "Indian",
        bloodGroup: "",
        previousSchool: "",
        previousClass: "",
        address: "",
      });
      setEditingStudent(null);
      setShowForm(false);
      loadStudents();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Operation failed ❌", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete student
  const deleteStudent = async (student: Student) => {
    if (!confirm(`Delete ${student.name}? This cannot be undone.`)) return;

    try {
      setActionLoading(student._id);
      await api.delete(`/admin/students/${student._id}`);
      setStudents((prev) => prev.filter((s) => s._id !== student._id));
      showToast("Student deleted 🗑️", "success");
    } catch (err) {
      showToast("Delete failed ❌", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Toggle active/inactive
  const toggleStudent = async (student: Student) => {
    try {
      setActionLoading(student._id);

      if (student.isActive) {
        await api.patch(`/admin/students/${student._id}/deactivate`);
        showToast("Student deactivated", "info");
      } else {
        await api.patch(`/admin/students/${student._id}/activate`);
        showToast("Student activated", "success");
      }

      loadStudents();
    } catch (err) {
      showToast("Failed to update status ❌", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const viewStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const editStudent = (student: Student) => {
    setEditingStudent(student);
    setForm({
      name: student.name,
      email: student.email || "",
      password: "",
      rollNo: student.rollNo || "",
      admissionNo: student.admissionNo || "",
      enrollmentNo: student.enrollmentNo || "",
      classId: student.classId?._id || student.classId || "",
      sectionId: student.sectionId?._id || student.sectionId || "",
      parentName: student.parentName || "",
      parentPhone: student.parentPhone || "",
      phone: student.phone || "",
      dob: student.dob ? new Date(student.dob).toISOString().split('T')[0] : "",
      admissionDate: student.admissionDate ? new Date(student.admissionDate).toISOString().split('T')[0] : "",
      gender: student.gender || "",
      category: student.category || "",
      religion: student.religion || "",
      nationality: student.nationality || "Indian",
      bloodGroup: student.bloodGroup || "",
      previousSchool: student.previousSchool || "",
      previousClass: student.previousClass || "",
      address: student.address || "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      rollNo: "",
      admissionNo: "",
      enrollmentNo: "",
      classId: "",
      sectionId: "",
      parentName: "",
      parentPhone: "",
      dob: "",
      admissionDate: "",
      gender: "",
      category: "",
      religion: "",
      nationality: "Indian",
      bloodGroup: "",
      previousSchool: "",
      previousClass: "",
      address: "",
    });
    setEditingStudent(null);
    setShowForm(false);
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesStatus =
      statusFilter === "all" || s.isActive === (statusFilter === "active");
    const matchesSearch =
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const counts = {
    all: students.length,
    active: students.filter((s) => s.isActive).length,
    inactive: students.filter((s) => !s.isActive).length,
  };

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    localStorage.setItem("studentFilter", statusFilter);
    setCurrentPage(1);
  }, [statusFilter, searchTerm, itemsPerPage]);

  return (
    <div className="space-y-6 pb-8 animate-fadeIn">

      {/* Credentials Banner */}
      {newStudentCreds && (
        <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-black tracking-tight mb-2 flex items-center gap-2">
                        <FiCheckCircle className="text-emerald-400" /> 
                        Student Credentials Generated
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/20">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Email Address :</p>
                            <p className="font-mono font-bold">{newStudentCreds.email}</p>
                        </div>
                        <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/20">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Temporary Password :</p>
                            <p className="font-mono font-bold">{newStudentCreds.password}</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(`Email: ${newStudentCreds.email}\nPassword: ${newStudentCreds.password}`);
                            showToast("Copied to clipboard!", "success");
                        }}
                        className="flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black shadow-xl hover:scale-105 transition-transform active:scale-95"
                    >
                        <FiCopy /> Copy Both
                    </button>
                    <button
                        onClick={() => setNewStudentCreds(null)}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-blue-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-blue-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Student Enrollment</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage student records, classes, and portal access.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-sm">
            <FiDownload />
            <span>Export</span>
          </button>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-xl font-bold shadow-md shadow-blue-500/30 transition-all hover:-translate-y-0.5 active:scale-95 text-sm"
            >
              <FiUserPlus />
              <span>Add Student</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl p-5 shadow-sm border border-blue-100/60 flex items-center gap-4 transition-all hover:shadow-[0_8px_30px_rgb(59,130,246,0.1)] hover:-translate-y-1 duration-300 group">
          <div className="w-12 h-12 rounded-xl bg-blue-100/80 flex items-center justify-center text-blue-600 text-xl shadow-inner group-hover:scale-110 transition-transform">
            <FaUsers />
          </div>
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Enrolled</p>
             <h3 className="text-3xl font-black text-slate-800">{counts.all}</h3>
           </div>
        </div>
        
         <div className="bg-gradient-to-br from-white to-emerald-50/50 rounded-2xl p-5 shadow-sm border border-emerald-100/60 flex items-center gap-4 transition-all hover:shadow-[0_8px_30px_rgb(16,185,129,0.1)] hover:-translate-y-1 duration-300 group">
          <div className="w-12 h-12 rounded-xl bg-emerald-100/80 flex items-center justify-center text-emerald-600 text-xl shadow-inner group-hover:scale-110 transition-transform">
            <FaUserCheck />
          </div>
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Students</p>
             <h3 className="text-3xl font-black text-slate-800">{counts.active}</h3>
           </div>
        </div>

         <div className="bg-gradient-to-br from-white to-rose-50/50 rounded-2xl p-5 shadow-sm border border-rose-100/60 flex items-center gap-4 transition-all hover:shadow-[0_8px_30px_rgb(244,63,94,0.1)] hover:-translate-y-1 duration-300 group">
          <div className="w-12 h-12 rounded-xl bg-rose-100/80 flex items-center justify-center text-rose-600 text-xl shadow-inner group-hover:scale-110 transition-transform">
            <FaUserTimes />
          </div>
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Inactive / Left</p>
             <h3 className="text-3xl font-black text-slate-800">{counts.inactive}</h3>
           </div>
        </div>
      </div>

      {/* Main Table Section */}
     <div className="bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-slate-200 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-50/50">
             <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-shadow shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <FiX />
              </button>
            )}
          </div>

 <div className="flex bg-slate-100/80 p-1 rounded-lg w-full sm:w-auto">
            {(["all", "active", "inactive"] as const).map((status) => {
              const isActive = statusFilter === status;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-xs font-bold transition-all duration-200 capitalize ${
                    isActive
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50/80 text-slate-600 text-[11px] uppercase tracking-wider font-black border-b border-slate-100">
                <th className="px-5 py-3">Student Info</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Academic Info</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm font-bold text-slate-500">Syncing Student Data...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <FiSearch size={24} className="text-slate-300" />
                    </div>
                    <p className="text-lg font-black text-slate-700">No students found</p>
                    <p className="text-sm font-medium mt-1">Try a different search term or filter.</p>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((s) => {
                  const isLoading = actionLoading === s._id;
                  const initials = s.name?.substring(0, 2).toUpperCase() || "??";

                  return (
                    <tr key={s._id} className="group hover:bg-slate-50/50 transition-colors duration-200">
                      {/* Student Info */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                              {s.name || "Unnamed Student"}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">
                              ID: {s._id?.slice(-6).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-3">
                        <span className="text-xs text-slate-600 font-medium">{s.email}</span>
                      </td>

                      {/* Academic Info */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                           <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                             Class {s.classId?.name || "N/A"}
                           </span>
                           {s.sectionId && (
                             <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                               Sec {s.sectionId?.name}
                             </span>
                           )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          s.isActive ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
                        }`}>
                          {s.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => viewStudent(s)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="View Profile"
                          >
                            <FiEye size={16} />
                          </button>

                          <button
                            onClick={() => editStudent(s)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            title="Edit Record"
                          >
                            <FiEdit size={16} />
                          </button>

                          <button
                            onClick={() => toggleStudent(s)}
                            disabled={isLoading}
                            className={`p-1.5 rounded-lg transition-all ${
                              s.isActive ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50" : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                            }`}
                            title={s.isActive ? "Deactivate Account" : "Activate Account"}
                          >
                            {isLoading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : s.isActive ? <FiToggleLeft size={16} /> : <FiToggleRight size={16} />}
                          </button>

                          <button
                            onClick={() => deleteStudent(s)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Student"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filteredStudents.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <AddStudentModal
          form={form}
          setForm={setForm}
          onSave={saveStudent}
          onClose={closeForm}
          loading={actionLoading === "save"}
          isEdit={!!editingStudent}
          classes={classes}
          sections={sections}
        />
      )}

      {showViewModal && selectedStudent && (
        <ViewStudentModal
          student={selectedStudent}
          onClose={() => setShowViewModal(false)}
        />
      )}

   
    </div>
  );
};

export default StudentPanel;
