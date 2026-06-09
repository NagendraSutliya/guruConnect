import { useState } from "react";
import { FiX, FiChevronLeft, FiChevronRight, FiCalendar, FiClock, FiMapPin } from "react-icons/fi";

interface Event {
  date: string;
  title: string;
  type: "holiday" | "event" | "exam";
  time?: string;
  location?: string;
}

const InstitutionCalendarModal = ({ onClose }: { onClose: () => void }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  const events: Event[] = [
    { date: "2026-05-01", title: "Labour Day", type: "holiday" },
    { date: "2026-05-15", title: "Annual Sports Meet", type: "event", time: "09:00 AM", location: "Main Ground" },
    { date: "2026-05-20", title: "Unit Test - I Begins", type: "exam" },
    { date: "2026-05-25", title: "Budh Purnima", type: "holiday" },
    { date: "2026-06-05", title: "World Environment Day", type: "event", time: "10:30 AM", location: "Assembly Hall" },
  ];

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="border-b border-r border-slate-100 bg-slate-50/50" />);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayEvents = events.filter(e => e.date === dateStr);
    const isToday = new Date().toISOString().slice(0, 10) === dateStr;
    const isSelected = selectedDate === dateStr;

    days.push(
      <div 
         key={d} 
         onClick={() => setSelectedDate(isSelected ? null : dateStr)}
         className={`border-b border-r border-slate-100 p-1.5 md:p-2 flex flex-col min-h-0 transition-all hover:bg-indigo-50/20 relative group cursor-pointer ${isToday ? "bg-indigo-50/60" : "bg-white"} ${isSelected ? "ring-inset ring-2 ring-indigo-500 z-10" : ""}`}
      >
        <span className={`text-[10px] md:text-xs font-bold w-5 h-5 md:w-6 md:h-6 shrink-0 flex items-center justify-center rounded-full mb-1 transition-colors ${isToday ? "bg-indigo-600 text-white shadow-md shadow-indigo-300" : isSelected ? "bg-indigo-100 text-indigo-700" : "text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-700"}`}>
          {d}
        </span>
        <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar min-h-0 pr-0.5 pointer-events-none">
          {dayEvents.map((e, idx) => (
            <div 
              key={idx} 
              className={`text-[7px] md:text-[8px] font-black uppercase tracking-tighter px-1 md:px-1.5 py-0.5 rounded truncate shadow-sm ${
                e.type === 'holiday' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 
                e.type === 'exam' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                'bg-emerald-50 text-emerald-600 border border-emerald-100'
              }`}
            >
              {e.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const remainingCells = 42 - days.length;
  for (let i = 0; i < remainingCells; i++) {
    days.push(<div key={`empty-end-${i}`} className="border-b border-r border-slate-100 bg-slate-50/50" />);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-fadeIn" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-scaleIn flex flex-col h-full max-h-[90vh] border border-white/60">
        
        {/* Header */}
        <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                <FiCalendar size={20} />
              </div>
              Institution Calendar
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 ml-13">
              Academic Year 2026-27 | Global Synchronized Schedule
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
               onClick={() => setCurrentDate(new Date())} 
               className="px-4 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100 shadow-sm"
            >
               Today
            </button>
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-lg transition-all text-slate-400 hover:text-indigo-600">
                <FiChevronLeft size={20} />
              </button>
              <div className="px-6 text-sm font-black text-slate-700 min-w-[140px] text-center uppercase tracking-widest">
                {monthName} {year}
              </div>
              <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-lg transition-all text-slate-400 hover:text-indigo-600">
                <FiChevronRight size={20} />
              </button>
            </div>
            
            <button onClick={onClose} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-400 shadow-sm">
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Calendar Grid */}
          <div className="flex-1 flex flex-col p-6 bg-slate-50/30">
            <div className="grid grid-cols-7 mb-2 shrink-0">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest pb-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 grid-rows-6 border-t border-l border-slate-100 rounded-xl overflow-hidden shadow-sm flex-1 bg-white">
              {days}
            </div>
          </div>

          {/* Side Panel: Upcoming Events */}
          <div className="w-80 bg-slate-50 border-l border-slate-100 flex flex-col shrink-0">
             <div className="p-6 border-b border-slate-200/60 flex items-center justify-between">
                <div>
                   <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1">
                      {selectedDate ? "Selected Date" : "Upcoming Events"}
                   </h3>
                   <p className="text-[10px] font-bold text-slate-400 tracking-tight">
                      {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : "Syncing with institutional registry"}
                   </p>
                </div>
                {selectedDate && (
                   <button onClick={() => setSelectedDate(null)} className="p-1.5 bg-slate-200/50 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors">
                      <FiX size={14} />
                   </button>
                )}
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {(() => {
                  const filteredEvents = selectedDate 
                    ? events.filter(e => e.date === selectedDate)
                    : events.filter(e => new Date(e.date) >= new Date());
                  
                  if (filteredEvents.length === 0) {
                     return (
                        <div className="flex flex-col items-center justify-center h-full text-center p-4">
                           <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-sm border border-slate-100 mb-3">
                              <FiCalendar size={20} />
                           </div>
                           <p className="text-xs font-bold text-slate-500">No events scheduled.</p>
                           <p className="text-[10px] text-slate-400 mt-1">This day is completely free.</p>
                        </div>
                     );
                  }

                  return filteredEvents.map((e, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm hover:border-indigo-200 transition-all group cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                         <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                           e.type === 'holiday' ? 'bg-rose-50 text-rose-600' : 
                           e.type === 'exam' ? 'bg-amber-50 text-amber-600' : 
                           'bg-emerald-50 text-emerald-600'
                         }`}>
                           {e.type}
                         </span>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                           {new Date(e.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                         </span>
                      </div>
                      <h4 className="text-xs font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{e.title}</h4>
                      {(e.time || e.location) && (
                        <div className="mt-3 flex flex-wrap gap-3">
                           {e.time && (
                             <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                                <FiClock size={10} className="text-indigo-500" />
                                {e.time}
                             </div>
                           )}
                           {e.location && (
                             <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                                <FiMapPin size={10} className="text-rose-500" />
                                {e.location}
                             </div>
                           )}
                        </div>
                      )}
                    </div>
                  ));
                })()}
             </div>
             
             <div className="p-6 bg-white border-t border-slate-100">
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                   System Online
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InstitutionCalendarModal;
