import { useState, useEffect } from "react";
import { 
  MdSave, 
  MdTextFields, 
  MdContactSupport,
  MdLocationOn,
  MdPhone,
  MdEmail,
  MdAccessTime,
  MdMap,
  MdPlayArrow
} from "react-icons/md";
import api from "../../../api/axiosInstance";
import type { ContactData } from "../../../types/admin/cms";

export default function ContactCMS() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [contactData, setContactData] = useState<ContactData>({
    bannerTitle: "Connect With Us",
    bannerSubtitle: "Have questions? Our administrative team is here to support you in every step of your journey.",
    bannerImage: "/images/redesign/hero.png",
    addressTitle: "Campus Address",
    addressDetail: "123 Educational Square, Knowledge City, Bangalore, IN 560001",
    phoneTitle: "Contact Support",
    phoneDetail: "+91 (800) 123-4567 | +91 (800) 123-4568",
    emailTitle: "Email Inquiry",
    emailDetail: "info@gyansthali.edu | admissions@gyansthali.edu",
    hoursTitle: "Operation Hours",
    hoursDetail: "Mon - Sat: 9:00 AM - 4:00 PM",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.984763582451!2d77.5922378!3d12.971942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
  });

  useEffect(() => {
    const fetchContactData = async () => {
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
    fetchContactData();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await api.post('/cms/update', {
        section: 'contact',
        content: contactData
      });
      if (response.data.success) {
        alert("Contact information published successfully!");
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
            <MdContactSupport className="text-indigo-600" />
            Contact Page CMS
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage school contact details and map integration.</p>
        </div>

        <button 
          onClick={handleSave}
          disabled={loading || fetching}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-70"
        >
          <MdSave size={20} />
          {loading ? "Updating..." : "Publish Contact"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Banner Configuration */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdTextFields size={16} className="text-indigo-500" />
              Banner Configuration
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-600 outline-none focus:bg-white focus:border-indigo-500 transition-all text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdContactSupport size={16} className="text-indigo-500" />
              Communication Channels
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Address */}
              <div className="space-y-4 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3 text-indigo-600 font-black text-[10px] uppercase">
                  <MdLocationOn size={18} />
                  Address Info
                </div>
                <input 
                  value={contactData.addressTitle}
                  onChange={(e) => setContactData({...contactData, addressTitle: e.target.value})}
                  className="w-full bg-white border border-slate-100 rounded-xl py-2 px-4 font-black text-slate-800 text-xs outline-none"
                  placeholder="Label (e.g. Campus Address)"
                />
                <textarea 
                  value={contactData.addressDetail}
                  onChange={(e) => setContactData({...contactData, addressDetail: e.target.value})}
                  rows={2}
                  className="w-full bg-white border border-slate-100 rounded-xl py-2 px-4 font-bold text-slate-500 text-[10px] outline-none"
                  placeholder="Full Address"
                />
              </div>

              {/* Phone */}
              <div className="space-y-4 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3 text-indigo-600 font-black text-[10px] uppercase">
                  <MdPhone size={18} />
                  Phone Numbers
                </div>
                <input 
                  value={contactData.phoneTitle}
                  onChange={(e) => setContactData({...contactData, phoneTitle: e.target.value})}
                  className="w-full bg-white border border-slate-100 rounded-xl py-2 px-4 font-black text-slate-800 text-xs outline-none"
                />
                <textarea 
                  value={contactData.phoneDetail}
                  onChange={(e) => setContactData({...contactData, phoneDetail: e.target.value})}
                  rows={2}
                  className="w-full bg-white border border-slate-100 rounded-xl py-2 px-4 font-bold text-slate-500 text-[10px] outline-none"
                />
              </div>

              {/* Email */}
              <div className="space-y-4 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3 text-indigo-600 font-black text-[10px] uppercase">
                  <MdEmail size={18} />
                  Official Emails
                </div>
                <input 
                  value={contactData.emailTitle}
                  onChange={(e) => setContactData({...contactData, emailTitle: e.target.value})}
                  className="w-full bg-white border border-slate-100 rounded-xl py-2 px-4 font-black text-slate-800 text-xs outline-none"
                />
                <textarea 
                  value={contactData.emailDetail}
                  onChange={(e) => setContactData({...contactData, emailDetail: e.target.value})}
                  rows={2}
                  className="w-full bg-white border border-slate-100 rounded-xl py-2 px-4 font-bold text-slate-500 text-[10px] outline-none"
                />
              </div>

              {/* Hours */}
              <div className="space-y-4 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3 text-indigo-600 font-black text-[10px] uppercase">
                  <MdAccessTime size={18} />
                  Working Hours
                </div>
                <input 
                  value={contactData.hoursTitle}
                  onChange={(e) => setContactData({...contactData, hoursTitle: e.target.value})}
                  className="w-full bg-white border border-slate-100 rounded-xl py-2 px-4 font-black text-slate-800 text-xs outline-none"
                />
                <textarea 
                  value={contactData.hoursDetail}
                  onChange={(e) => setContactData({...contactData, hoursDetail: e.target.value})}
                  rows={2}
                  className="w-full bg-white border border-slate-100 rounded-xl py-2 px-4 font-bold text-slate-500 text-[10px] outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdMap size={16} className="text-indigo-500" />
              Map Integration
            </div>
            
            <div className="space-y-4">
              <div className="aspect-square rounded-3xl bg-slate-100 border border-slate-200 overflow-hidden relative grayscale opacity-60">
                 <iframe 
                  src={contactData.mapEmbedUrl} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                />
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Google Maps Embed URL</label>
                  <input 
                    value={contactData.mapEmbedUrl}
                    onChange={(e) => setContactData({...contactData, mapEmbedUrl: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 font-bold text-slate-700 text-[10px] outline-none focus:bg-white focus:border-indigo-500 transition-all"
                    placeholder="https://www.google.com/maps/embed?..."
                  />
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-2">
                  <p className="text-[9px] font-black text-amber-800 uppercase tracking-widest">How to get this URL:</p>
                  <ol className="text-[9px] text-amber-700 font-bold list-decimal ml-4 space-y-1">
                    <li>Open Google Maps and search for your location.</li>
                    <li>Click <span className="text-amber-900">Share</span> button.</li>
                    <li>Select <span className="text-amber-900">Embed a map</span> tab.</li>
                    <li>Copy ONLY the <span className="text-amber-900">src="..."</span> part of the iframe.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100">
            <h4 className="font-black text-lg mb-2">Live Preview</h4>
            <p className="text-slate-400 text-xs mb-6">Verify your changes on the public contact page.</p>
            <a 
              href="http://localhost:5174/contact" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all"
            >
              <MdPlayArrow size={24} />
              <span className="font-bold text-sm">Open Contact Page</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
