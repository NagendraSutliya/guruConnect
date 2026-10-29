import { useState, useEffect } from "react";
import { 
  MdSave, 
  MdImage, 
  MdContactPhone,
  MdVisibility
} from "react-icons/md";
import { Link } from "react-router-dom";
import api from "../../../api/axiosInstance";
import ImageUploadField from "./ImageUploadField";
import { useToast } from "../../../context/ToastContext";

export default function ContactCMS() {
  const { showToast } = useToast();
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
        showToast("Contact content published successfully!", "success");
      }
    } catch (error) {
      showToast("Failed to update content", "error");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'banner', label: 'Page Banner', icon: <MdImage size={16} /> },
    { id: 'details', label: 'Contact Details & Map', icon: <MdContactPhone size={16} /> },
  ];

  return (
    <div className="space-y-5 animate-fadeIn max-w-content mx-auto pb-12 font-sans">
      
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[13px] text-ink-secondary flex items-center gap-1.5">
            <Link to="/admin/cms" className="hover:text-primary transition-colors">Website CMS</Link>
            <span>›</span>
            <span className="text-ink">Contact</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
            Contact CMS
          </h1>
          <div className="text-[13px] text-ink-secondary">
            Manage school campus address, helpline numbers, emails, and Google Maps embed.
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a 
            href={`${import.meta.env.VITE_SCHOOL_WEBSITE_URL || 'http://localhost:5174'}/contact`}
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
                    <p className="text-xs text-ink-secondary">Header section for Contact page</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-ink-secondary mb-1">Banner Title</label>
                      <input 
                        value={contactData.bannerTitle}
                        onChange={(e) => setContactData({...contactData, bannerTitle: e.target.value})}
                        className="w-full bg-surface-subtle border border-line-input rounded-control h-10 px-3 text-xs text-ink outline-none focus:bg-white focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-secondary mb-1">Banner Subtitle</label>
                      <textarea 
                        value={contactData.bannerSubtitle}
                        onChange={(e) => setContactData({...contactData, bannerSubtitle: e.target.value})}
                        rows={3}
                        className="w-full bg-surface-subtle border border-line-input rounded-control p-3 text-xs text-ink outline-none focus:bg-white focus:border-primary transition-colors resize-none"
                      />
                    </div>
                    <div className="pt-2 border-t border-line-row">
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
                <div className="bg-white rounded-card p-5 sm:p-6 border border-line shadow-xs space-y-5">
                  <div className="pb-1 border-b border-line-row">
                    <h2 className="text-base font-semibold text-ink">Contact Details & Map</h2>
                    <p className="text-xs text-ink-secondary">Official institutional coordinates and map locator</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Address */}
                    <div className="space-y-3 p-4 bg-surface-subtle rounded-control border border-line-row">
                      <div>
                        <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Address Label</label>
                        <input 
                          value={contactData.addressTitle}
                          onChange={(e) => setContactData({...contactData, addressTitle: e.target.value})}
                          className="w-full bg-white border border-line-input rounded-control h-9 px-2.5 text-xs text-ink font-medium outline-none focus:border-primary transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Address Detail</label>
                        <textarea 
                          value={contactData.addressDetail}
                          onChange={(e) => setContactData({...contactData, addressDetail: e.target.value})}
                          rows={2}
                          className="w-full bg-white border border-line-input rounded-control p-2 text-xs text-ink outline-none focus:border-primary transition-colors resize-none"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-3 p-4 bg-surface-subtle rounded-control border border-line-row">
                      <div>
                        <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Phone Label</label>
                        <input 
                          value={contactData.phoneTitle}
                          onChange={(e) => setContactData({...contactData, phoneTitle: e.target.value})}
                          className="w-full bg-white border border-line-input rounded-control h-9 px-2.5 text-xs text-ink font-medium outline-none focus:border-primary transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Phone Detail</label>
                        <textarea 
                          value={contactData.phoneDetail}
                          onChange={(e) => setContactData({...contactData, phoneDetail: e.target.value})}
                          rows={2}
                          className="w-full bg-white border border-line-input rounded-control p-2 text-xs text-ink font-mono outline-none focus:border-primary transition-colors resize-none"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-3 p-4 bg-surface-subtle rounded-control border border-line-row">
                      <div>
                        <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Email Label</label>
                        <input 
                          value={contactData.emailTitle}
                          onChange={(e) => setContactData({...contactData, emailTitle: e.target.value})}
                          className="w-full bg-white border border-line-input rounded-control h-9 px-2.5 text-xs text-ink font-medium outline-none focus:border-primary transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Email Detail</label>
                        <textarea 
                          value={contactData.emailDetail}
                          onChange={(e) => setContactData({...contactData, emailDetail: e.target.value})}
                          rows={2}
                          className="w-full bg-white border border-line-input rounded-control p-2 text-xs text-ink outline-none focus:border-primary transition-colors resize-none"
                        />
                      </div>
                    </div>

                    {/* Hours */}
                    <div className="space-y-3 p-4 bg-surface-subtle rounded-control border border-line-row">
                      <div>
                        <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Hours Label</label>
                        <input 
                          value={contactData.hoursTitle}
                          onChange={(e) => setContactData({...contactData, hoursTitle: e.target.value})}
                          className="w-full bg-white border border-line-input rounded-control h-9 px-2.5 text-xs text-ink font-medium outline-none focus:border-primary transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Hours Detail</label>
                        <textarea 
                          value={contactData.hoursDetail}
                          onChange={(e) => setContactData({...contactData, hoursDetail: e.target.value})}
                          rows={2}
                          className="w-full bg-white border border-line-input rounded-control p-2 text-xs text-ink outline-none focus:border-primary transition-colors resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 p-4 bg-surface-subtle rounded-control border border-line-row">
                    <label className="block text-xs font-semibold text-ink-secondary">Google Maps Embed URL</label>
                    <textarea 
                      value={contactData.mapEmbedUrl}
                      onChange={(e) => setContactData({...contactData, mapEmbedUrl: e.target.value})}
                      rows={3}
                      placeholder="https://www.google.com/maps/embed?..."
                      className="w-full bg-white border border-line-input rounded-control p-3 text-xs text-ink font-mono outline-none focus:border-primary transition-colors"
                    />
                    <p className="text-[11px] text-ink-secondary">Paste the 'src' URL from Google Maps embed iframe code.</p>
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
