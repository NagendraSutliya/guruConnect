import { useState, useEffect } from "react";
import { 
  MdSave, 
  MdImage, 
  MdPlayArrow,
  MdPhotoLibrary
} from "react-icons/md";
import api from "../../../api/axiosInstance";
import ImageUploadField from "./ImageUploadField";

export default function GalleryCMS() {
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
        alert("Gallery content published successfully!");
      }
    } catch (error) {
      alert("Failed to update content");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'banner', label: 'Page Banner', icon: <MdImage /> },
    { id: 'items', label: 'Gallery Items', icon: <MdPhotoLibrary /> },
  ];

  const updateArrayItem = (arrayName: string, index: number, field: string, value: string) => {
    setGalleryData((prev: any) => {
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
            <MdPhotoLibrary className="text-indigo-600" />
            Gallery CMS
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage school photos and visual assets.</p>
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
              href={`\${import.meta.env.VITE_SCHOOL_WEBSITE_URL || 'http://localhost:5174'}/gallery`}
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
                        value={galleryData.bannerTitle}
                        onChange={(e) => setGalleryData({...galleryData, bannerTitle: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-black text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Banner Subtitle</label>
                      <textarea 
                        value={galleryData.bannerSubtitle}
                        onChange={(e) => setGalleryData({...galleryData, bannerSubtitle: e.target.value})}
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-600 outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm leading-relaxed"
                      />
                    </div>
                    <div className="pt-4 border-t border-slate-100">
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
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-slate-800">Gallery Items</h3>
                    <button 
                      onClick={() => setGalleryData(prev => ({...prev, items: [...prev.items, { title: "New Image", category: "Campus", img: "" }]}))}
                      className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-100 transition-colors"
                    >
                      + Add Image
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {galleryData.items.map((item, i) => (
                      <div key={i} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-4 relative group">
                        <button 
                          onClick={() => setGalleryData({...galleryData, items: galleryData.items.filter((_, idx) => idx !== i)})}
                          className="absolute -top-3 -right-3 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold shadow-md hover:bg-red-500 hover:text-white"
                        >
                          ×
                        </button>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Image Title</label>
                            <input 
                              value={item.title}
                              onChange={(e) => updateArrayItem('items', i, 'title', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-slate-800 text-sm outline-none mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                            <input 
                              value={item.category}
                              onChange={(e) => updateArrayItem('items', i, 'category', e.target.value)}
                              placeholder="e.g. Campus, Sports"
                              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-indigo-600 text-sm outline-none mt-1"
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
