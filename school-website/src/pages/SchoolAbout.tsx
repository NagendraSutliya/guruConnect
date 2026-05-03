import SchoolPageHeader from "../components/SchoolPageHeader";
import { MdHistory, MdVisibility, MdFlag } from "react-icons/md";

export default function SchoolAbout() {
  return (
    <div className="animate-fadeIn">
      <SchoolPageHeader 
        title="About Our Institution" 
        subtitle="Discover the legacy, vision, and mission that drive excellence at Gyansthali Enterprises."
        bgImage="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"
      />

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
              Since 1999
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
              A Quarter Century of <span className="text-indigo-600">Educational Excellence.</span>
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              Founded with a vision to revolutionize the way children learn, Gyansthali has grown from a small neighborhood school into a premier educational hub. We believe that every child has a unique potential waiting to be unlocked.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <h4 className="font-black text-slate-800 mb-2">Our Vision</h4>
                <p className="text-xs text-slate-500 font-medium">To be a global leader in nurturing creative and compassionate citizens.</p>
              </div>
              <div className="p-6 rounded-3xl bg-indigo-50 border border-indigo-100">
                <h4 className="font-black text-indigo-900 mb-2">Our Mission</h4>
                <p className="text-xs text-indigo-700 font-medium">Providing high-quality education through innovation and values.</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[3rem] bg-slate-200 overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-transparent" />
              <img 
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop" 
                alt="School Culture" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 hidden md:block">
              <p className="text-4xl font-black text-indigo-600">25+</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Years of Legacy</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-950 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black tracking-tight mb-4">Our Core Philosophy</h2>
            <div className="w-20 h-1.5 bg-indigo-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <MdHistory />, title: "Rich Heritage", desc: "Rooted in traditional values while embracing modern pedagogy." },
              { icon: <MdVisibility />, title: "Future Ready", desc: "Equipping students with skills required for the 21st century." },
              { icon: <MdFlag />, title: "Leadership", desc: "Instilling confidence and integrity in every student." },
            ].map((item, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl text-indigo-400 mx-auto">
                  {item.icon}
                </div>
                <h4 className="text-xl font-black">{item.title}</h4>
                <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
