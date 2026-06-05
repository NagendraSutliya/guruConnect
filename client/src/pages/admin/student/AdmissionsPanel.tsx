import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import { useToast } from "../../../context/ToastContext";
import type { Admission, AdmissionFormData } from "../../../types/admin/student";
import {
  FiEdit,
  FiEye,
  FiSearch,
  FiTrash2,
  FiX,
  FiUserPlus,
  FiDownload,
  FiCheckCircle,
  FiPrinter,
  FiCheck,
  FiCopy
} from "react-icons/fi";
import {  FaUserCheck, FaUsers } from "react-icons/fa";
import AddAdmissionModal from "../../../components/admin/modals/AddAdmissionModal";
import ViewAdmissionModal from "../../../components/admin/modals/ViewAdmissionModal";
import Pagination from "../../../components/common/Pagination";

const AdmissionsPanel = () => {
  const { showToast } = useToast();
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAdmission, setEditingAdmission] = useState<Admission | null>(null);
  const [form, setForm] = useState<AdmissionFormData>({
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
    parentEmail: "",
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
    aadharNo: "",
  });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "confirmed"
  >(() => (localStorage.getItem("admissionFilter") as any) || "all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [newAdmissionCreds, setNewAdmissionCreds] = useState<{
    email: string;
    password: string;
  } | null>(null);


  useEffect(() => {
  if (showViewModal) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [showViewModal]);

  // Load admissions
  const loadAdmissions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/admissions");
      setAdmissions(res.data.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load admissions ❌", "error");
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
    loadAdmissions();
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

  // Add or edit admission
  const saveAdmission = async () => {
    if (!form.name || !form.email || !form.classId || !form.admissionNo) {
      return showToast("Please fill all required fields (Name, Email, Admission No, Class) ⚠️", "warn");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return showToast("Please enter a valid student email address ⚠️", "warn");
    }

    if (form.parentEmail && !emailRegex.test(form.parentEmail)) {
      return showToast("Please enter a valid parent email address ⚠️", "warn");
    }

    if (form.phone && form.phone.length !== 10) {
      return showToast("Student phone number must be 10 digits ⚠️", "warn");
    }

    if (form.parentPhone && form.parentPhone.length !== 10) {
      return showToast("Parent phone number must be 10 digits ⚠️", "warn");
    }

    try {
      setActionLoading("save");

      if (editingAdmission) {
        await api.put(`/admin/admissions/${editingAdmission._id}`, form);
        showToast("Admission updated ✏️", "success");
      } else {
        await api.post("/admin/admissions", form);
        showToast("Admission drafted successfully ✅", "success");
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
        aadharNo: "",
        phone: "",
      });
      setEditingAdmission(null);
      setShowForm(false);
      loadAdmissions();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Operation failed ❌", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete admission
  const deleteAdmission = async (admission: Admission) => {
    if (!confirm(`Delete ${admission.name}? This cannot be undone.`)) return;

    try {
      setActionLoading(admission._id);
      await api.delete(`/admin/admissions/${admission._id}`);
      setAdmissions((prev) => prev.filter((s) => s._id !== admission._id));
      showToast("Admission deleted 🗑️", "success");
    } catch (err) {
      showToast("Delete failed ❌", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Confirm Admission
  const confirmAdmission = async (admission: Admission) => {
    if (!confirm(`Are you sure you want to confirm admission for ${admission.name}? This will create a permanent student account.`)) return;
    
    try {
      setActionLoading(admission._id);

      const res = await api.patch(`/admin/admissions/${admission._id}/confirm`);
      const creds = res.data.data.studentCreds;
      setNewAdmissionCreds({ email: creds.email, password: creds.password });
      showToast("Admission Confirmed and Student Account created!", "success");

      loadAdmissions();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to confirm admission ❌", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const viewAdmission = (admission: Admission) => {
    setSelectedAdmission(admission);
    setShowViewModal(true);
  };

  const editAdmission = (admission: Admission) => {
    setEditingAdmission(admission);
    setForm({
      name: admission.name,
      email: admission.email || "",
      password: "",
      rollNo: admission.rollNo || "",
      admissionNo: admission.admissionNo || "",
      enrollmentNo: admission.enrollmentNo || "",
      classId: admission.classId?._id || admission.classId || "",
      sectionId: admission.sectionId?._id || admission.sectionId || "",
      parentName: admission.parentName || "",
      parentPhone: admission.parentPhone || "",
      parentEmail: admission.parentEmail || "",
      phone: admission.phone || "",
      dob: admission.dob ? new Date(admission.dob).toISOString().split('T')[0] : "",
      admissionDate: admission.admissionDate ? new Date(admission.admissionDate).toISOString().split('T')[0] : "",
      gender: admission.gender || "",
      category: admission.category || "",
      religion: admission.religion || "",
      nationality: admission.nationality || "Indian",
      bloodGroup: admission.bloodGroup || "",
      previousSchool: admission.previousSchool || "",
      previousClass: admission.previousClass || "",
      address: admission.address || "",
      aadharNo: admission.aadharNo || "",
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
      parentEmail: "",
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
      aadharNo: "",
      phone: "",
    });
    setEditingAdmission(null);
    setShowForm(false);
  };

  // Filter admissions
  const filteredAdmissions = admissions.filter((s) => {
    const matchesStatus =
      statusFilter === "all" || s.status?.toLowerCase() === statusFilter;
    const matchesSearch =
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const counts = {
    all: admissions.length,
    pending: admissions.filter((s) => s.status === "Pending").length,
    confirmed: admissions.filter((s) => s.status === "Confirmed").length,
  };

  const totalPages = Math.ceil(filteredAdmissions.length / itemsPerPage);
  const paginatedAdmissions = filteredAdmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    localStorage.setItem("admissionFilter", statusFilter);
    setCurrentPage(1);
  }, [statusFilter, searchTerm, itemsPerPage]);

  return (
    <div className="space-y-6 pb-8 animate-fadeIn">

      {showForm ? (
        <AddAdmissionModal
          form={form}
          setForm={setForm}
          onSave={saveAdmission}
          onClose={closeForm}
          loading={actionLoading === "save"}
          isEdit={!!editingAdmission}
          classes={classes}
          sections={sections}
        />
      ) : (
        <>
          {/* Credentials Banner */}
          {newAdmissionCreds && (
        <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-black tracking-tight mb-2 flex items-center gap-2">
                        <FiCheckCircle className="text-emerald-400" /> 
                        Admission Credentials Generated
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/20">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Email Address :</p>
                            <p className="font-mono font-bold">{newAdmissionCreds.email}</p>
                        </div>
                        <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/20">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Temporary Password :</p>
                            <p className="font-mono font-bold">{newAdmissionCreds.password}</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(`Email: ${newAdmissionCreds.email}\nPassword: ${newAdmissionCreds.password}`);
                            showToast("Copied to clipboard!", "success");
                        }}
                        className="flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black shadow-xl hover:scale-105 transition-transform active:scale-95"
                    >
                        <FiCopy /> Copy Both
                    </button>
                    <button
                        onClick={() => setNewAdmissionCreds(null)}
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
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Admission Processing</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage admission records, classes, and portal access.</p>
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
              <span>Add Admission</span>
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
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending Processing</p>
             <h3 className="text-3xl font-black text-slate-800">{counts.pending}</h3>
           </div>
        </div>

         <div className="bg-gradient-to-br from-white to-purple-50/50 rounded-2xl p-5 shadow-sm border border-purple-100/60 flex items-center gap-4 transition-all hover:shadow-[0_8px_30px_rgb(168,85,247,0.1)] hover:-translate-y-1 duration-300 group">
          <div className="w-12 h-12 rounded-xl bg-purple-100/80 flex items-center justify-center text-purple-600 text-xl shadow-inner group-hover:scale-110 transition-transform">
            <FaUsers />
          </div>
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Confirmed Enrolled</p>
             <h3 className="text-3xl font-black text-slate-800">{counts.confirmed}</h3>
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
            {(["all", "pending", "confirmed"] as const).map((status) => {
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
                <th className="px-5 py-3">Admission Info</th>
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
                      <p className="text-sm font-bold text-slate-500">Syncing Admission Data...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedAdmissions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <FiSearch size={24} className="text-slate-300" />
                    </div>
                    <p className="text-lg font-black text-slate-700">No admissions found</p>
                    <p className="text-sm font-medium mt-1">Try a different search term or filter.</p>
                  </td>
                </tr>
              ) : (
                paginatedAdmissions.map((s) => {
                  const isLoading = actionLoading === s._id;
                  const initials = s.name?.substring(0, 2).toUpperCase() || "??";

                  return (
                    <tr key={s._id} className="group hover:bg-slate-50/50 transition-colors duration-200">
                      {/* Admission Info */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                              {s.name || "Unnamed Admission"}
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
                          s.status === "Confirmed" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                        }`}>
                          {s.status || "Pending"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => window.open(`/admin/admissions/print/${s._id}`, "_blank")}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Print Admission Form"
                          >
                            <FiPrinter size={16} />
                          </button>
                          
                          {s.status !== "Confirmed" && (
                            <button
                              onClick={() => confirmAdmission(s)}
                              disabled={isLoading}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                              title="Confirm Admission"
                            >
                              {isLoading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <FiCheck size={16} />}
                            </button>
                          )}

                          <button
                            onClick={() => viewAdmission(s)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="View Profile"
                          >
                            <FiEye size={16} />
                          </button>

                          {s.status !== "Confirmed" && (
                            <button
                              onClick={() => editAdmission(s)}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                              title="Edit Record"
                            >
                              <FiEdit size={16} />
                            </button>
                          )}

                          <button
                            onClick={() => deleteAdmission(s)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Admission"
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
        {!loading && filteredAdmissions.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
      </>
      )}

      {/* Modals */}
      {showViewModal && selectedAdmission && (
        <ViewAdmissionModal
          admission={selectedAdmission}
          onClose={() => setShowViewModal(false)}
        />
      )}

   
    </div>
  );
};

export default AdmissionsPanel;
