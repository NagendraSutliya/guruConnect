import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import { 
  MdSearch, 
  MdPerson, 
  MdHistory, 
  MdAttachMoney,
  MdCreditCard,
  MdCheckCircle,
  MdPrint
} from "react-icons/md";
import { useToast } from "../../../context/ToastContext";

export default function CollectFees() {
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [student, setStudent] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      const res = await api.get("/admin/finance/recent-activity");
      setActivity(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudentSummary = async (studentId: string) => {
    try {
      const res = await api.get(`/admin/finance/summary/${studentId}`);
      setSummary(res.data.data);
    } catch (err) {
      showToast("Failed to load fee summary", "error");
    }
  };

  const searchStudent = async () => {
    if (!search) return;
    setLoading(true);
    try {
      // Mocking or fetching student details
      const res = await api.get(`/admin/students/search?q=${search}`);
      if (res.data.data.length > 0) {
        const found = res.data.data[0];
        setStudent(found);
        fetchStudentSummary(found._id);
      } else {
        showToast("No student found", "error");
        setStudent(null);
        setSummary(null);
      }
    } catch (err) {
      showToast("Search failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async () => {
    if (!student || !amount) return;
    setLoading(true);
    try {
      await api.post("/admin/finance/collect", {
        studentId: student._id,
        amount,
        method,
        date: new Date()
      });
      showToast("Payment recorded successfully!", "success");
      setAmount("");
      fetchStudentSummary(student._id);
      fetchRecentActivity();
    } catch (err) {
      showToast("Payment failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 space-y-8 animate-fadeIn">
      
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-emerald-100 via-white to-teal-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-emerald-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <MdAttachMoney className="text-emerald-600" />
            Collect Fees
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Record student payments and issue receipts.</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm w-full md:w-auto">
          <MdSearch size={20} className="text-slate-400 ml-2" />
          <input 
            placeholder="Search by ID or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none font-semibold text-slate-700 w-full md:w-56 text-sm"
          />
          <button 
            onClick={searchStudent}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
          >
            Find
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Student Info */}
        <div className="space-y-6">
          {student ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-8 animate-slideUp">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-[2.5rem] bg-slate-100 flex items-center justify-center text-slate-400">
                  <MdPerson size={48} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800">{student.name}</h2>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Class {student.classId?.name || 'N/A'}</p>
                  <p className="text-slate-400 text-[10px] font-bold mt-1">ID: {student.studentId || 'GC-10293'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Due</p>
                  <p className="text-xl font-black text-slate-800">₹{summary?.totalDue || 0}</p>
                </div>
                <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100">
                  <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1">Last Paid</p>
                  <p className="text-xl font-black text-orange-700">₹{summary?.lastPayment?.amount || 0}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-widest">
                  <span>Fee Breakdown</span>
                  <MdHistory size={16} className="text-slate-400" />
                </div>
                <div className="space-y-2">
                  {summary?.structure?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 text-sm">
                      <span className="text-slate-500 font-medium">{item.name} <span className="text-[8px] uppercase opacity-60">({item.type})</span></span>
                      <span className="text-slate-900 font-bold">₹{item.amount}</span>
                    </div>
                  ))}
                  {(!summary?.structure || summary.structure.length === 0) && (
                    <p className="text-[10px] text-slate-400 font-bold italic py-4">No fee structure defined for this class.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-6">
                <MdSearch size={32} />
              </div>
              <h3 className="text-slate-800 font-black mb-2 uppercase tracking-tight">No Student Selected</h3>
              <p className="text-slate-400 text-xs font-medium leading-relaxed max-w-xs">
                Search for a student using their name or ID to view their balance and record a payment.
              </p>
            </div>
          )}
        </div>

        {/* Right: Payment Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdCreditCard size={16} className="text-emerald-500" />
              Payment Transaction
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1">Payment Amount (₹)</label>
                <input 
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-3xl font-black text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-all placeholder:text-slate-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {['cash', 'online', 'cheque'].map((m) => (
                    <button 
                      key={m}
                      onClick={() => setMethod(m)}
                      className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        method === m 
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' 
                        : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button 
                  onClick={processPayment}
                  disabled={loading || !student || !amount}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-30 active:scale-[0.98]"
                >
                  <MdCheckCircle size={20} />
                  Complete Transaction
                </button>
                <button 
                  disabled={!student}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all"
                >
                  <MdPrint size={20} />
                  Print Receipt
                </button>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100">
            <h4 className="text-emerald-800 font-bold text-xs uppercase tracking-widest mb-3">Recent Activity</h4>
            <div className="space-y-3">
              {activity.map((log, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/60 rounded-xl animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <MdCheckCircle size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{log.studentId?.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{new Date(log.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-600">₹{log.amount}</span>
                </div>
              ))}
              {activity.length === 0 && (
                <p className="text-[10px] text-slate-400 text-center py-4 font-bold uppercase tracking-widest">No recent payments</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
