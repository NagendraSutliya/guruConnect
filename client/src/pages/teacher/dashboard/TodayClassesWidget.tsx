import { FiClock, FiMapPin, FiBookOpen, FiArrowRight } from "react-icons/fi";

const TodayClassesWidget = () => {
  const classes = [
    { subject: "Mathematics", class: "10A", time: "09:00 AM", status: "completed" },
    { subject: "Physics", class: "11B", time: "11:00 AM", status: "current" },
    { subject: "Chemistry", class: "12A", time: "02:00 PM", status: "upcoming" },
  ];

  return (
    <div className="bg-white/70 backdrop-blur-md border border-white/20 p-6 rounded-[2rem] shadow-sm transition-all hover:shadow-xl h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-black text-slate-800 tracking-tight">Today's Ledger</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">3 Scheduled Sessions</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
          <FiClock size={20} />
        </div>
      </div>

      <div className="space-y-4">
        {classes.map((cls, index) => {
          const isCurrent = cls.status === "current";
          return (
            <div 
              key={index} 
              className={`relative flex items-center gap-4 p-4 rounded-2xl transition-all border ${
                isCurrent 
                  ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100 -translate-y-1 scale-[1.02]" 
                  : "bg-slate-50/50 border-slate-100 hover:bg-white hover:border-slate-200"
              }`}
            >
              {/* Status Marker */}
              <div className={`w-1 h-10 rounded-full ${isCurrent ? "bg-white/40" : "bg-slate-200"}`} />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <FiBookOpen size={12} className={isCurrent ? "text-indigo-200" : "text-indigo-500"} />
                  <p className={`text-xs font-black uppercase tracking-wider truncate ${isCurrent ? "text-white" : "text-slate-800"}`}>
                    {cls.subject}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <FiMapPin size={10} className={isCurrent ? "text-indigo-200" : "text-slate-400"} />
                    <span className={`text-[10px] font-bold ${isCurrent ? "text-indigo-100" : "text-slate-500"}`}>Class {cls.class}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiClock size={10} className={isCurrent ? "text-indigo-200" : "text-slate-400"} />
                    <span className={`text-[10px] font-bold ${isCurrent ? "text-indigo-100" : "text-slate-500"}`}>{cls.time}</span>
                  </div>
                </div>
              </div>

              {isCurrent && (
                <div className="bg-white/20 p-2 rounded-xl text-white backdrop-blur-sm animate-pulse">
                  <FiArrowRight />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button className="w-full mt-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200 transition-all active:scale-95">
        View Full Schedule
      </button>
    </div>
  );
};

export default TodayClassesWidget;
