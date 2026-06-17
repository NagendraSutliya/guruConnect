import { MdStar } from "react-icons/md";

interface SchoolPageHeaderProps {
  title: string;
  subtitle: string;
  bgImage?: string;
}

const SchoolPageHeader = ({ title, subtitle, bgImage }: SchoolPageHeaderProps) => {
  return (
    <section className="relative pt-32 pb-8 overflow-hidden bg-[#020617]">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      {bgImage && (
        <img 
          src={bgImage} 
          alt={title} 
          className="absolute inset-0 w-full h-full object-cover opacity-20 scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-green-500 dark:text-indigo-400 text-[9px] font-black uppercase tracking-[0.3em] mb-2 animate-fadeIn">
            <MdStar size={16} className="text-amber-400" />
            Institutional Portal
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tighter animate-slideDown">
            {title}
          </h2>
          <p className="text-base text-slate-400 font-medium leading-relaxed max-w-2xl animate-fadeInDelay">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
};

export default SchoolPageHeader;
