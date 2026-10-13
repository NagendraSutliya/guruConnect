import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import ViewTeacherModal from "../../../components/admin/modals/ViewTeacherModal";
import AddTeacherModal from "../../../components/admin/modals/AddTeacherModal";
import { useToast } from "../../../context/ToastContext";
import type { Teacher, TeacherFormData } from "../../../types/admin/teacher";
import {
  FiEdit,
  FiEye,
  FiSearch,
  FiToggleLeft,
  FiToggleRight,
  FiTrash2,
  FiX,
  FiDownload,
} from "react-icons/fi";
import { FaUserPlus, FaUsers, FaUserCheck, FaUserTimes } from "react-icons/fa";
import DataGrid from "../../../components/common/DataGrid";

const TeacherPanel = () => {
  /** --------------------- State Variables --------------------- **/
  const { showToast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [form, setForm] = useState<TeacherFormData>({
    name: "",
    email: "",
    password: "",
    employeeId: "",
    designation: "",
    qualification: "",
    specialization: "",
    phone: "",
    emergencyPhone: "",
    panNo: "",
    bankAccountNo: "",
    ifscCode: "",
    basicSalary: "",
    joiningDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">(
    () => (localStorage.getItem("teacherFilter") as any) || "all"
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  /** --------------------- Helper Functions --------------------- **/

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/teachers");
      setTeachers(res.data.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load teachers ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  const addTeacher = async () => {
    if (!form.name || !form.email || (!editingTeacher && !form.password)) {
      return showToast("All required fields must be filled", "warn");
    }

    try {
      setActionLoading("save");

      if (editingTeacher) {
        await api.put(`/admin/teachers/${editingTeacher._id}`, form);
        showToast("Teacher updated ✏️", "success");
      } else {
        await api.post("/admin/teachers", form);
        showToast("Teacher added successfully ✅", "success");
      }

      setForm({
        name: "",
        email: "",
        password: "",
        employeeId: "",
        designation: "",
        qualification: "",
        specialization: "",
        phone: "",
        emergencyPhone: "",
        panNo: "",
        bankAccountNo: "",
        ifscCode: "",
        basicSalary: "",
        joiningDate: "",
      });
      setEditingTeacher(null);
      setShowForm(false);
      loadTeachers();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Operation failed ❌", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteTeacher = async (teacher: any) => {
    const confirmDelete = window.confirm(
      `Delete ${teacher.name}? This cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      setActionLoading(teacher._id);
      await api.delete(`/admin/teachers/${teacher._id}`);
      setTeachers((prev) => prev.filter((t) => t._id !== teacher._id));
      showToast("Teacher deleted 🗑️", "success");
    } catch (err) {
      showToast("Delete failed ❌", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const toggleTeacher = async (teacher: any) => {
    try {
      setActionLoading(teacher._id);

      if (teacher.status === "active") {
        await api.patch(`/admin/teachers/${teacher._id}/deactivate`);
        showToast("Teacher deactivated", "info");
      } else {
        await api.patch(`/admin/teachers/${teacher._id}/activate`);
        showToast("Teacher activated", "success");
      }

      loadTeachers();
    } catch (err) {
      showToast("Failed to update status ❌", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const viewTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowViewModal(true);
  };

  const editTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setForm({
      name: teacher.name,
      email: teacher.email,
      password: "",
      employeeId: teacher.employeeId || "",
      designation: teacher.designation || "",
      qualification: teacher.qualification || "",
      specialization: teacher.specialization?.join(", ") || "",
      phone: teacher.phone || "",
      emergencyPhone: teacher.emergencyPhone || "",
      panNo: teacher.panNo || "",
      bankAccountNo: teacher.bankAccountNo || "",
      ifscCode: teacher.ifscCode || "",
      basicSalary: teacher.basicSalary || "",
      joiningDate: teacher.joiningDate ? new Date(teacher.joiningDate).toISOString().split('T')[0] : "",
    });
    setShowForm(true);
  };

  const closeAddTeacher = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      employeeId: "",
      designation: "",
      qualification: "",
      specialization: "",
      phone: "",
      emergencyPhone: "",
      panNo: "",
      bankAccountNo: "",
      ifscCode: "",
      basicSalary: "",
      joiningDate: "",
    });
    setEditingTeacher(null);
    setShowForm(false);
  };

  const handleExport = () => {
    const headers = ["ID", "Name", "Email", "Status", "Joined Date"];
    const csvData = filteredTeachers.map(t => [
      t._id,
      `"${t.name || ""}"`,
      `"${t.email || ""}"`,
      t.status,
      t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-GB") : ""
    ].join(","));
    
    const blob = new Blob([headers.join(",") + "\n" + csvData.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teachers_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast("Teachers exported successfully! 📄", "success");
  };

  /** --------------------- Effects --------------------- **/
  useEffect(() => {
    loadTeachers();
  }, []);

  useEffect(() => {
    localStorage.setItem("teacherFilter", statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, statusFilter, searchTerm]);

  /** --------------------- Filtered & Paginated Data --------------------- **/
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesStatus =
      statusFilter === "all" || teacher.status === statusFilter;
    const matchesSearch =
      teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const counts = {
    all: teachers.length,
    active: teachers.filter((t) => t.status === "active").length,
    inactive: teachers.filter((t) => t.status === "inactive").length,
  };

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /** --------------------- Render --------------------- **/
  return (
    <div className="space-y-6 pb-8 animate-fadeIn">
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-blue-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-blue-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Teacher Management</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage institute faculty members and their accounts.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-sm"
          >
            <FiDownload />
            <span>Export</span>
          </button>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-xl font-bold shadow-md shadow-blue-500/30 transition-all hover:-translate-y-0.5 active:scale-95 text-sm"
            >
              <FaUserPlus />
              <span>Add Teacher</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl p-5 shadow-sm border border-blue-100/60 flex items-center gap-4 transition-all hover:shadow-[0_8px_30px_rgb(59,130,246,0.1)] hover:-translate-y-1 duration-300 group">
          <div className="w-12 h-12 rounded-xl bg-blue-100/80 flex items-center justify-center text-blue-600 text-xl shadow-inner group-hover:scale-110 transition-transform">
            <FaUsers />
          </div>
          <div>
            <p className="text-slate-600 text-[11px] font-black uppercase tracking-wider mb-0.5">Total Teachers</p>
            <h3 className="text-3xl font-black text-slate-800">{counts.all}</h3>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-emerald-50/50 rounded-2xl p-5 shadow-sm border border-emerald-100/60 flex items-center gap-4 transition-all hover:shadow-[0_8px_30px_rgb(16,185,129,0.1)] hover:-translate-y-1 duration-300 group">
          <div className="w-12 h-12 rounded-xl bg-emerald-100/80 flex items-center justify-center text-emerald-600 text-xl shadow-inner group-hover:scale-110 transition-transform">
            <FaUserCheck />
          </div>
          <div>
            <p className="text-slate-600 text-[11px] font-black uppercase tracking-wider mb-0.5">Active Faculty</p>
            <h3 className="text-3xl font-black text-slate-800">{counts.active}</h3>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-rose-50/50 rounded-2xl p-5 shadow-sm border border-rose-100/60 flex items-center gap-4 transition-all hover:shadow-[0_8px_30px_rgb(244,63,94,0.1)] hover:-translate-y-1 duration-300 group">
          <div className="w-12 h-12 rounded-xl bg-rose-100/80 flex items-center justify-center text-rose-600 text-xl shadow-inner group-hover:scale-110 transition-transform">
            <FaUserTimes />
          </div>
          <div>
            <p className="text-slate-600 text-[11px] font-black uppercase tracking-wider mb-0.5">Inactive / On Leave</p>
            <h3 className="text-3xl font-black text-slate-800">{counts.inactive}</h3>
          </div>
        </div>
      </div>

      {/* Main Data Section */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-slate-200 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-50/50">
          
          {/* Search */}
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

          {/* Pill Filters */}
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

        {/* Data Table */}
        <DataGrid
          data={paginatedTeachers}
          keyExtractor={(t) => t._id}
          isLoading={loading}
          emptyStateMessage="No teachers found"
          emptyStateSubMessage="Try adjusting your filters or search terms."
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          setCurrentPage={setCurrentPage}
          columns={[
            {
              header: "Teacher Info",
              accessor: "name",
              sortable: true,
              render: (teacher: any) => {
                const initials = teacher?.name?.substring(0, 2)?.toUpperCase() ?? "??";
                return (
                  <div className="flex items-center gap-3">
                    {teacher.profileImage ? (
                      <img 
                        src={teacher.profileImage} 
                        alt={teacher.name} 
                        className="w-8 h-8 rounded-full object-cover shadow-sm ring-2 ring-white"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        {initials}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                        {teacher.name || "Unnamed"}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        ID: {teacher._id?.slice(-6).toUpperCase()}
                      </p>
                    </div>
                  </div>
                );
              }
            },
            {
              header: "Contact",
              accessor: "email",
              sortable: true,
              render: (teacher: any) => (
                <span className="text-xs text-slate-600 font-medium">{teacher.email}</span>
              )
            },
            {
              header: "Joined Date",
              accessor: "createdAt",
              sortable: true,
              render: (teacher: any) => (
                <span className="text-xs text-slate-600 font-medium">
                  {teacher.createdAt
                    ? new Date(teacher.createdAt).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })
                    : "N/A"}
                </span>
              )
            },
            {
              header: "Status",
              accessor: "status",
              sortable: true,
              render: (teacher: any) => (
                <span
                  className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    teacher.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {teacher.status}
                </span>
              )
            },
            {
              header: "Actions",
              render: (teacher: any) => {
                const isLoading = actionLoading === teacher._id;
                return (
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => viewTeacher(teacher)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="View Details"
                    >
                      <FiEye size={16} />
                    </button>
                    <button
                      onClick={() => editTeacher(teacher)}
                      className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                      title="Edit Teacher"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => toggleTeacher(teacher)}
                      disabled={isLoading}
                      className={`p-1.5 rounded-lg transition-all ${
                        teacher.status === "active"
                          ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                      }`}
                      title={teacher.status === "active" ? "Deactivate Account" : "Activate Account"}
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      ) : teacher.status === "active" ? (
                        <FiToggleLeft size={16} />
                      ) : (
                        <FiToggleRight size={16} />
                      )}
                    </button>
                    <button
                      onClick={() => deleteTeacher(teacher)}
                      disabled={isLoading}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete Teacher"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <FiTrash2 size={16} />
                      )}
                    </button>
                  </div>
                );
              }
            }
          ]}
        />
      </div>

      {/* Modals */}
      {showForm && (
        <AddTeacherModal
          form={form}
          setForm={setForm}
          onSave={addTeacher}
          onClose={closeAddTeacher}
          loading={actionLoading === "save"}
          isEdit={!!editingTeacher}
        />
      )}

      {showViewModal && selectedTeacher && (
        <ViewTeacherModal
          teacher={selectedTeacher}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </div>
  );
};

export default TeacherPanel;
