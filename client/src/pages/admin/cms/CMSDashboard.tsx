import { useState, useEffect } from "react";
import { 
  MdWeb, 
  MdHistory, 
  MdSpeed, 
  MdCheckCircle,
  MdArrowForward,
  MdImage,
  MdVisibility
} from "react-icons/md";
import { Link } from "react-router-dom";
import api from "../../../api/axiosInstance";
import { useToast } from "../../../context/ToastContext";

const calculateCompletion = (id: string, content: any) => {
  const steps: string[] = [];
  if (!content) return { completion: 0, missingSteps: ["Content not initialized"] };

  let total = 5;

  switch (id) {
    case 'home':
      if (!content.hero?.backgroundImage) steps.push("Upload Hero Image");
      if (!content.hero?.title) steps.push("Set Hero Title");
      if (!content.features?.items || content.features.items.length === 0) steps.push("Add at least 1 Feature");
      if (!content.stats || content.stats.length === 0) steps.push("Add at least 1 Statistic");
      if (!content.faqs?.items || content.faqs.items.length === 0) steps.push("Add at least 1 FAQ");
      break;
    case 'about':
      if (!content.bannerImage) steps.push("Upload Banner Image");
      if (!content.mainTitle) steps.push("Set Main Title");
      if (!content.mission) steps.push("Set Mission Statement");
      if (!content.vision) steps.push("Set Vision Statement");
      if (!content.staff || content.staff.length === 0) steps.push("Add Core Team Members");
      break;
    case 'admissions':
      if (!content.bannerImage) steps.push("Upload Banner Image");
      if (!content.steps || content.steps.length === 0) steps.push("Add Application Steps");
      if (!content.faqs || content.faqs.length === 0) steps.push("Add FAQs");
      if (!content.matrix || content.matrix.length === 0) steps.push("Fill Eligibility Matrix");
      if (!content.documents || content.documents.length === 0) steps.push("Add Required Documents");
      break;
    case 'academics':
      if (!content.bannerImage) steps.push("Upload Banner Image");
      if (!content.phases || content.phases.length === 0) steps.push("Add Learning Phases");
      if (!content.labImage) steps.push("Upload Infrastructure Image");
      if (!content.infrastructureItems || content.infrastructureItems.length === 0) steps.push("Add Infrastructure Items");
      if (!content.departments || content.departments.length === 0) steps.push("Add Departments");
      break;
    case 'achievements':
      total = 4;
      if (!content.bannerImage) steps.push("Upload Banner Image");
      if (!content.stats || content.stats.length === 0) steps.push("Add Key Statistics");
      if (!content.toppers || content.toppers.length === 0) steps.push("Add Board Toppers");
      if (!content.awards || content.awards.length === 0) steps.push("Add Awards");
      break;
    case 'gallery':
      total = 2;
      if (!content.bannerImage) steps.push("Upload Banner Image");
      if (!content.items || content.items.length === 0) steps.push("Add Gallery Images");
      break;
    case 'contact':
      if (!content.bannerImage) steps.push("Upload Banner Image");
      if (!content.addressDetail) steps.push("Set Campus Address");
      if (!content.phoneDetail) steps.push("Set Contact Phones");
      if (!content.emailDetail) steps.push("Set Contact Emails");
      if (!content.mapEmbedUrl) steps.push("Provide Map Embed URL");
      break;
  }

  const completed = total - steps.length;
  const completion = Math.round((Math.max(0, completed) / total) * 100);
  
  return { completion, missingSteps: steps };
};

