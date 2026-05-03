import SchoolPageHeader from "../components/SchoolPageHeader";
import { useState } from "react";

export default function SchoolGallery() {
  const [filter, setFilter] = useState("All");

  const images = [
    { url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop", cat: "Campus" },
    { url: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=2070&auto=format&fit=crop", cat: "Sports" },
    { url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop", cat: "Events" },
    { url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop", cat: "Academic" },
    { url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop", cat: "Campus" },
    { url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop", cat: "Sports" },
  ];

  const filtered = filter === "All" ? images : images.filter(i => i.cat === filter);

  return (
    <div className="animate-fadeIn">
      <SchoolPageHeader 
        title="Visual Journey" 
        subtitle="A glimpse into the vibrant campus life and the memorable moments at Gyansthali."
        bgImage="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop"
      />

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Moments of <span className="text-indigo-600">Growth</span></h2>
          
          <div className="flex bg-slate-100 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
            {["All", "Campus", "Sports", "Events", "Academic"].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  filter === f ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filtered.map((img, i) => (
            <div key={i} className="relative group rounded-[2.5rem] overflow-hidden bg-slate-100 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-1">
              <img src={img.url} className="w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] border border-white/20 px-4 py-2 rounded-full backdrop-blur-md">
                  View Large
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
