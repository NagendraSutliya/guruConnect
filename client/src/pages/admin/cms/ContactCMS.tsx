import { useState, useEffect } from "react";
import { 
  MdSave, 
  MdImage, 
  MdPlayArrow,
  MdContactPhone
} from "react-icons/md";
import api from "../../../api/axiosInstance";
import ImageUploadField from "./ImageUploadField";

export default function ContactCMS() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState("banner");

  const [contactData, setContactData] = useState({
    bannerTitle: "Connect With Us",
    bannerSubtitle: "Have questions? Our administrative team is here to support you in every step of your journey.",
    bannerImage: "/images/redesign/hero.png",
    addressTitle: "Campus Address",
    addressDetail: "80 Feet Road, Mahesh Nagar, Jaipur, Rajasthan",
    phoneTitle: "Contact Support",
    phoneDetail: "+91 9425847076 | +91 9782994277",
    emailTitle: "Email Inquiry",
    emailDetail: "info@gyansthali.edu | admissions@gyansthali.edu",
    hoursTitle: "Operation Hours",
    hoursDetail: "Mon - Sat: 9:00 AM - 4:00 PM",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=..."
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        const response = await api.get('/cms/contact');
        if (response.data.success && response.data.data) {
          setContactData(prev => ({ ...prev, ...response.data.data }));
        }
      } catch (error) {
        console.error("Error fetching contact data:", error);
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
        section: 'contact',
        content: contactData
      });
      if (response.data.success) {
        alert("Contact content published successfully!");
      }
    } catch (error) {
      alert("Failed to update content");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'banner', label: 'Page Banner', icon: <MdImage /> },
    { id: 'details', label: 'Contact Details & Map', icon: <MdContactPhone /> },
  ];

  return (
    <div className="py-6 space-y-8 animate-fadeIn relative text-slate-900">
      
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-slate-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <MdContactPhone className="text-indigo-600" />
            Contact CMS
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage school address, contact lines, and map embed.</p>
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
              href={`\${import.meta.env.VITE_SCHOOL_WEBSITE_URL || 'http://localhost:5174'}/contact`}
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
                        value={contactData.bannerTitle}
                        onChange={(e) => setContactData({...contactData, bannerTitle: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-black text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Banner Subtitle</label>
                      <textarea 
                        value={contactData.bannerSubtitle}
                        onChange={(e) => setContactData({...contactData, bannerSubtitle: e.target.value})}
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-600 outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm leading-relaxed"
                      />
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                      <ImageUploadField
                        label="Banner Background Image"
                        value={contactData.bannerImage}
                        onChange={(url) => setContactData({...contactData, bannerImage: url})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* DETAILS TAB */}
              {activeTab === 'details' && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
                  <h3 className="text-lg font-black text-slate-800 mb-6">Contact & Map Info</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Address */}
                    <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address Title</label>
                      <input 
                        value={contactData.addressTitle}
                        onChange={(e) => setContactData({...contactData, addressTitle: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-slate-800 text-sm outline-none"
                      />
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mt-3">Address Detail</label>
                      <textarea 
                        value={contactData.addressDetail}
                        onChange={(e) => setContactData({...contactData, addressDetail: e.target.value})}
                        rows={2}
                        className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-medium text-slate-600 text-sm outline-none"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Title</label>
                      <input 
                        value={contactData.phoneTitle}
                        onChange={(e) => setContactData({...contactData, phoneTitle: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-slate-800 text-sm outline-none"
                      />
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mt-3">Phone Detail</label>
                      <textarea 
                        value={contactData.phoneDetail}
                        onChange={(e) => setContactData({...contactData, phoneDetail: e.target.value})}
                        rows={2}
                        className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-medium text-slate-600 text-sm outline-none"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Title</label>
                      <input 
                        value={contactData.emailTitle}
                        onChange={(e) => setContactData({...contactData, emailTitle: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-slate-800 text-sm outline-none"
                      />
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mt-3">Email Detail</label>
                      <textarea 
                        value={contactData.emailDetail}
                        onChange={(e) => setContactData({...contactData, emailDetail: e.target.value})}
                        rows={2}
                        className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-medium text-slate-600 text-sm outline-none"
                      />
                    </div>

                    {/* Hours */}
                    <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hours Title</label>
                      <input 
                        value={contactData.hoursTitle}
                        onChange={(e) => setContactData({...contactData, hoursTitle: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-slate-800 text-sm outline-none"
                      />
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mt-3">Hours Detail</label>
                      <textarea 
                        value={contactData.hoursDetail}
                        onChange={(e) => setContactData({...contactData, hoursDetail: e.target.value})}
                        rows={2}
                        className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-medium text-slate-600 text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Google Maps Embed URL</label>
                    <textarea 
                      value={contactData.mapEmbedUrl}
                      onChange={(e) => setContactData({...contactData, mapEmbedUrl: e.target.value})}
                      rows={4}
                      placeholder="https://www.google.com/maps/embed?..."
                      className="w-full bg-white border border-indigo-200 rounded-lg py-3 px-4 font-medium text-slate-600 text-xs outline-none focus:border-indigo-500"
                    />
                    <p className="text-[10px] text-indigo-500 font-medium">Paste the 'src' URL from Google Maps embed code.</p>
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