export default function CMSDashboard() {
  const { showToast } = useToast();
  const [stats] = useState({
    totalSections: 7,
    lastUpdate: "Just Now",
    contentHealth: "100%",
    activePromotions: 1
  });

  const [pages, setPages] = useState([
    { id: "home", name: "Home / Landing Page", path: "/admin/cms/home", isEnabled: true, lastEdit: "Unknown", completion: 0, missingSteps: [] as string[] },
    { id: "about", name: "About Us", path: "/admin/cms/about", isEnabled: true, lastEdit: "Unknown", completion: 0, missingSteps: [] as string[] },
    { id: "admissions", name: "Admissions", path: "/admin/cms/admissions", isEnabled: true, lastEdit: "Unknown", completion: 0, missingSteps: [] as string[] },
    { id: "academics", name: "Academics", path: "/admin/cms/academics", isEnabled: true, lastEdit: "Unknown", completion: 0, missingSteps: [] as string[] },
    { id: "achievements", name: "Achievements", path: "/admin/cms/achievements", isEnabled: true, lastEdit: "Unknown", completion: 0, missingSteps: [] as string[] },
    { id: "gallery", name: "Gallery", path: "/admin/cms/gallery", isEnabled: true, lastEdit: "Unknown", completion: 0, missingSteps: [] as string[] },
    { id: "contact", name: "Contact", path: "/admin/cms/contact", isEnabled: true, lastEdit: "Unknown", completion: 0, missingSteps: [] as string[] },
  ]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get('/cms/all-status');
        if(res.data.success) {
          const dbStatus = res.data.data;
          setPages(prev => prev.map(p => {
            const dbEntry = dbStatus.find((d: any) => d.section === p.id);
            if(dbEntry) {
                const { completion, missingSteps } = calculateCompletion(p.id, dbEntry.content);
                return { ...p, isEnabled: dbEntry.isEnabled, lastEdit: new Date(dbEntry.updatedAt).toLocaleDateString(), completion, missingSteps };
            }
            return p;
          }));
        }
      } catch(e) {
        console.error("Failed to fetch CMS statuses", e);
      }
    };
    fetchStatus();
  }, []);

  const handleToggle = async (e: any, id: string, currentStatus: boolean) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    try {
      const res = await api.post(`/cms/toggle/${id}`, { isEnabled: !currentStatus });
      if(res.data.success) {
        setPages(prev => prev.map(p => p.id === id ? { ...p, isEnabled: !currentStatus } : p));
        showToast(`Section ${id.toUpperCase()} ${!currentStatus ? 'published' : 'disabled'} successfully.`, "success");
      }
    } catch(err) {
      showToast("Failed to toggle section status", "error");
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn max-w-content mx-auto pb-12 font-sans">
      
      {/* Header Row (Matching Settings, Reports, Users & Plan) */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[13px] text-ink-secondary">Website CMS › Overview</div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
            Website CMS
          </h1>
          <div className="text-[13px] text-ink-secondary">
            Manage your school website content, sections, and live digital presence.
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a 
            href={import.meta.env.VITE_SCHOOL_WEBSITE_URL || 'http://localhost:5174'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="min-h-[42px] px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-[13px] font-semibold transition-colors cursor-pointer shadow-xs flex items-center gap-2"
          >
            <MdVisibility size={16} className="text-primary" />
            <span>View live site</span>
          </a>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "CMS Sections", val: stats.totalSections, icon: <MdWeb size={20} />, bg: "bg-primary-tint", color: "text-primary-dark" },
          { label: "Last Activity", val: stats.lastUpdate || "Just Now", icon: <MdHistory size={20} />, bg: "bg-surface-subtle", color: "text-ink-secondary" },
          { label: "Content Health", val: stats.contentHealth, icon: <MdSpeed size={20} />, bg: "bg-success-bg", color: "text-success-text" },
          { label: "Live Promos", val: stats.activePromotions, icon: <MdCheckCircle size={20} />, bg: "bg-warning-bg", color: "text-warning-text" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-line rounded-card p-4 sm:p-5 shadow-xs flex items-center gap-4">
            <div className={`w-11 h-11 ${stat.bg} ${stat.color} rounded-control flex items-center justify-center shrink-0 border border-line-row`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs text-ink-secondary font-medium">{stat.label}</p>
              <p className="font-mono text-2xl font-bold text-ink mt-0.5">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pages Management Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
           <div>
             <h2 className="text-base font-semibold text-ink">Content Modules</h2>
             <p className="text-xs text-ink-secondary">Select a page to edit content, media, and SEO attributes</p>
           </div>
           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-tint text-primary-dark border border-primary/20">
             Synchronized with live website
           </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page, i) => (
            <Link 
              key={i} 
              to={page.path}
              className="group bg-white rounded-card p-5 border border-line shadow-xs hover:border-primary hover:shadow-sm transition-all duration-150 flex flex-col gap-3.5 cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-control bg-surface-subtle border border-line-row flex items-center justify-center text-ink-secondary group-hover:text-primary group-hover:bg-primary-tint/50 transition-colors">
                  <MdWeb size={20} />
                </div>
                <div className="flex items-center gap-2.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    page.isEnabled ? 'bg-success-bg text-success-text' : 'bg-surface-subtle text-ink-muted border border-line-row'
                  }`}>
                    {page.isEnabled ? 'Published' : 'Disabled'}
                  </span>
                  <button 
                    type="button"
                    onClick={(e) => handleToggle(e, page.id, page.isEnabled)}
                    className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer shadow-inner ${page.isEnabled ? 'bg-primary' : 'bg-line-input'}`}
                    title={page.isEnabled ? "Click to disable" : "Click to publish"}
                  >
                    <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-all shadow-xs ${page.isEnabled ? 'left-[18px]' : 'left-[3px]'}`} />
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-[15px] font-semibold text-ink group-hover:text-primary transition-colors">
                  {page.name}
                </h3>
                
                <div className="space-y-1.5">
                   <div className="flex items-center justify-between text-xs text-ink-secondary">
                      <span>Completion</span>
                      <span className="font-mono font-semibold text-ink">{page.completion}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-surface-column rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full ${
                          page.completion === 100 ? 'bg-success-text' : 
                          page.completion > 50 ? 'bg-primary' : 'bg-warning-accent'
                        }`}
                        style={{ width: `${page.completion}%` }}
                      />
                   </div>

                   {/* Missing Steps Checklist */}
                   <div className="pt-1.5 min-h-[48px]">
                     {page.completion === 100 ? (
                       <div className="flex items-center gap-1.5 text-xs font-semibold text-success-text">
                         <MdCheckCircle size={15} />
                         <span>All content requirements met</span>
                       </div>
                     ) : (
                       <div className="space-y-1">
                         <p className="text-[11px] font-semibold text-warning-strong uppercase tracking-wide">Pending Steps</p>
                         {page.missingSteps.slice(0, 2).map((step, idx) => (
                           <div key={idx} className="flex items-start gap-1.5 text-xs text-ink-secondary leading-snug">
                             <span className="text-warning-accent mt-0.5">•</span>
                             <span className="truncate">{step}</span>
                           </div>
                         ))}
                       </div>
                     )}
                   </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-line-row text-xs text-ink-secondary">
                   <div className="flex items-center gap-1.5">
                      <MdHistory size={14} className="text-ink-muted" />
                      <span>Edited {page.lastEdit}</span>
                   </div>
                   <div className="w-7 h-7 rounded-control bg-surface-subtle flex items-center justify-center text-ink-secondary group-hover:bg-primary group-hover:text-white transition-colors">
                      <MdArrowForward size={15} />
                   </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Asset Manager Quick Access (Styled matching Brand Dark Theme) */}
      <section className="bg-nav-bg text-white rounded-card p-6 sm:p-7 border border-nav-divider flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/10 border border-gold/30 rounded-full text-xs font-semibold text-gold">
            <MdImage size={14} />
            <span>Central Media Library</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight leading-snug">
            Manage your school website assets in high definition.
          </h2>
          <p className="text-nav-text text-xs sm:text-sm leading-relaxed">
            Upload, crop, and optimize photos for your hero banners, faculty roster, and photo gallery automatically.
          </p>
          <div className="pt-1">
            <Link 
              to="/admin/cms/gallery" 
              className="inline-flex items-center gap-2 min-h-[40px] px-4 rounded-control bg-gold hover:bg-gold-hover text-nav-bg font-semibold text-xs transition cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <span>Open Media Gallery</span>
              <MdArrowForward size={16} />
            </Link>
          </div>
        </div>

        <div className="w-full md:w-auto shrink-0 bg-nav-active/60 border border-nav-divider rounded-control p-4 flex items-center gap-4">
           <div className="w-12 h-12 rounded-control bg-gold/20 border border-gold/40 flex items-center justify-center text-gold">
              <MdWeb size={24} />
           </div>
           <div>
              <p className="text-xs font-semibold text-white">campus_hero.jpg</p>
              <p className="text-[11px] text-nav-muted font-mono">2.4 MB · 1920x1080</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success mt-1">
                 <MdCheckCircle size={13} />
                 <span>Optimized for Web</span>
              </span>
           </div>
        </div>
      </section>

    </div>
  );
}
