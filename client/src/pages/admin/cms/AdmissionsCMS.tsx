import { useState, useEffect } from "react";
import { 
  MdSave, 
  MdImage, 
  MdFormatListNumbered,
  MdHelp,
  MdAssignment,
  MdVerified,
  MdAdd,
  MdDeleteOutline,
  MdVisibility
} from "react-icons/md";
import { Link } from "react-router-dom";
import api from "../../../api/axiosInstance";
import ImageUploadField from "./ImageUploadField";
import { useToast } from "../../../context/ToastContext";

export default function AdmissionsCMS() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState("banner");

  const [admissionsData, setAdmissionsData] = useState({
    bannerTitle: "Join Our Learning Community",
    bannerSubtitle: "Secure your child's future by enrolling them in an environment that fosters intellectual curiosity.",
    bannerImage: "/images/redesign/admissions_banner.png",
    steps: [
      { step: "01", title: "Online Inquiry", desc: "Begin by submitting the digital inquiry form." },
    ],
    faqs: [
      { q: "What is the teacher-student ratio?", a: "We maintain a strict 1:20 ratio." }
    ],
    eligibilityTitle: "Grades & Age Matrix",
    eligibilityDesc: "We follow a standardized age criteria.",
    matrix: [
      { grade: "Nursery - KG", age: "3 - 5 Years" }
    ],
    documents: [
      "Birth Certificate",
      "Passport Size Photos"
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        const response = await api.get('/cms/admissions');
        if (response.data.success && response.data.data) {
          const incoming = response.data.data;
          setAdmissionsData(prev => {
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
        console.error("Error fetching admissions data:", error);
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
        section: 'admissions',
        content: admissionsData
      });
      if (response.data.success) {
        showToast("Admissions content published successfully!", "success");
      } else {
        showToast("Failed to update admissions content", "error");
      }
    } catch (error) {
      showToast("Failed to update content. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'banner', label: 'Page Banner', icon: <MdImage size={16} /> },
    { id: 'steps', label: 'Application Steps', icon: <MdFormatListNumbered size={16} /> },
    { id: 'faqs', label: 'FAQs', icon: <MdHelp size={16} /> },
    { id: 'eligibility', label: 'Eligibility Matrix', icon: <MdVerified size={16} /> },
    { id: 'documents', label: 'Required Documents', icon: <MdAssignment size={16} /> },
  ];

  const updateArrayItem = (arrayName: string, index: number, field: string, value: string) => {
    setAdmissionsData((prev: any) => {
      const newArray = [...prev[arrayName]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [arrayName]: newArray };
    });
  };

  const updateStringArrayItem = (arrayName: string, index: number, value: string) => {
    setAdmissionsData((prev: any) => {
      const newArray = [...prev[arrayName]];
      newArray[index] = value;
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
            <span className="text-ink">Admissions</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
            Admissions CMS
          </h1>
          <div className="text-[13px] text-ink-secondary">
            Manage the enrollment guidelines, age criteria, and required documents.
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a 
            href={`${import.meta.env.VITE_SCHOOL_WEBSITE_URL || 'http://localhost:5174'}/admissions`}
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
          <div className="bg-white rounded-card border border-line p-3 space-y-1 sticky top-6">
            <div className="text-[11px] font-semibold text-ink-secondary uppercase tracking-wider px-3 py-1.5">
              Sections
            </div>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-control text-xs font-medium transition-all ${
                  activeTab === tab.id 
                    ? "bg-primary text-white font-semibold shadow-sm" 
                    : "text-ink-secondary hover:text-ink hover:bg-slate-50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-9 space-y-5">
          {fetching ? (
            <div className="h-96 bg-white border border-line rounded-card animate-pulse" />
          ) : (
            <>
              {/* BANNER TAB */}
              {activeTab === 'banner' && (
                <div className="bg-white rounded-card border border-line p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Banner Configuration</h3>
                    <p className="text-xs text-ink-secondary">Set the hero heading, introductory text, and background picture.</p>
                  </div>
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-ink-secondary mb-1.5">Banner Title</label>
                      <input 
                        value={admissionsData.bannerTitle}
                        onChange={(e) => setAdmissionsData({...admissionsData, bannerTitle: e.target.value})}
                        className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-xs text-ink placeholder:text-ink-secondary/60 focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ink-secondary mb-1.5">Banner Subtitle</label>
                      <textarea 
                        value={admissionsData.bannerSubtitle}
                        onChange={(e) => setAdmissionsData({...admissionsData, bannerSubtitle: e.target.value})}
                        rows={3}
                        className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-xs text-ink placeholder:text-ink-secondary/60 focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="pt-2">
                      <ImageUploadField
                        label="Banner Background Image"
                        value={admissionsData.bannerImage}
                        onChange={(url) => setAdmissionsData({...admissionsData, bannerImage: url})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEPS TAB */}
              {activeTab === 'steps' && (
                <div className="bg-white rounded-card border border-line p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-semibold text-ink">Application Steps</h3>
                      <p className="text-xs text-ink-secondary">Guide prospective families through your admission roadmap.</p>
                    </div>
                    <button 
                      onClick={() => setAdmissionsData(prev => ({...prev, steps: [...prev.steps, { step: `0${prev.steps.length + 1}`, title: "New Step", desc: "Description" }]}))}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-control bg-primary-tint text-primary-dark hover:bg-primary/20 text-xs font-medium transition-colors"
                    >
                      <MdAdd size={14} /> Add Step
                    </button>
                  </div>
                  <div className="space-y-3 pt-2">
                    {admissionsData.steps.map((item, i) => (
                      <div key={i} className="p-4 bg-slate-50/70 rounded-card border border-line space-y-3 relative group">
                        <button 
                          onClick={() => setAdmissionsData({...admissionsData, steps: admissionsData.steps.filter((_, idx) => idx !== i)})}
                          className="absolute top-3 right-3 text-ink-secondary hover:text-red-600 transition-colors"
                          title="Remove Step"
                        >
                          <MdDeleteOutline size={16} />
                        </button>
                        <div className="grid grid-cols-[100px_1fr] gap-3 pr-8">
                          <div>
                            <label className="block text-[11px] font-medium text-ink-secondary mb-1">Step #</label>
                            <input 
                              value={item.step}
                              onChange={(e) => updateArrayItem('steps', i, 'step', e.target.value)}
                              className="w-full bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-ink-secondary mb-1">Title</label>
                            <input 
                              value={item.title}
                              onChange={(e) => updateArrayItem('steps', i, 'title', e.target.value)}
                              className="w-full bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-ink-secondary mb-1">Description</label>
                          <input 
                            value={item.desc}
                            onChange={(e) => updateArrayItem('steps', i, 'desc', e.target.value)}
                            className="w-full bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQS TAB */}
              {activeTab === 'faqs' && (
                <div className="bg-white rounded-card border border-line p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-semibold text-ink">Frequently Asked Questions</h3>
                      <p className="text-xs text-ink-secondary">Common admissions questions and concise answers.</p>
                    </div>
                    <button 
                      onClick={() => setAdmissionsData(prev => ({...prev, faqs: [...prev.faqs, { q: "New Question?", a: "Answer..." }]}))}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-control bg-primary-tint text-primary-dark hover:bg-primary/20 text-xs font-medium transition-colors"
                    >
                      <MdAdd size={14} /> Add FAQ
                    </button>
                  </div>
                  <div className="space-y-3 pt-2">
                    {admissionsData.faqs.map((item, i) => (
                      <div key={i} className="p-4 bg-slate-50/70 rounded-card border border-line space-y-3 relative group">
                        <button 
                          onClick={() => setAdmissionsData({...admissionsData, faqs: admissionsData.faqs.filter((_, idx) => idx !== i)})}
                          className="absolute top-3 right-3 text-ink-secondary hover:text-red-600 transition-colors"
                          title="Remove FAQ"
                        >
                          <MdDeleteOutline size={16} />
                        </button>
                        <div className="pr-8">
                          <label className="block text-[11px] font-medium text-ink-secondary mb-1">Question</label>
                          <input 
                            value={item.q}
                            onChange={(e) => updateArrayItem('faqs', i, 'q', e.target.value)}
                            className="w-full bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-ink-secondary mb-1">Answer</label>
                          <textarea 
                            value={item.a}
                            onChange={(e) => updateArrayItem('faqs', i, 'a', e.target.value)}
                            rows={2}
                            className="w-full bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ELIGIBILITY MATRIX TAB */}
              {activeTab === 'eligibility' && (
                <div className="bg-white rounded-card border border-line p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-semibold text-ink">Eligibility Settings</h3>
                      <p className="text-xs text-ink-secondary">Define grade levels and corresponding age requirements.</p>
                    </div>
                  </div>
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-ink-secondary mb-1.5">Section Title</label>
                      <input 
                        value={admissionsData.eligibilityTitle}
                        onChange={(e) => setAdmissionsData({...admissionsData, eligibilityTitle: e.target.value})}
                        className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-xs text-ink placeholder:text-ink-secondary/60 focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ink-secondary mb-1.5">Section Description</label>
                      <textarea 
                        value={admissionsData.eligibilityDesc}
                        onChange={(e) => setAdmissionsData({...admissionsData, eligibilityDesc: e.target.value})}
                        rows={2}
                        className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-xs text-ink placeholder:text-ink-secondary/60 focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    
                    <div className="pt-3 border-t border-line">
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-xs font-medium text-ink-secondary">Age Matrix</label>
                        <button 
                          onClick={() => setAdmissionsData(prev => ({...prev, matrix: [...prev.matrix, { grade: "Grade X", age: "Y - Z Years" }]}))}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-control bg-primary-tint text-primary-dark hover:bg-primary/20 text-[11px] font-medium transition-colors"
                        >
                          <MdAdd size={13} /> Add Row
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {admissionsData.matrix.map((item, i) => (
                          <div key={i} className="flex gap-2 items-center p-2.5 bg-slate-50/70 border border-line rounded-card relative group">
                            <input 
                              value={item.grade}
                              onChange={(e) => updateArrayItem('matrix', i, 'grade', e.target.value)}
                              placeholder="Grade (e.g. Nursery)"
                              className="w-1/2 bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                            />
                            <input 
                              value={item.age}
                              onChange={(e) => updateArrayItem('matrix', i, 'age', e.target.value)}
                              placeholder="Age (e.g. 3-4 Years)"
                              className="w-1/2 bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                            />
                            <button 
                              onClick={() => setAdmissionsData({...admissionsData, matrix: admissionsData.matrix.filter((_, idx) => idx !== i)})}
                              className="text-ink-secondary hover:text-red-600 transition-colors p-1"
                              title="Remove"
                            >
                              <MdDeleteOutline size={15} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DOCUMENTS TAB */}
              {activeTab === 'documents' && (
                <div className="bg-white rounded-card border border-line p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-semibold text-ink">Required Documents</h3>
                      <p className="text-xs text-ink-secondary">Checklist of documents families must submit during enrollment.</p>
                    </div>
                    <button 
                      onClick={() => setAdmissionsData(prev => ({...prev, documents: [...prev.documents, "New Document"]}))}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-control bg-primary-tint text-primary-dark hover:bg-primary/20 text-xs font-medium transition-colors"
                    >
                      <MdAdd size={14} /> Add Document
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {admissionsData.documents.map((doc, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-slate-50/70 border border-line rounded-card">
                        <input 
                          value={doc}
                          onChange={(e) => updateStringArrayItem('documents', i, e.target.value)}
                          className="flex-1 bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                        />
                        <button 
                          onClick={() => setAdmissionsData({...admissionsData, documents: admissionsData.documents.filter((_, idx) => idx !== i)})}
                          className="text-ink-secondary hover:text-red-600 transition-colors p-1"
                          title="Remove Document"
                        >
                          <MdDeleteOutline size={15} />
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
