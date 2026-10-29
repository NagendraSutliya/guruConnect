import { useState, useEffect } from "react";
import { 
  MdSave, 
  MdImage, 
  MdAutoGraph,
  MdScience,
  MdLayers,
  MdVisibility,
  MdAdd,
  MdClose
} from "react-icons/md";
import { Link } from "react-router-dom";
import api from "../../../api/axiosInstance";
import ImageUploadField from "./ImageUploadField";
import { useToast } from "../../../context/ToastContext";

export default function AcademicsCMS() {
  const { showToast } = useToast();
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
        showToast("Academics content published successfully!", "success");
      }
    } catch (error) {
      showToast("Failed to update content", "error");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'banner', label: 'Page Banner', icon: <MdImage size={16} /> },
    { id: 'phases', label: 'Learning Phases', icon: <MdLayers size={16} /> },
    { id: 'infrastructure', label: 'Infrastructure', icon: <MdScience size={16} /> },
    { id: 'departments', label: 'Departments', icon: <MdAutoGraph size={16} /> },
  ];

  const updateArrayItem = (arrayName: string, index: number, field: string, value: string) => {
    setAcademicsData((prev: any) => {
      const newArray = [...prev[arrayName]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [arrayName]: newArray };
    });
  };

  return (
    <div className="space-y-5 animate-fadeIn max-w-content mx-auto pb-12 font-sans">
      
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[13px] text-ink-secondary flex items-center gap-1.5">
            <Link to="/admin/cms" className="hover:text-primary transition-colors">Website CMS</Link>
            <span>›</span>
            <span className="text-ink">Academics</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
            Academics CMS
          </h1>
          <div className="text-[13px] text-ink-secondary">
            Manage curriculum phases, pedagogical methods, labs, and academic departments.
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a 
            href={`${import.meta.env.VITE_SCHOOL_WEBSITE_URL || 'http://localhost:5174'}/academics`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[42px] px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-[13px] font-semibold transition-colors cursor-pointer shadow-xs flex items-center gap-2"
          >
            <MdVisibility size={16} className="text-primary" />
            <span>Live preview</span>
          </a>
          <button 
            type="button"
            onClick={handleSave}
            disabled={loading || fetching}
            className="min-h-[42px] px-4 rounded-control bg-primary hover:bg-primary-dark text-white text-[13px] font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.98] disabled:opacity-70 flex items-center gap-2"
          >
            <MdSave size={18} />
            <span>{loading ? "Publishing..." : "Publish changes"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          <div className="bg-white rounded-card p-3 border border-line shadow-xs space-y-1 sticky top-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-control text-xs font-semibold transition-colors cursor-pointer text-left ${
                  activeTab === tab.id 
                    ? "bg-primary text-white shadow-xs" 
                    : "text-ink-secondary hover:bg-surface-subtle hover:text-ink"
                }`}
              >
                <span className={activeTab === tab.id ? "text-white" : "text-ink-secondary"}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-9 space-y-5">
          {fetching ? (
            <div className="h-[360px] bg-white border border-line rounded-card animate-pulse" />
          ) : (
            <>
              {/* BANNER TAB */}
              {activeTab === 'banner' && (
                <div className="bg-white rounded-card p-5 sm:p-6 border border-line shadow-xs space-y-4">
                  <div className="pb-1 border-b border-line-row">
                    <h2 className="text-base font-semibold text-ink">Banner Configuration</h2>
                    <p className="text-xs text-ink-secondary">Header section of the Academics page</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-ink-secondary mb-1">Banner Title</label>
                      <input 
                        value={academicsData.bannerTitle}
                        onChange={(e) => setAcademicsData({...academicsData, bannerTitle: e.target.value})}
                        className="w-full bg-surface-subtle border border-line-input rounded-control h-10 px-3 text-xs text-ink outline-none focus:bg-white focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-secondary mb-1">Banner Subtitle</label>
                      <textarea 
                        value={academicsData.bannerSubtitle}
                        onChange={(e) => setAcademicsData({...academicsData, bannerSubtitle: e.target.value})}
                        rows={3}
                        className="w-full bg-surface-subtle border border-line-input rounded-control p-3 text-xs text-ink outline-none focus:bg-white focus:border-primary transition-colors resize-none"
                      />
                    </div>
                    <div className="pt-2 border-t border-line-row">
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
                <div className="bg-white rounded-card p-5 sm:p-6 border border-line shadow-xs space-y-4">
                  <div className="flex justify-between items-center pb-1 border-b border-line-row flex-wrap gap-2">
                    <div>
                      <h2 className="text-base font-semibold text-ink">Learning Phases</h2>
                      <p className="text-xs text-ink-secondary">Development stages from Kindergarten through Senior School</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setAcademicsData(prev => ({...prev, phases: [...prev.phases, { phase: "Phase X", title: "New Phase", years: "Grade X", desc: "Description", color: "emerald" }]}))}
                      className="min-h-[36px] px-3.5 rounded-control bg-primary-tint hover:bg-primary-tint/80 border border-primary/20 text-primary-dark font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <MdAdd size={16} />
                      <span>Add Phase</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    {academicsData.phases.map((item, i) => (
                      <div key={i} className="p-4 bg-surface-subtle rounded-control border border-line-row space-y-3 relative group">
                        <button 
                          type="button"
                          onClick={() => setAcademicsData({...academicsData, phases: academicsData.phases.filter((_, idx) => idx !== i)})}
                          className="absolute top-2 right-2 w-7 h-7 bg-white hover:bg-danger-bg text-ink-secondary hover:text-danger border border-line-input rounded-control flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                          title="Remove phase"
                        >
                          <MdClose size={15} />
                        </button>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pr-8">
                          <div>
                            <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Phase Code</label>
                            <input 
                              value={item.phase}
                              onChange={(e) => updateArrayItem('phases', i, 'phase', e.target.value)}
                              className="w-full bg-white border border-line-input rounded-control h-9 px-2.5 text-xs text-ink font-medium outline-none focus:border-primary transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Title</label>
                            <input 
                              value={item.title}
                              onChange={(e) => updateArrayItem('phases', i, 'title', e.target.value)}
                              className="w-full bg-white border border-line-input rounded-control h-9 px-2.5 text-xs text-ink font-medium outline-none focus:border-primary transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Grades/Years</label>
                            <input 
                              value={item.years}
                              onChange={(e) => updateArrayItem('phases', i, 'years', e.target.value)}
                              className="w-full bg-white border border-line-input rounded-control h-9 px-2.5 text-xs text-ink font-medium outline-none focus:border-primary transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Badge Color</label>
                            <select 
                              value={item.color}
                              onChange={(e) => updateArrayItem('phases', i, 'color', e.target.value)}
                              className="w-full bg-white border border-line-input rounded-control h-9 px-2.5 text-xs text-ink outline-none focus:border-primary transition-colors cursor-pointer"
                            >
                              <option value="emerald">Emerald</option>
                              <option value="amber">Amber</option>
                              <option value="indigo">Indigo</option>
                              <option value="rose">Rose</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Description</label>
                          <textarea 
                            value={item.desc}
                            onChange={(e) => updateArrayItem('phases', i, 'desc', e.target.value)}
                            rows={2}
                            className="w-full bg-white border border-line-input rounded-control p-2.5 text-xs text-ink outline-none focus:border-primary transition-colors resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* INFRASTRUCTURE TAB */}
              {activeTab === 'infrastructure' && (
                <div className="bg-white rounded-card p-5 sm:p-6 border border-line shadow-xs space-y-4">
                  <div className="pb-1 border-b border-line-row">
                    <h2 className="text-base font-semibold text-ink">Academic Infrastructure</h2>
                    <p className="text-xs text-ink-secondary">Showcase labs, libraries, smart classrooms, and learning spaces</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-ink-secondary mb-1">Section Title</label>
                      <input 
                        value={academicsData.infrastructureTitle}
                        onChange={(e) => setAcademicsData({...academicsData, infrastructureTitle: e.target.value})}
                        className="w-full bg-surface-subtle border border-line-input rounded-control h-10 px-3 text-xs text-ink outline-none focus:bg-white focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-secondary mb-1">Section Description</label>
                      <textarea 
                        value={academicsData.infrastructureDesc}
                        onChange={(e) => setAcademicsData({...academicsData, infrastructureDesc: e.target.value})}
                        rows={2}
                        className="w-full bg-surface-subtle border border-line-input rounded-control p-3 text-xs text-ink outline-none focus:bg-white focus:border-primary transition-colors resize-none"
                      />
                    </div>
                    
                    <div className="pt-2 border-t border-line-row">
                      <ImageUploadField
                        label="Infrastructure Showcase Image"
                        value={academicsData.labImage}
                        onChange={(url) => setAcademicsData({...academicsData, labImage: url})}
                      />
                    </div>

                    <div className="pt-4 border-t border-line-row">
                      <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                        <div>
                          <h3 className="text-sm font-semibold text-ink">Facilities List</h3>
                          <p className="text-xs text-ink-secondary">Specific specialized rooms or smart facilities</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setAcademicsData(prev => ({...prev, infrastructureItems: [...prev.infrastructureItems, { title: "New Facility", desc: "Description", icon: "MdComputer" }]}))}
                          className="min-h-[34px] px-3 rounded-control bg-primary-tint hover:bg-primary-tint/80 border border-primary/20 text-primary-dark font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                        >
                          <MdAdd size={15} />
                          <span>Add Facility</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {academicsData.infrastructureItems.map((item, i) => (
                          <div key={i} className="p-4 bg-surface-subtle border border-line-row rounded-control relative group space-y-3">
                            <button 
                              type="button"
                              onClick={() => setAcademicsData({...academicsData, infrastructureItems: academicsData.infrastructureItems.filter((_, idx) => idx !== i)})}
                              className="absolute top-2 right-2 w-7 h-7 bg-white hover:bg-danger-bg text-ink-secondary hover:text-danger border border-line-input rounded-control flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                              title="Remove facility"
                            >
                              <MdClose size={15} />
                            </button>
                            <div className="pr-8">
                              <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Title</label>
                              <input 
                                value={item.title}
                                onChange={(e) => updateArrayItem('infrastructureItems', i, 'title', e.target.value)}
                                className="w-full bg-white border border-line-input rounded-control h-9 px-2.5 text-xs text-ink font-medium outline-none focus:border-primary transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Icon Name</label>
                              <input 
                                value={item.icon}
                                onChange={(e) => updateArrayItem('infrastructureItems', i, 'icon', e.target.value)}
                                placeholder="e.g. MdComputer"
                                className="w-full bg-white border border-line-input rounded-control h-9 px-2.5 text-xs text-ink font-mono outline-none focus:border-primary transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Description</label>
                              <textarea 
                                value={item.desc}
                                onChange={(e) => updateArrayItem('infrastructureItems', i, 'desc', e.target.value)}
                                rows={2}
                                className="w-full bg-white border border-line-input rounded-control p-2.5 text-xs text-ink outline-none focus:border-primary transition-colors resize-none"
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
                <div className="bg-white rounded-card p-5 sm:p-6 border border-line shadow-xs space-y-4">
                  <div className="flex justify-between items-center pb-1 border-b border-line-row flex-wrap gap-2">
                    <div>
                      <h2 className="text-base font-semibold text-ink">Academic Departments</h2>
                      <p className="text-xs text-ink-secondary">Faculty faculties and disciplinary clusters</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setAcademicsData(prev => ({...prev, departments: [...prev.departments, { name: "New Department" }]}))}
                      className="min-h-[36px] px-3.5 rounded-control bg-primary-tint hover:bg-primary-tint/80 border border-primary/20 text-primary-dark font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <MdAdd size={16} />
                      <span>Add Department</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {academicsData.departments.map((dept, i) => (
                      <div key={i} className="relative group flex items-center">
                        <input 
                          value={dept.name}
                          onChange={(e) => updateArrayItem('departments', i, 'name', e.target.value)}
                          className="w-full bg-surface-subtle border border-line-input rounded-control h-10 px-3 text-xs font-medium text-ink outline-none focus:border-primary focus:bg-white transition-colors pr-9"
                        />
                        <button 
                          type="button"
                          onClick={() => setAcademicsData({...academicsData, departments: academicsData.departments.filter((_, idx) => idx !== i)})}
                          className="absolute right-2 w-6 h-6 bg-white hover:bg-danger-bg text-ink-secondary hover:text-danger rounded-control flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-line-input"
                          title="Remove department"
                        >
                          <MdClose size={13} />
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
