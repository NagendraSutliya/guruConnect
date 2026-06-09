import { useState, useEffect } from "react";
import api from "../../../api/axiosInstance";
import { 
  MdReceipt, 
  MdFilterList, 
  MdPrint, 
  MdDownload, 
  MdSearch,
  MdFiberManualRecord,
  MdChevronLeft,
  MdChevronRight
} from "react-icons/md";

export default function Invoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      // Mocking fetch
      const res = await api.get("/admin/finance/invoices");
      setInvoices(res.data.data);
    } catch (err) {
      console.error(err);
      // Fallback mock data for UI demo
      setInvoices([
        { _id: "1", invoiceNo: "INV-2024-001", studentName: "Aryan Sharma", amount: 2500, status: "Paid", date: "2024-05-01", method: "Cash" },
        { _id: "2", invoiceNo: "INV-2024-002", studentName: "Meera Reddy", amount: 1200, status: "Pending", date: "2024-05-02", method: "Online" },
        { _id: "3", invoiceNo: "INV-2024-003", studentName: "Kabir Singh", amount: 5000, status: "Paid", date: "2024-05-03", method: "Cheque" },
        { _id: "4", invoiceNo: "INV-2024-004", studentName: "Sanya Gupta", amount: 800, status: "Cancelled", date: "2024-05-04", method: "Cash" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || 'paid';
    switch (s) {
      case 'paid': return 'text-emerald-500 bg-emerald-50';
      case 'pending': return 'text-orange-500 bg-orange-50';
      case 'cancelled': return 'text-red-500 bg-red-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  return (
    <div className="py-6 space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-slate-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <MdReceipt className="text-indigo-900" />
            Invoices
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage and track all institutional transactions.</p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <MdFilterList size={18} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-100">
            <MdDownload size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Collected", val: "₹45,290", change: "+12.5%", color: "indigo" },
          { label: "Pending Dues", val: "₹12,400", change: "-2.4%", color: "orange" },
          { label: "Invoices Generated", val: "142", change: "+5", color: "emerald" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900">{stat.val}</h3>
            </div>
            <div className={`text-[10px] font-bold px-2 py-1 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-black text-slate-800">Transaction History</h2>
          <div className="relative group w-full md:w-80">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600" />
            <input 
              placeholder="Search invoice or student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 outline-none focus:bg-white focus:ring-4 focus:ring-slate-100 transition-all font-medium text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice No</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    Synchronizing Transactions...
                  </td>
                </tr>
              ) : invoices.length > 0 ? (
                invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{inv.invoiceNo}</span>
                      <p className="text-[10px] text-slate-400 font-medium">{new Date(inv.date).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-700">{inv.studentId?.name || 'Unknown Student'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-slate-900">₹{inv.amount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-tighter">
                        {inv.method}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${getStatusColor(inv.status)}`}>
                        <MdFiberManualRecord size={8} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{inv.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                          <MdPrint size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                          <MdDownload size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    No transactions found in this cycle.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-400 font-medium tracking-tight">Showing 1-10 of 142 results</p>
          <div className="flex gap-2">
            <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-30">
              <MdChevronLeft size={20} />
            </button>
            <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-30">
              <MdChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
