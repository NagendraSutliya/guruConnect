import { useState, useEffect } from "react";
import { 
  MdWeb, 
  MdSave, 
  MdImage, 
  MdTextFields, 
  MdAssignment,
  MdPlayArrow,
  MdList
} from "react-icons/md";
import api from "../../../api/axiosInstance";

export default function AdmissionsCMS() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [admissionsData, setAdmissionsData] = useState({
    bannerTitle: "Join Our Learning Community",
    bannerSubtitle: "Secure your child's future by enrolling them in an environment that fosters intellectual curiosity and technological fluency for the 2026-27 session.",
    processTitle: "The Pathway to Excellence",
    steps: [
      { step: "01", title: "Online Inquiry", desc: "Submit the digital inquiry form to schedule a counseling session." },
      { step: "02", title: "Campus Interaction", desc: "A personalized meeting to understand your child's needs." },
      { step: "03", title: "Application Review", desc: "Submission of records for our pedagogical committee to review." },
      { step: "04", title: "Final Enrollment", desc: "Confirmation of admission followed by orientation." }
    ],
    eligibilityTitle: "Admission Criteria",
    eligibilityDesc: "We seek curious minds ready to embrace challenges.",
    matrix: [
      { grade: "Pre-Primary", age: "3 - 5 Years" },
      { grade: "Primary", age: "6 - 10 Years" }
    ],
    documents: ["Birth Certificate", "Previous School Report", "Aadhar Card"],
    bannerImage: "/images/redesign/admissions_banner.png"
  });

  useEffect(() => {
    const fetchAdmissionsData = async () => {
      try {
        setFetching(true);
        const response = await api.get('/cms/admissions');
        if (response.data.success && response.data.data) {
          setAdmissionsData(prev => ({ ...prev, ...response.data.data }));
        }
      } catch (error) {
        console.error("Error fetching admissions data:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchAdmissionsData();
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

  return (
    <div className="py-6 space-y-8 animate-fadeIn relative text-slate-900">
      
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-slate-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <MdAssignment className="text-indigo-600" />
            Admissions CMS
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage the admission cycle and eligibility criteria.</p>
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
          
          {/* Banner & Header */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdTextFields size={16} className="text-indigo-500" />
              Banner & Header
            </div>

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
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-600 outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Admission Process Steps */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdList size={16} className="text-indigo-500" />
              Pathway Steps
            </div>

            <div className="space-y-6">
              {admissionsData.steps.map((step, index) => (
                <div key={index} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs">{step.step}</span>
                    <input 
                      value={step.title}
                      onChange={(e) => {
                        const newSteps = [...admissionsData.steps];
                        newSteps[index].title = e.target.value;
                        setAdmissionsData({...admissionsData, steps: newSteps});
                      }}
                      placeholder="Step Title"
                      className="bg-transparent border-none outline-none font-black text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                  <textarea 
                    value={step.desc}
                    onChange={(e) => {
                      const newSteps = [...admissionsData.steps];
                      newSteps[index].desc = e.target.value;
                      setAdmissionsData({...admissionsData, steps: newSteps});
                    }}
                    placeholder="Step Description"
                    rows={2}
                    className="w-full bg-white border border-slate-100 rounded-xl py-3 px-4 font-bold text-slate-500 outline-none focus:border-indigo-500 transition-all text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility Matrix */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdWeb size={16} className="text-indigo-500" />
              Eligibility Matrix
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Section Headline</label>
                <input 
                  value={admissionsData.eligibilityTitle}
                  onChange={(e) => setAdmissionsData({...admissionsData, eligibilityTitle: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-black text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all text-xl"
                />
              </div>
              
              <div className="space-y-4">
                {admissionsData.matrix.map((item, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4">
                    <input 
                      value={item.grade}
                      onChange={(e) => {
                        const newMatrix = [...admissionsData.matrix];
                        newMatrix[index].grade = e.target.value;
                        setAdmissionsData({...admissionsData, matrix: newMatrix});
                      }}
                      placeholder="Grade Level"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-bold text-slate-800 text-xs"
                    />
                    <input 
                      value={item.age}
                      onChange={(e) => {
                        const newMatrix = [...admissionsData.matrix];
                        newMatrix[index].age = e.target.value;
                        setAdmissionsData({...admissionsData, matrix: newMatrix});
                      }}
                      placeholder="Age Criteria"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-bold text-slate-800 text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Media & Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdImage size={16} className="text-indigo-500" />
              Admissions Media
            </div>
            
            <div className="space-y-6">
              <div className="relative group aspect-video rounded-3xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-indigo-300">
                <img 
                  src={admissionsData.bannerImage || "/images/redesign/admissions_banner.png"} 
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
                value={admissionsData.bannerImage || ""}
                onChange={(e) => setAdmissionsData({...admissionsData, bannerImage: e.target.value})}
                placeholder="Banner Image URL..."
                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 font-bold text-slate-700 text-[10px] outline-none focus:bg-white focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100">
            <h4 className="font-black text-lg mb-2">Live Preview</h4>
            <p className="text-slate-400 text-xs mb-6">Verify your changes on the public admissions page.</p>
            <a 
              href="http://localhost:5174/admissions" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all"
            >
              <MdPlayArrow size={24} />
              <span className="font-bold text-sm">Open Admissions Page</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
