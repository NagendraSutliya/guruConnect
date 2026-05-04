import { useState, useEffect } from "react";
import { 
  MdDashboard, 
  MdWeb, 
  MdHistory, 
  MdSpeed, 
  MdCheckCircle,
  MdArrowForward,
  MdImage,
  MdSettings,
  MdVisibility
} from "react-icons/md";
import { Link } from "react-router-dom";
import api from "../../api/axiosInstance";

export default function CMSDashboard() {
  const [stats, setStats] = useState({
    totalSections: 6,
    lastUpdate: "2 hours ago",
    contentHealth: "98%",
    activePromotions: 1
  });

  const pages = [
    { name: "Home / Hero", path: "/cms-admin/hero", status: "Published", lastEdit: "Today", completion: 100 },
    { name: "About Us", path: "/cms-admin/about", status: "Published", lastEdit: "Yesterday", completion: 90 },
    { name: "Admissions", path: "/cms-admin/admissions", status: "Draft", lastEdit: "3 days ago", completion: 65 },
    { name: "Academics", path: "/cms-admin/academics", status: "Published", lastEdit: "Today", completion: 100 },
    { name: "Achievements", path: "/cms-admin/achievements", status: "Published", lastEdit: "1 week ago", completion: 85 },
    { name: "Gallery", path: "/cms-admin/gallery", status: "Needs Update", lastEdit: "2 weeks ago", completion: 40 },
  ];

  return (
    <div className="py-6 space-y-10 animate-fadeIn text-slate-900">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight text-slate-800">Website CMS Portal</h2>
          <p className="text-slate-500 font-medium">Control your school's digital presence from one central command center.</p>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href="/" 
            target="_blank" 
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
          >
            <MdVisibility size={18} className="text-indigo-600" />
            View Live Site
          </a>
          <button className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
            <MdSettings size={20} />
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "CMS Sections", val: stats.totalSections, icon: <MdWeb />, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Last Activity", val: stats.lastEdit || "Just Now", icon: <MdHistory />, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Content Health", val: stats.contentHealth, icon: <MdSpeed />, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Live Promos", val: stats.activePromotions, icon: <MdCheckCircle />, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:border-indigo-200 transition-colors">
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-inner`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800 tracking-tight">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pages Management */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-xl font-black tracking-tight text-slate-800">Content Modules</h3>
           <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] bg-indigo-50 px-3 py-1 rounded-full">Synchronized with Production</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page, i) => (
            <Link 
              key={i} 
              to={page.path}
              className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                  <MdWeb size={24} />
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  page.status === 'Published' ? 'bg-emerald-50 text-emerald-600' : 
                  page.status === 'Draft' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {page.status}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-black tracking-tight text-slate-800">{page.name}</h4>
                
                <div className="space-y-2">
                   <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>Completion</span>
                      <span className="text-slate-800">{page.completion}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          page.completion === 100 ? 'bg-emerald-500' : 
                          page.completion > 50 ? 'bg-indigo-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${page.completion}%` }}
                      />
                   </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-slate-400">
                      <MdHistory size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Edited {page.lastEdit}</span>
                   </div>
                   <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <MdArrowForward size={18} />
                   </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Asset Manager Quick Access */}
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -mr-48 -mt-48 transition-all group-hover:bg-indigo-600/30" />
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300">
              <MdImage size={14} />
              Central Media Library
            </div>
            <h3 className="text-4xl font-black tracking-tight leading-tight">Manage Your Website <br />Assets in High Definition.</h3>
            <p className="text-slate-400 font-medium">Upload, crop, and optimize images for every section of your website automatically.</p>
            <button className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center gap-3">
              Open Asset Manager
              <MdArrowForward size={18} />
            </button>
          </div>
          <div className="relative aspect-video rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
             <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <MdWeb size={120} />
             </div>
             <div className="absolute inset-x-8 bottom-8 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-600 rounded-xl" />
                   <div>
                      <p className="text-[10px] font-black uppercase">campus_hero.jpg</p>
                      <p className="text-[9px] text-slate-400 font-bold">2.4 MB • 1920x1080</p>
                   </div>
                </div>
                <MdCheckCircle className="text-emerald-500" size={20} />
             </div>
          </div>
        </div>
      </div>

    </div>
  );
}
