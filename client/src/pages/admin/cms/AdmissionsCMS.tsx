import { useState, useEffect } from "react";
import { 
  MdSave, 
  MdImage, 
  MdPlayArrow,
  MdFormatListNumbered,
  MdHelp,
  MdAssignment,
  MdVerified
} from "react-icons/md";
import api from "../../../api/axiosInstance";
import ImageUploadField from "./ImageUploadField";

export default function AdmissionsCMS() {
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
        alert("Admissions content published successfully!");
      }
    } catch (error) {
      alert("Failed to update content");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'banner', label: 'Page Banner', icon: <MdImage /> },
    { id: 'steps', label: 'Application Steps', icon: <MdFormatListNumbered /> },
    { id: 'faqs', label: 'FAQs', icon: <MdHelp /> },
    { id: 'eligibility', label: 'Eligibility Matrix', icon: <MdVerified /> },
    { id: 'documents', label: 'Required Documents', icon: <MdAssignment /> },
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
    <div className="py-6 space-y-8 animate-fadeIn relative text-slate-900">
      
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-slate-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <MdAssignment className="text-indigo-600" />
            Admissions CMS
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage the enrollment guidelines and steps.</p>
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
              href={`\${import.meta.env.VITE_SCHOOL_WEBSITE_URL || 'http://localhost:5174'}/admissions`}
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
                        value={admissionsData.bannerTitle}
                        onChange={(e) => setAdmissionsData({...admissionsData, bannerTitle: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-black text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Banner Subtitle</label>
                      <textarea 
                        value={admissionsData.bannerSubtitle}
                        onChange={(e) => setAdmissionsData({...admissionsData, bannerSubtitle: e.target.value})}
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-600 outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm leading-relaxed"
                      />
                    </div>
                    <div className="pt-4 border-t border-slate-100">
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
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-slate-800">Application Steps</h3>
                    <button 
                      onClick={() => setAdmissionsData(prev => ({...prev, steps: [...prev.steps, { step: "0X", title: "New Step", desc: "Description" }]}))}
                      className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-100 transition-colors"
                    >
                      + Add Step
                    </button>
                  </div>
                  <div className="space-y-4">
                    {admissionsData.steps.map((item, i) => (
                      <div key={i} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-4 relative group">
                        <button 
                          onClick={() => setAdmissionsData({...admissionsData, steps: admissionsData.steps.filter((_, idx) => idx !== i)})}
                          className="absolute -top-3 -right-3 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold shadow-md hover:bg-red-500 hover:text-white"
                        >
                          ×
                        </button>
                        <div className="grid grid-cols-[80px_1fr] gap-4">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step #</label>
                            <input 
                              value={item.step}
                              onChange={(e) => updateArrayItem('steps', i, 'step', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-slate-800 text-sm outline-none mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Title</label>
                            <input 
                              value={item.title}
                              onChange={(e) => updateArrayItem('steps', i, 'title', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-slate-800 text-sm outline-none mt-1"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                          <input 
                            value={item.desc}
                            onChange={(e) => updateArrayItem('steps', i, 'desc', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-medium text-slate-600 text-sm outline-none mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQS TAB */}
              {activeTab === 'faqs' && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-slate-800">Frequently Asked Questions</h3>
                    <button 
                      onClick={() => setAdmissionsData(prev => ({...prev, faqs: [...prev.faqs, { q: "New Question?", a: "Answer..." }]}))}
                      className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-100 transition-colors"
                    >
                      + Add FAQ
                    </button>
                  </div>
                  <div className="space-y-4">
                    {admissionsData.faqs.map((item, i) => (
                      <div key={i} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-4 relative group">
                        <button 
                          onClick={() => setAdmissionsData({...admissionsData, faqs: admissionsData.faqs.filter((_, idx) => idx !== i)})}
                          className="absolute -top-3 -right-3 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold shadow-md hover:bg-red-500 hover:text-white"
                        >
                          ×
                        </button>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question</label>
                          <input 
                            value={item.q}
                            onChange={(e) => updateArrayItem('faqs', i, 'q', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-slate-800 text-sm outline-none mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Answer</label>
                          <textarea 
                            value={item.a}
                            onChange={(e) => updateArrayItem('faqs', i, 'a', e.target.value)}
                            rows={2}
                            className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-medium text-slate-600 text-sm outline-none mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ELIGIBILITY MATRIX TAB */}
              {activeTab === 'eligibility' && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-slate-800 mb-6">Eligibility Settings</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Section Title</label>
                      <input 
                        value={admissionsData.eligibilityTitle}
                        onChange={(e) => setAdmissionsData({...admissionsData, eligibilityTitle: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 font-black text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Section Description</label>
                      <textarea 
                        value={admissionsData.eligibilityDesc}
                        onChange={(e) => setAdmissionsData({...admissionsData, eligibilityDesc: e.target.value})}
                        rows={2}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 font-medium text-slate-600 outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm"
                      />
                    </div>
                    
                    <div className="pt-6 border-t border-slate-100">
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Age Matrix</label>
                        <button 
                          onClick={() => setAdmissionsData(prev => ({...prev, matrix: [...prev.matrix, { grade: "Grade X", age: "Y - Z Years" }]}))}
                          className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-100 transition-colors"
                        >
                          + Add Row
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {admissionsData.matrix.map((item, i) => (
                          <div key={i} className="flex gap-2 items-center relative group p-3 bg-slate-50 border border-slate-200 rounded-xl">
                            <button 
                              onClick={() => setAdmissionsData({...admissionsData, matrix: admissionsData.matrix.filter((_, idx) => idx !== i)})}
                              className="absolute -top-2 -right-2 w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold shadow-md hover:bg-red-500 hover:text-white text-[10px]"
                            >
                              ×
                            </button>
                            <input 
                              value={item.grade}
                              onChange={(e) => updateArrayItem('matrix', i, 'grade', e.target.value)}
                              className="w-1/2 bg-white border border-slate-200 rounded-lg py-1.5 px-3 font-bold text-slate-800 text-xs outline-none"
                            />
                            <input 
                              value={item.age}
                              onChange={(e) => updateArrayItem('matrix', i, 'age', e.target.value)}
                              className="w-1/2 bg-white border border-slate-200 rounded-lg py-1.5 px-3 font-medium text-slate-600 text-xs outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DOCUMENTS TAB */}
              {activeTab === 'documents' && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-slate-800">Required Documents</h3>
                    <button 
                      onClick={() => setAdmissionsData(prev => ({...prev, documents: [...prev.documents, "New Document"]}))}
                      className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-100 transition-colors"
                    >
                      + Add Document
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {admissionsData.documents.map((doc, i) => (
                      <div key={i} className="relative group flex items-center">
                        <input 
                          value={doc}
                          onChange={(e) => updateStringArrayItem('documents', i, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-bold text-slate-700 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all pr-10"
                        />
                        <button 
                          onClick={() => setAdmissionsData({...admissionsData, documents: admissionsData.documents.filter((_, idx) => idx !== i)})}
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
