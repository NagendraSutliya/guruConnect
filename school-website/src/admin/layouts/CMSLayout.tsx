import { Outlet, NavLink } from "react-router-dom";
import { 
  MdDashboard, 
  MdWeb, 
  MdHistory, 
  MdAssignment, 
  MdSchool, 
  MdStars, 
  MdPhotoLibrary,
  MdExitToApp,
  MdArrowBack
} from "react-icons/md";

const CMSLayout = () => {
  const menuItems = [
    { name: "Hero Banner", path: "/cms-admin/hero", icon: <MdWeb size={20} /> },
    { name: "About Content", path: "/cms-admin/about", icon: <MdHistory size={20} /> },
    { name: "Admissions CMS", path: "/cms-admin/admissions", icon: <MdAssignment size={20} /> },
    { name: "Academics CMS", path: "/cms-admin/academics", icon: <MdSchool size={20} /> },
    { name: "Achievements CMS", path: "/cms-admin/achievements", icon: <MdStars size={20} /> },
    { name: "Media Hub (Gallery)", path: "/cms-admin/gallery", icon: <MdPhotoLibrary size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* CMS Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-xl shadow-slate-200/50 z-20">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <MdWeb size={24} />
             </div>
             <div>
                <h1 className="font-black text-slate-800 tracking-tight leading-none">CMS PORTAL</h1>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">Website Editor</p>
             </div>
          </div>
          
          <a 
            href="/" 
            className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]"
          >
            <MdArrowBack />
            Back to Website
          </a>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
           <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 mt-2">Content Sections</p>
           {menuItems.map((item) => (
             <NavLink
               key={item.path}
               to={item.path}
               className={({ isActive }) =>
                 `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm
                 ${isActive 
                   ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 translate-x-2" 
                   : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                 }`
               }
             >
               {item.icon}
               {item.name}
             </NavLink>
           ))}
        </nav>

        <div className="p-6 border-t border-slate-100">
           <button className="flex items-center gap-3 w-full p-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-sm">
              <MdExitToApp size={20} />
              Logout Editor
           </button>
        </div>
      </aside>

      {/* Main CMS Area */}
      <main className="flex-1 overflow-y-auto bg-slate-50 relative">
        <div className="p-8 max-w-[1200px] mx-auto">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CMSLayout;
