import SchoolPageHeader from "../components/SchoolPageHeader";
import { MdLibraryBooks, MdNaturePeople, MdLightbulb, MdLanguage } from "react-icons/md";

export default function SchoolAcademics() {
  return (
    <div className="animate-fadeIn">
      <SchoolPageHeader 
        title="Academic Excellence" 
        subtitle="A holistic curriculum designed to foster critical thinking, creativity, and a lifelong love for learning."
        bgImage="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop"
      />

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Our <span className="text-indigo-600 italic">Curriculum</span> Framework
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              We follow a balanced pedagogical approach that integrates the best of international standards with national requirements. Our focus is on 'learning by doing' rather than rote memorization.
            </p>
            <div className="space-y-4">
              {[
                { title: "Early Years (Pre-K to 2)", icon: <MdNaturePeople className="text-emerald-500" /> },
                { title: "Primary Years (3 to 5)", icon: <MdLightbulb className="text-amber-500" /> },
                { title: "Middle Years (6 to 8)", icon: <MdLibraryBooks className="text-indigo-500" /> },
                { title: "High School (9 to 12)", icon: <MdLanguage className="text-rose-500" /> },
              ].map((level, i) => (
                <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-lg transition-all">
                  <div className="text-2xl">{level.icon}</div>
                  <span className="font-black text-slate-800 tracking-tight">{level.title}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6 pt-12">
              <div className="aspect-[4/5] rounded-[2.5rem] bg-slate-100 overflow-hidden shadow-xl">
                <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square rounded-[2.5rem] bg-indigo-600 overflow-hidden shadow-xl flex items-center justify-center p-8 text-white">
                <p className="text-xl font-black text-center leading-tight">Innovation is at our Core</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="aspect-square rounded-[2.5rem] bg-slate-900 overflow-hidden shadow-xl flex flex-col items-center justify-center p-8 text-white">
                <p className="text-5xl font-black mb-2">12+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Modern Labs</p>
              </div>
              <div className="aspect-[4/5] rounded-[2.5rem] bg-slate-100 overflow-hidden shadow-xl">
                <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 rounded-[4rem] p-16 text-white text-center">
          <h2 className="text-3xl font-black mb-16 tracking-tight">Specialized Departments</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              "STEM Innovation",
              "Linguistic Arts",
              "Performing Arts",
              "Athletic Science",
              "Visual Arts",
              "Global Studies",
              "Digital Literacy",
              "Value Education"
            ].map((dept, i) => (
              <div key={i} className="space-y-3">
                <div className="w-12 h-1 bg-indigo-500 mx-auto rounded-full" />
                <p className="font-bold text-white/60 text-sm tracking-wide">{dept}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
