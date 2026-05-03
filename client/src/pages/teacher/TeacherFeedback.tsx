import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { 
  FiMessageSquare, 
  FiSearch, 
  FiSmile, 
  FiMeh, 
  FiFrown, 
  FiCalendar, 
  FiUser, 
  FiLayers,
  FiActivity
} from "react-icons/fi";

const TeacherFeedback = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/teacher/feedback/all", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("teacherToken"),
        },
      })
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const getMoodConfig = (mood: string) => {
    switch (mood) {
      case "positive": return { color: "emerald", icon: <FiSmile /> };
      case "negative": return { color: "rose", icon: <FiFrown /> };
      default: return { color: "amber", icon: <FiMeh /> };
    }
  };

  const filteredData = data.filter((f: any) => 
    f.message.toLowerCase().includes(search.toLowerCase()) ||
    f.teacherName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Premium Header */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-blue-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-blue-200 shadow-sm backdrop-blur-md bg-white/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <FiMessageSquare className="text-indigo-600" />
              Feedback Analytics
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Review sentiments and messages from the student body.</p>
          </div>
          
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <FiSearch size={16} />
            </div>
            <input
              type="text"
              placeholder="Filter feedback records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Main Ledger Section */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[400px] relative">
        {loading && (
          <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Parsing Sentiment Data...</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-slate-100">
                <th className="px-8 py-4">Submission Profile</th>
                <th className="px-8 py-4">Academic Group</th>
                <th className="px-8 py-4 w-1/3">Detailed Message</th>
                <th className="px-8 py-4 text-center">Sentiment</th>
                <th className="px-8 py-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 border border-slate-100">
                        <FiMessageSquare size={32} />
                      </div>
                      <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No feedback signals detected</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((f: any) => {
                  const config = getMoodConfig(f.mood);
                  return (
                    <tr key={f._id} className="group hover:bg-indigo-50/30 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-[10px] shadow-sm">
                            <FiUser />
                          </div>
                          <p className="font-bold text-slate-700 text-sm">{f.teacherName}</p>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                          <FiLayers size={10} /> {f.classOrBatch}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">{f.message}</p>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-${config.color}-50 text-${config.color}-600 border border-${config.color}-100`}>
                          {config.icon}
                          {f.mood}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex flex-col items-end">
                           <span className="text-xs font-bold text-slate-700">{new Date(f.createdAt).toLocaleDateString()}</span>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(f.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-[2rem] flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <FiSmile size={24} />
             </div>
             <div>
                <p className="text-2xl font-black text-emerald-900 leading-none">{data.filter((f: any) => f.mood === 'positive').length}</p>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Positive Signals</p>
             </div>
          </div>
          <div className="bg-amber-50/50 border border-amber-100 p-6 rounded-[2rem] flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <FiMeh size={24} />
             </div>
             <div>
                <p className="text-2xl font-black text-amber-900 leading-none">{data.filter((f: any) => f.mood !== 'positive' && f.mood !== 'negative').length}</p>
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mt-1">Neutral Signals</p>
             </div>
          </div>
          <div className="bg-rose-50/50 border border-rose-100 p-6 rounded-[2rem] flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <FiFrown size={24} />
             </div>
             <div>
                <p className="text-2xl font-black text-rose-900 leading-none">{data.filter((f: any) => f.mood === 'negative').length}</p>
                <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mt-1">Negative Signals</p>
             </div>
          </div>
      </div>
    </div>
  );
};

export default TeacherFeedback;
