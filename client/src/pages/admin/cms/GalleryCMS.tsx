import { useState, useEffect } from "react";
import { 
  MdSave, 
  MdImage, 
  MdPhotoLibrary,
  MdVisibility,
  MdAdd,
  MdClose
} from "react-icons/md";
import { Link } from "react-router-dom";
import api from "../../../api/axiosInstance";
import ImageUploadField from "./ImageUploadField";
import { useToast } from "../../../context/ToastContext";

export default function GalleryCMS() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState("banner");

  const [galleryData, setGalleryData] = useState({
    bannerTitle: "Visual Journey",
    bannerSubtitle: "Explore the vibrant life at Gyansthali through our lens.",
    bannerImage: "/images/redesign/about_banner.png",
    items: [
      { title: "Campus Entrance", category: "Campus", img: "/images/redesign/about_banner.png" }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        const response = await api.get('/cms/gallery');
        if (response.data.success && response.data.data) {
          const incoming = response.data.data;
          setGalleryData(prev => {
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
        console.error("Error fetching gallery data:", error);
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
        section: 'gallery',
        content: galleryData
      });
      if (response.data.success) {
        showToast("Gallery content published successfully!", "success");
      }
    } catch (error) {
      showToast("Failed to update content", "error");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'banner', label: 'Page Banner', icon: <MdImage size={16} /> },
    { id: 'items', label: 'Gallery Items', icon: <MdPhotoLibrary size={16} /> },
  ];

  const updateArrayItem = (arrayName: string, index: number, field: string, value: string) => {
    setGalleryData((prev: any) => {
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
            <span className="text-ink">Gallery</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
            Gallery CMS
          </h1>
          <div className="text-[13px] text-ink-secondary">
            Manage school photos, activities, and campus visual assets.
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a 
            href={`${import.meta.env.VITE_SCHOOL_WEBSITE_URL || 'http://localhost:5174'}/gallery`}
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
                    <p className="text-xs text-ink-secondary">Hero banner at the top of the Gallery page</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-ink-secondary mb-1">Banner Title</label>
                      <input 
                        value={galleryData.bannerTitle}
                        onChange={(e) => setGalleryData({...galleryData, bannerTitle: e.target.value})}
                        className="w-full bg-surface-subtle border border-line-input rounded-control h-10 px-3 text-xs text-ink outline-none focus:bg-white focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-secondary mb-1">Banner Subtitle</label>
                      <textarea 
                        value={galleryData.bannerSubtitle}
                        onChange={(e) => setGalleryData({...galleryData, bannerSubtitle: e.target.value})}
                        rows={3}
                        className="w-full bg-surface-subtle border border-line-input rounded-control p-3 text-xs text-ink outline-none focus:bg-white focus:border-primary transition-colors resize-none"
                      />
                    </div>
                    <div className="pt-2 border-t border-line-row">
                      <ImageUploadField
                        label="Banner Background Image"
                        value={galleryData.bannerImage}
                        onChange={(url) => setGalleryData({...galleryData, bannerImage: url})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ITEMS TAB */}
              {activeTab === 'items' && (
                <div className="bg-white rounded-card p-5 sm:p-6 border border-line shadow-xs space-y-4">
                  <div className="flex justify-between items-center pb-1 border-b border-line-row flex-wrap gap-2">
                    <div>
                      <h2 className="text-base font-semibold text-ink">Gallery Photos</h2>
                      <p className="text-xs text-ink-secondary">Upload images with titles and categories</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setGalleryData(prev => ({...prev, items: [...prev.items, { title: "New Image", category: "Campus", img: "" }]}))}
                      className="min-h-[36px] px-3.5 rounded-control bg-primary-tint hover:bg-primary-tint/80 border border-primary/20 text-primary-dark font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <MdAdd size={16} />
                      <span>Add Photo</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {galleryData.items.map((item, i) => (
                      <div key={i} className="p-4 bg-surface-subtle rounded-control border border-line-row space-y-3 relative group">
                        <button 
                          type="button"
                          onClick={() => setGalleryData({...galleryData, items: galleryData.items.filter((_, idx) => idx !== i)})}
                          className="absolute top-2 right-2 w-7 h-7 bg-white hover:bg-danger-bg text-ink-secondary hover:text-danger border border-line-input rounded-control flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                          title="Remove item"
                        >
                          <MdClose size={15} />
                        </button>
                        <div className="grid grid-cols-2 gap-3 pr-8">
                          <div>
                            <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Image Title</label>
                            <input 
                              value={item.title}
                              onChange={(e) => updateArrayItem('items', i, 'title', e.target.value)}
                              className="w-full bg-white border border-line-input rounded-control h-9 px-2.5 text-xs text-ink font-medium outline-none focus:border-primary transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Category</label>
                            <input 
                              value={item.category}
                              onChange={(e) => updateArrayItem('items', i, 'category', e.target.value)}
                              placeholder="e.g. Campus, Sports"
                              className="w-full bg-white border border-line-input rounded-control h-9 px-2.5 text-xs text-ink font-medium outline-none focus:border-primary transition-colors"
                            />
                          </div>
                        </div>
                        <ImageUploadField
                          label="Upload Image"
                          value={item.img}
                          onChange={(url) => updateArrayItem('items', i, 'img', url)}
                          isSmall
                        />
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
