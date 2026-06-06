import { useState, useEffect } from "react";
import { 
  MdSave, 
  MdImage, 
  MdTextFields, 
  MdSchool,
  MdPlayArrow,
  MdAutoGraph,
  MdWeb
} from "react-icons/md";
import api from "../../../api/axiosInstance";
import type { AcademicsData } from "../../../types/admin/cms";

export default function AcademicsCMS() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [academicsData, setAcademicsData] = useState<AcademicsData>({
    bannerTitle: "A Future-Ready Curriculum",
    bannerSubtitle: "We follow a research-backed instructional model that evolves with the student.",
    pedagogyTitle: "Our Journey of Continuous Growth",
    pedagogySubtitle: "From Discovery to Specialization.",
    phases: [
      { phase: "Phase 01", title: "Foundation", years: "Nursery - KG", desc: "Sensory exploration and motor skills.", color: "emerald" },
      { phase: "Phase 02", title: "Discovery", years: "Grade 1 - 5", desc: "Literacy, numeracy, and environmental awareness.", color: "amber" },
      { phase: "Phase 03", title: "Analysis", years: "Grade 6 - 8", desc: "Logic and critical thinking skills.", color: "indigo" },
      { phase: "Phase 04", title: "Readiness", years: "Grade 9 - 12", desc: "Advanced science and humanities pathways.", color: "rose" }
    ],
    infrastructureTitle: "Beyond the Textbook",
    infrastructureDesc: "Learning at Gyansthali isn't confined to four walls. We provide an ecosystem where students apply theoretical knowledge in world-class facilities.",
    infrastructureItems: [
      { title: "Smart Labs", desc: "Equipped with the latest STEM kits and AI tools.", icon: "MdComputer" },
      { title: "Digital Library", desc: "Access to 10k+ e-books and international journals.", icon: "MdMenuBook" },
      { title: "Creative Studios", desc: "Dedicated spaces for performing and visual arts.", icon: "MdBrush" },
      { title: "Linguistic Lab", desc: "Enhancing communication skills through digital aid.", icon: "MdLanguage" },
    ],
    departments: [
      { name: "STEM Innovation", icon: "MdComputer" },
      { name: "Linguistic Arts", icon: "MdLanguage" },
      { name: "Performing Arts", icon: "MdBrush" },
      { name: "Athletic Science", icon: "MdNaturePeople" }
    ],
    bannerImage: "/images/redesign/academics_banner.png",
    labImage: "/images/redesign/academics_lab.png"
  });

  useEffect(() => {
    const fetchAcademicsData = async () => {
      try {
        setFetching(true);
        const response = await api.get('/cms/academics');
        if (response.data.success && response.data.data) {
          const incoming = response.data.data;
          const cleanData: any = {};
          
          Object.keys(incoming).forEach(key => {
            const val = incoming[key];
            if (Array.isArray(val)) {
              const cleanArray = val.filter(item => {
                if (typeof item === 'object') {
                  return Object.values(item).some(v => v !== "" && v !== null);
                }
                return item !== "" && item !== null;
              });
              if (cleanArray.length > 0) cleanData[key] = cleanArray;
            } else if (val && val !== "") {
              cleanData[key] = val;
            }
          });
          
          setAcademicsData(prev => ({ ...prev, ...cleanData }));
        }
      } catch (error) {
        console.error("Error fetching academics data:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchAcademicsData();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await api.post('/cms/update', {
        section: 'academics',
        content: academicsData
      });
      if (response.data.success) {
        alert("Academics content published successfully!");
      }
    } catch (error) {
      alert("Failed to update content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 space-y-8 animate-fadeIn relative text-slate-900">
      
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-slate-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <MdSchool className="text-indigo-600" />
            Academics CMS
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage the curriculum journey and educational phases.</p>
        </div>

        <button 
          onClick={handleSave}
          disabled={loading || fetching}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-70"
        >
          <MdSave size={20} />
          {loading ? "Updating..." : "Publish Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Banner & Pedagogy */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdTextFields size={16} className="text-indigo-500" />
              Banner & Pedagogy
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Banner Title</label>
                <input 
                  value={academicsData.bannerTitle}
                  onChange={(e) => setAcademicsData({...academicsData, bannerTitle: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-black text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all text-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Pedagogy Headline</label>
                <input 
                  value={academicsData.pedagogyTitle}
                  onChange={(e) => setAcademicsData({...academicsData, pedagogyTitle: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-black text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all text-xl"
                />
              </div>
            </div>
          </div>

          {/* Learning Phases */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdAutoGraph size={16} className="text-indigo-500" />
              Learning Phases
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(academicsData?.phases || []).map((phase, index) => (
                <div key={index} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-lg bg-${phase.color}-100 text-${phase.color}-600 font-black text-[8px] uppercase tracking-widest`}>{phase.phase}</span>
                    <input 
                      value={phase.years}
                      onChange={(e) => {
                        const newPhases = [...academicsData.phases];
                        newPhases[index].years = e.target.value;
                        setAcademicsData({...academicsData, phases: newPhases});
                      }}
                      placeholder="e.g. Nursery - KG"
                      className="bg-transparent border-none outline-none font-black text-slate-500 text-[10px] text-right"
                    />
                  </div>
                  <input 
                    value={phase.title}
                    onChange={(e) => {
                      const newPhases = [...academicsData.phases];
                      newPhases[index].title = e.target.value;
                      setAcademicsData({...academicsData, phases: newPhases});
                    }}
                    placeholder="Phase Title"
                    className="w-full bg-transparent border-none outline-none font-black text-slate-800 text-sm"
                  />
                  <textarea 
                    value={phase.desc}
                    onChange={(e) => {
                      const newPhases = [...academicsData.phases];
                      newPhases[index].desc = e.target.value;
                      setAcademicsData({...academicsData, phases: newPhases});
                    }}
                    placeholder="Brief outcome"
                    rows={2}
                    className="w-full bg-white border border-slate-100 rounded-xl py-3 px-4 font-bold text-slate-500 outline-none focus:border-indigo-500 transition-all text-[10px]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure Configuration */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdWeb size={16} className="text-indigo-500" />
              Infrastructure (Beyond the Textbook)
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Headline</label>
                  <input 
                    value={academicsData.infrastructureTitle}
                    onChange={(e) => setAcademicsData({...academicsData, infrastructureTitle: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-6 font-black text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Detail Description</label>
                  <textarea 
                    value={academicsData.infrastructureDesc}
                    onChange={(e) => setAcademicsData({...academicsData, infrastructureDesc: e.target.value})}
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-6 font-bold text-slate-600 outline-none focus:bg-white focus:border-indigo-500 transition-all text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(academicsData.infrastructureItems || []).map((item, index) => (
                  <div key={index} className="p-5 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-3">
                    <input 
                      value={item.title}
                      onChange={(e) => {
                        const newItems = [...academicsData.infrastructureItems];
                        newItems[index].title = e.target.value;
                        setAcademicsData({...academicsData, infrastructureItems: newItems});
                      }}
                      placeholder="Feature Title"
                      className="w-full bg-transparent border-none outline-none font-black text-slate-800 text-xs"
                    />
                    <textarea 
                      value={item.desc}
                      onChange={(e) => {
                        const newItems = [...academicsData.infrastructureItems];
                        newItems[index].desc = e.target.value;
                        setAcademicsData({...academicsData, infrastructureItems: newItems});
                      }}
                      placeholder="Outcome/Detail"
                      rows={2}
                      className="w-full bg-white border border-slate-100 rounded-xl py-2 px-3 font-bold text-slate-500 outline-none focus:border-indigo-500 transition-all text-[10px]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Specialized Departments */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdSchool size={16} className="text-indigo-500" />
              Specialized Departments
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(academicsData.departments || []).map((dept, index) => (
                <div key={index} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 text-center">
                  <input 
                    value={dept.name}
                    onChange={(e) => {
                      const newDepts = [...academicsData.departments];
                      newDepts[index].name = e.target.value;
                      setAcademicsData({...academicsData, departments: newDepts});
                    }}
                    placeholder="Dept Name"
                    className="w-full bg-transparent border-none outline-none font-black text-slate-800 text-[10px] text-center"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Media & Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdImage size={16} className="text-indigo-500" />
              Academic Assets
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="relative group aspect-video rounded-3xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-indigo-300">
                  <img 
                    src={academicsData.bannerImage || "/images/redesign/academics_banner.png"} 
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                    alt="Banner"
                  />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-6 text-center">
                    <MdImage size={32} className="mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Change Banner URL Below</span>
                  </div>
                </div>
                <input 
                  type="text"
                  value={academicsData.bannerImage || ""}
                  onChange={(e) => setAcademicsData({...academicsData, bannerImage: e.target.value})}
                  placeholder="Banner Image URL..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 font-bold text-slate-700 text-[10px] outline-none focus:bg-white focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-4">
                <div className="relative group aspect-video rounded-3xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-indigo-300">
                  <img 
                    src={academicsData.labImage || "/images/redesign/academics_lab.png"} 
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                    alt="Lab"
                  />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-6 text-center">
                    <MdImage size={32} className="mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Change Lab URL Below</span>
                  </div>
                </div>
                <input 
                  type="text"
                  value={academicsData.labImage || ""}
                  onChange={(e) => setAcademicsData({...academicsData, labImage: e.target.value})}
                  placeholder="Lab Image URL..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 font-bold text-slate-700 text-[10px] outline-none focus:bg-white focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100">
            <h4 className="font-black text-lg mb-2">Live Preview</h4>
            <p className="text-slate-400 text-xs mb-6">Verify your changes on the public academics page.</p>
            <a 
              href={`${import.meta.env.VITE_SCHOOL_WEBSITE_URL || "http://localhost:5174"}/academics`} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all"
            >
              <MdPlayArrow size={24} />
              <span className="font-bold text-sm">Open Academics Page</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
