import { MdArrowForward } from "react-icons/md";

interface SchoolPageHeaderProps {
  title: string;
  subtitle: string;
  bgImage?: string;
}

export default function SchoolPageHeader({ title, subtitle, bgImage }: SchoolPageHeaderProps) {
  return (
    <section className="relative pt-48 pb-24 overflow-hidden bg-slate-900">
      {bgImage && (
        <img 
          src={bgImage} 
          alt={title} 
          className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2 animate-fadeIn">
            Institutional Gateway
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter animate-slideDown">
            {title}
          </h2>
          <p className="text-lg text-white/50 font-medium leading-relaxed max-w-2xl animate-fadeInDelay">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
