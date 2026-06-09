import { FiMessageCircle, FiMail, FiPhone, FiHelpCircle, FiFileText } from "react-icons/fi";

const StudentHelpPanel = () => {
  return (
    <div className="space-y-2 pb-6 animate-fade-in">
      
      {/* 1. SYNCED STICKY HEADER */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-indigo-100 to-purple-100 backdrop-blur-xl rounded-xl -mx-6 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 shadow-sm">
        <div>
           <h1 className="text-xl font-black text-blue-700 tracking-tight leading-none">Support Hub</h1>
           <p className="text-[10px] font-bold text-slate-400 uppercase mt-1.5 tracking-widest">Help Center & Institutional Support</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-gradient-to-r from-indigo-700 to-purple-700 rounded-xl text-white shadow-xl shadow-slate-200 flex items-center gap-4">
              <div className="text-right border-r border-white/10 pr-4">
                 <p className="text-[9px] font-black text-slate-200 uppercase leading-none">Support</p>
                 <h4 className="text-sm font-black text-emerald-400 leading-none mt-1">ONLINE</h4>
              </div>
              <div className="text-right">
                 <p className="text-[9px] font-black text-slate-200 uppercase leading-none">Response</p>
                 <h4 className="text-sm font-black text-white leading-none mt-1">24H</h4>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Contact Channels */}
        <div className="lg:col-span-2 space-y-2">
           <div className="card-clean p-6 bg-white border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-2 h-2 rounded-full bg-indigo-600 shadow-sm" />
                 <h3 className="bg-blue-500 rounded-full px-4 py-1 text-[10px] font-black text-white uppercase tracking-widest">Connect with Support</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[
                    { label: "Technical Support", val: "support@guruconnect.com", icon: FiMail, desc: "For portal & login issues" },
                    { label: "Academic Help", val: "academic@guruconnect.com", icon: FiBookOpen, desc: "For course & syllabus queries" },
                    { label: "Helpline", val: "+91 800-456-7890", icon: FiPhone, desc: "Direct institutional support" },
                    { label: "Live Chat", val: "Start Conversation", icon: FiMessageCircle, desc: "Talk to a student counselor", action: true },
                 ].map((item, i) => (
                    <div key={i} className="px-4 py-2 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-indigo-200 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all group cursor-pointer">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all">
                             <item.icon size={20} />
                          </div>
                          <div className="flex-1">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                             <h4 className={`text-sm font-black mt-1 ${item.action ? 'text-indigo-600' : 'text-slate-800'}`}>{item.val}</h4>
                             <p className="text-[10px] font-medium text-slate-400 mt-1">{item.desc}</p>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* FAQ Section Placeholder */}
           <div className="card-clean p-6 bg-white border-slate-200">
              <div className="flex items-center gap-3 mb-5">
                 <div className="w-2 h-2 rounded-full bg-indigo-600 shadow-sm" />
                 <h3 className="bg-blue-500 rounded-full px-4 py-1 text-[10px] font-black text-white uppercase tracking-widest">Frequent Knowledge Base</h3>
              </div>
              <div className="space-y-3">
                 {[
                    "How do I download my digital ID?",
                    "Where can I find the exam syllabus?",
                    "How to submit online feedback?",
                    "Resetting institutional credentials"
                 ].map((q, i) => (
                    <div key={i} className="px-4 py-2 rounded-xl border border-slate-50 bg-white flex items-center justify-between hover:border-indigo-100 transition-all cursor-pointer group">
                       <div className="flex items-center gap-3">
                          <FiHelpCircle className="text-slate-300 group-hover:text-indigo-500 transition-all" size={16} />
                          <span className="text-xs font-black text-slate-600 group-hover:text-slate-800">{q}</span>
                       </div>
                       <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all">
                          <FiChevronRight size={14} />
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Documentation Sidebar */}
        <div className="lg:col-span-1">
           <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden h-full group shadow-xl">
              <div className="relative z-10">
                 <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 border border-indigo-500/30">
                    <FiFileText size={24} />
                 </div>
                 <h4 className="text-lg font-black tracking-tight uppercase leading-tight">Student Manuals</h4>
                 <div className="space-y-4 mt-8">
                    {[
                      "Portal Navigation Guide",
                      "Academic Integrity Policy",
                      "Examination Protocol",
                      "Digital Privacy Statement"
                    ].map((step, sIdx) => (
                      <div key={sIdx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                         <p className="text-slate-400 text-[11px] font-medium leading-relaxed group-hover:text-white transition-all">{step}</p>
                         <FiDownload size={14} className="text-slate-600 group-hover:text-indigo-400 transition-all" />
                      </div>
                    ))}
                 </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHelpPanel;
import { FiBookOpen, FiDownload, FiChevronRight } from "react-icons/fi";
