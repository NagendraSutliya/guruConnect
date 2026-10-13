import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { CheckCircle2, Ban } from "lucide-react";

export default function Institutes() {
  const [institutes, setInstitutes] = useState<any[]>([]);

  const fetchInstitutes = () => {
    api.get("/superadmin/institutes").then((res) => {
      setInstitutes(res.data.data);
    });
  };

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const toggleStatus = async (id: string) => {
    if(!confirm("Are you sure you want to toggle this institute's access?")) return;
    try {
      await api.patch(`/superadmin/institutes/${id}/toggle-status`);
      fetchInstitutes();
    } catch (err) {
      alert("Failed to toggle status");
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 m-0 tracking-tight">Registered Institutes</h1>
        <p className="text-gray-500 m-0">Manage all schools and tuition centers on the platform.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Institute Name</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Location/Board</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {institutes.map((inst) => (
                <tr key={inst._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-gray-900">{inst.instituteName}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{inst.ownerName || "N/A"}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase rounded-md">
                      {inst.instituteType}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <div>{inst.email}</div>
                    <div>{inst.phone}</div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <div>{inst.city || "-"}</div>
                    <div className="text-xs font-medium text-gray-400">{inst.board || ""}</div>
                  </td>
                  <td className="py-4 px-6">
                    {inst.isVerified ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md">
                        <CheckCircle2 size={14} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-md">
                        <Ban size={14} /> Blocked/Pending
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => toggleStatus(inst._id)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                        inst.isVerified 
                        ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50" 
                        : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {inst.isVerified ? "Block" : "Approve"}
                    </button>
                  </td>
                </tr>
              ))}
              {institutes.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">No institutes registered yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
