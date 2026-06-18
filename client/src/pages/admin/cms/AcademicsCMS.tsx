import { useState, useEffect } from "react";
import { 
  MdSave, 
  MdImage, 
  MdPlayArrow,
  MdAutoGraph,
  MdScience,
  MdLayers
} from "react-icons/md";
import api from "../../../api/axiosInstance";
import ImageUploadField from "./ImageUploadField";

export default function AcademicsCMS() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState("banner");

  const [academicsData, setAcademicsData] = useState({
    bannerTitle: "A Future-Ready Curriculum",
    bannerSubtitle: "We follow a research-backed instructional model that evolves with the student.",
    bannerImage: "/images/redesign/academics_banner.png",
    phases: [
      { phase: "Phase 01", title: "The Foundation", years: "Nursery - KG", desc: "Focus on sensory exploration.", color: "emerald" },
    ],
    infrastructureTitle: "Beyond the Textbook",
    infrastructureDesc: "Learning at Gyansthali isn't confined to four walls.",
    infrastructureItems: [
      { title: "Smart Labs", desc: "Equipped with the latest STEM kits.", icon: "MdComputer" },
    ],
    labImage: "/images/redesign/academics_lab.png",
    departments: [
      { name: "STEM Research" },
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        const response = await api.get('/cms/academics');
        if (response.data.success && response.data.data) {
          const incoming = response.data.data;
          setAcademicsData(prev => {
            const next = { ...prev };
            Object.keys(incoming).forEach(key => {
              if (Array.isArray(incoming[key])) {
                (next as any)[key] = incoming[key];
              } else if (incoming[key] !== undefined && incoming[key] !== null && incoming[key] !== "") {
                (next as any)[key] = incoming[key];
              }
            });
            return next;
          });
        }
      } catch (error) {
        console.error("Error fetching academics data:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
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

  const tabs = [
    { id: 'banner', label: 'Page Banner', icon: <MdImage /> },
    { id: 'phases', label: 'Learning Phases', icon: <MdLayers /> },
    { id: 'infrastructure', label: 'Infrastructure', icon: <MdScience /> },
    { id: 'departments', label: 'Departments', icon: <MdAutoGraph /> },
  ];

  const updateArrayItem = (arrayName: string, index: number, field: string, value: string) => {
    setAcademicsData((prev: any) => {
      const newArray = [...prev[arrayName]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [arrayName]: newArray };
    });
  };

  return (
    <div className="py-6 space-y-8 animate-fadeIn relative text-slate-900">
      
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-slate-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <MdLayers className="text-indigo-600" />
            Academics CMS
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage the curriculum, phases, and facilities.</p>
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
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-1 sticky top-32">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === tab.id 
                    ? "bg-indigo-50 text-indigo-700 shadow-inner" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
            
            <hr className="border-slate-100 my-4 mx-4" />
            
            <a 
              href={`\${import.meta.env.VITE_SCHOOL_WEBSITE_URL || 'http://localhost:5174'}/academics`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all w-full"
            >
              <MdPlayArrow size={16} />
              Open Live Page
            </a>
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-9 space-y-8">
          {fetching ? (
            <div className="h-[400px] bg-slate-100 rounded-3xl animate-pulse" />
          ) : (
            <>
              {/* BANNER TAB */}
              {activeTab === 'banner' && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-slate-800 mb-6">Banner Configuration</h3>
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
                      <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Banner Subtitle</label>
                      <textarea 
                        value={academicsData.bannerSubtitle}
                        onChange={(e) => setAcademicsData({...academicsData, bannerSubtitle: e.target.value})}
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-600 outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm leading-relaxed"
                      />
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                      <ImageUploadField
                        label="Banner Background Image"
                        value={academicsData.bannerImage}
                        onChange={(url) => setAcademicsData({...academicsData, bannerImage: url})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PHASES TAB */}
              {activeTab === 'phases' && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-slate-800">Learning Phases</h3>
                    <button 
                      onClick={() => setAcademicsData(prev => ({...prev, phases: [...prev.phases, { phase: "Phase X", title: "New Phase", years: "Grade X", desc: "Description", color: "emerald" }]}))}
                      className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-100 transition-colors"
                    >
                      + Add Phase
                    </button>
                  </div>
                  <div className="space-y-4">
                    {academicsData.phases.map((item, i) => (
                      <div key={i} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-4 relative group">
                        <button 
                          onClick={() => setAcademicsData({...academicsData, phases: academicsData.phases.filter((_, idx) => idx !== i)})}
                          className="absolute -top-3 -right-3 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold shadow-md hover:bg-red-500 hover:text-white"
                        >
                          ×
                        </button>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phase Name</label>
                            <input 
                              value={item.phase}
                              onChange={(e) => updateArrayItem('phases', i, 'phase', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-slate-800 text-sm outline-none mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Title</label>
                            <input 
                              value={item.title}
                              onChange={(e) => updateArrayItem('phases', i, 'title', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-slate-800 text-sm outline-none mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Years</label>
                            <input 
                              value={item.years}
                              onChange={(e) => updateArrayItem('phases', i, 'years', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-slate-800 text-sm outline-none mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Color</label>
                            <select 
                              value={item.color}
                              onChange={(e) => updateArrayItem('phases', i, 'color', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-slate-800 text-sm outline-none mt-1"
                            >
                              <option value="emerald">Emerald</option>
                              <option value="amber">Amber</option>
                              <option value="indigo">Indigo</option>
                              <option value="rose">Rose</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                          <textarea 
                            value={item.desc}
                            onChange={(e) => updateArrayItem('phases', i, 'desc', e.target.value)}
                            rows={2}
                            className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-medium text-slate-600 text-sm outline-none mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* INFRASTRUCTURE TAB */}
              {activeTab === 'infrastructure' && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-slate-800 mb-6">Infrastructure</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Section Title</label>
                      <input 
                        value={academicsData.infrastructureTitle}
                        onChange={(e) => setAcademicsData({...academicsData, infrastructureTitle: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 font-black text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Section Description</label>
                      <textarea 
                        value={academicsData.infrastructureDesc}
                        onChange={(e) => setAcademicsData({...academicsData, infrastructureDesc: e.target.value})}
                        rows={2}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 font-medium text-slate-600 outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm"
                      />
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100">
                      <ImageUploadField
                        label="Infrastructure Showcase Image"
                        value={academicsData.labImage}
                        onChange={(url) => setAcademicsData({...academicsData, labImage: url})}
                      />
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Facilities</label>
                        <button 
                          onClick={() => setAcademicsData(prev => ({...prev, infrastructureItems: [...prev.infrastructureItems, { title: "New Facility", desc: "Description", icon: "MdComputer" }]}))}
                          className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-100 transition-colors"
                        >
                          + Add Facility
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {academicsData.infrastructureItems.map((item, i) => (
                          <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl relative group space-y-3">
                            <button 
                              onClick={() => setAcademicsData({...academicsData, infrastructureItems: academicsData.infrastructureItems.filter((_, idx) => idx !== i)})}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold shadow-md hover:bg-red-500 hover:text-white text-[10px]"
                            >
                              ×
                            </button>
                            <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Title</label>
                              <input 
                                value={item.title}
                                onChange={(e) => updateArrayItem('infrastructureItems', i, 'title', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 font-bold text-slate-800 text-xs outline-none mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Icon Name</label>
                              <input 
                                value={item.icon}
                                onChange={(e) => updateArrayItem('infrastructureItems', i, 'icon', e.target.value)}
                                placeholder="e.g. MdComputer"
                                className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 font-bold text-slate-800 text-xs outline-none mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                              <textarea 
                                value={item.desc}
                                onChange={(e) => updateArrayItem('infrastructureItems', i, 'desc', e.target.value)}
                                rows={2}
                                className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 font-medium text-slate-600 text-xs outline-none mt-1"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DEPARTMENTS TAB */}
              {activeTab === 'departments' && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-slate-800">Departments</h3>
                    <button 
                      onClick={() => setAcademicsData(prev => ({...prev, departments: [...prev.departments, { name: "New Department" }]}))}
                      className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-100 transition-colors"
                    >
                      + Add Department
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {academicsData.departments.map((dept, i) => (
                      <div key={i} className="relative group flex items-center">
                        <input 
                          value={dept.name}
                          onChange={(e) => updateArrayItem('departments', i, 'name', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-bold text-slate-700 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all pr-10"
                        />
                        <button 
                          onClick={() => setAcademicsData({...academicsData, departments: academicsData.departments.filter((_, idx) => idx !== i)})}
                          className="absolute right-3 w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold hover:bg-red-500 hover:text-white text-[10px]"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </>
          )}
        </div>
      </div>
    </div>
  );
}
