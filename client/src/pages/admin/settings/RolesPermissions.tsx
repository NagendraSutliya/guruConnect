import { useState } from "react";
import { 
  MdSecurity, 
  MdAdd, 
  MdCheckCircle, 
  MdRadioButtonUnchecked, 
  MdInfoOutline,
  MdShield
} from "react-icons/md";

const ROLES = [
  { id: "admin", name: "Administrator", count: 1, color: "slate" },
  { id: "teacher", name: "Faculty / Teacher", count: 24, color: "indigo" },
  { id: "accountant", name: "Accountant", count: 2, color: "emerald" },
  { id: "librarian", name: "Librarian", count: 1, color: "orange" },
  { id: "student", name: "Student", count: 850, color: "blue" },
];

const PERMISSIONS = [
  { module: "Academic", actions: ["View", "Create", "Edit", "Delete"] },
  { module: "Finance", actions: ["View", "Collect", "Refund", "Setup"] },
  { module: "Exams", actions: ["Schedule", "Upload Marks", "Generate Results"] },
  { module: "Inventory", actions: ["Add Stock", "Issue Item", "Purchase"] },
  { module: "Library", actions: ["Issue Book", "Return Book", "Manage Catalog"] },
];

export default function RolesPermissions() {
  const [selectedRole, setSelectedRole] = useState("teacher");

  return (
    <div className="py-6 space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-indigo-100 via-white to-slate-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-indigo-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <MdSecurity className="text-indigo-600" />
            Roles & Permissions
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Control access levels and module permissions across your staff.</p>
        </div>

        <button className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-100">
          <MdAdd size={20} />
          Create New Role
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Roles Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Defined Roles</h2>
            <MdInfoOutline size={16} className="text-slate-300" />
          </div>
          <div className="space-y-2">
            {ROLES.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`w-full group flex items-center justify-between p-4 rounded-3xl transition-all duration-300 ${
                  selectedRole === role.id 
                  ? 'bg-white border-2 border-indigo-500 shadow-xl shadow-indigo-50/50' 
                  : 'bg-white/50 border border-slate-100 hover:bg-white hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                    selectedRole === role.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-400'
                  }`}>
                    <MdShield size={20} />
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-black transition-colors ${selectedRole === role.id ? 'text-slate-900' : 'text-slate-500'}`}>{role.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{role.count} Active Users</p>
                  </div>
                </div>
                {selectedRole === role.id && (
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Permissions Table */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-slate-900">Access Matrix</h3>
                <p className="text-xs text-slate-500 font-medium">Fine-tune what <span className="text-indigo-600 font-bold uppercase italic">{selectedRole}s</span> can do.</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all">Reset</button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700">Save Policy</button>
              </div>
            </div>

            <div className="p-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Module Name</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Permissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {PERMISSIONS.map((perm, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <span className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{perm.module} Management</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-wrap items-center justify-center gap-4">
                          {perm.actions.map((action, ai) => (
                            <button 
                              key={ai}
                              className="flex items-center gap-2 group/btn"
                            >
                              <div className="text-indigo-500">
                                {Math.random() > 0.3 ? <MdCheckCircle size={20} /> : <MdRadioButtonUnchecked size={20} className="text-slate-200 group-hover/btn:text-indigo-200" />}
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover/btn:text-indigo-600">{action}</span>
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                <MdInfoOutline size={20} />
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                <span className="text-slate-600 font-bold">Pro Tip:</span> Administrative roles have full system access by default. Use custom roles for specialized staff like Accountants or Librarians to maintain data integrity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
