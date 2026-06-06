import { useState, useEffect } from "react";
import { 
  MdPhotoLibrary, 
  MdSave, 
  MdImage, 
  MdTextFields, 
  MdAdd,
  MdDelete,
  MdLayers,
  MdPlayArrow,
  MdFilterList
} from "react-icons/md";
import api from "../../../api/axiosInstance";
import type { GalleryData } from "../../../types/admin/cms";

export default function GalleryCMS() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [galleryData, setGalleryData] = useState<GalleryData>({
    bannerTitle: "Visual Journey",
    bannerSubtitle: "Explore the vibrant life at Gyansthali through our lensâ€”from infrastructure to historic achievements.",
    items: [
      { title: "Modern Science Lab", category: "Campus", img: "/images/redesign/academics_lab.png" },
      { title: "Annual Day 2026 Celebration", category: "Events", img: "/images/redesign/gallery_event.png" },
      { title: "Inter-School Basketball Finals", category: "Sports", img: "/images/redesign/gallery_sports.png" },
      { title: "Academic Board Toppers 2026", category: "Toppers", img: "/images/redesign/achievements_banner.png" },
    ]
  });

  const categories = ["Campus", "Events", "Sports", "Toppers"];

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setFetching(true);
        const response = await api.get('/cms/gallery');
        if (response.data.success && response.data.data) {
          const incoming = response.data.data;
          const cleanData: any = {};
          
          Object.keys(incoming).forEach(key => {
            const val = incoming[key];
            if (Array.isArray(val)) {
              const cleanArray = val.filter(item => {
                if (typeof item === 'object') {
                  return Object.values(item).some(v => v !== "" && v !== null);
                }
                return item !== "" && item !== null;
              });
              if (cleanArray.length > 0) cleanData[key] = cleanArray;
            } else if (val && val !== "") {
              cleanData[key] = val;
            }
          });
          
          setGalleryData(prev => ({ ...prev, ...cleanData }));
        }
      } catch (error) {
        console.error("Error fetching gallery data:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchGalleryData();
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

  const addItem = () => {
    setGalleryData({
      ...galleryData,
      items: [...galleryData.items, { title: "", category: "Campus", img: "" }]
    });
  };

  const removeItem = (index: number) => {
    const newItems = galleryData.items.filter((_, i) => i !== index);
    setGalleryData({ ...galleryData, items: newItems });
  };

  return (
    <div className="py-6 space-y-8 animate-fadeIn relative text-slate-900">
      
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-slate-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <MdPhotoLibrary className="text-indigo-600" />
            Media Hub CMS
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage your visual library and event archives.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={addItem}
            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
          >
            <MdAdd size={20} className="text-indigo-600" />
            Add Image
          </button>
          <button 
            onClick={handleSave}
            disabled={loading || fetching}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-70"
          >
            <MdSave size={20} />
            {loading ? "Updating..." : "Publish Hub"}
          </button>
        </div>
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
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-600 outline-none focus:bg-white focus:border-indigo-500 transition-all text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Media Items List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(galleryData?.items || []).map((item, index) => (
              <div key={index} className="group bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm space-y-4 relative">
                <button 
                  onClick={() => removeItem(index)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                >
                  <MdDelete size={18} />
                </button>

                <div className="aspect-video rounded-2xl bg-slate-100 border border-slate-100 overflow-hidden relative cursor-pointer group/img">
                  {item.img ? (
                    <img src={item.img} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" alt="Gallery" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-300">
                      <MdImage size={32} />
                      <span className="text-[8px] font-black uppercase tracking-widest mt-2">No Image</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                   <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Title</label>
                      <input 
                        value={item.title}
                        onChange={(e) => {
                          const newItems = [...galleryData.items];
                          newItems[index].title = e.target.value;
                          setGalleryData({...galleryData, items: newItems});
                        }}
                        placeholder="e.g. Annual Day 2026"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 font-black text-slate-800 text-xs outline-none focus:bg-white focus:border-indigo-500 transition-all"
                      />
                   </div>

                   <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
                      <input 
                        value={item.img}
                        onChange={(e) => {
                          const newItems = [...galleryData.items];
                          newItems[index].img = e.target.value;
                          setGalleryData({...galleryData, items: newItems});
                        }}
                        placeholder="https://..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 font-bold text-slate-700 text-[10px] outline-none focus:bg-white focus:border-indigo-500 transition-all"
                      />
                   </div>

                   <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Category Tag</label>
                      <div className="flex flex-wrap gap-2 pt-1">
                         {categories.map(cat => (
                           <button 
                             key={cat}
                             onClick={() => {
                               const newItems = [...galleryData.items];
                               newItems[index].category = cat;
                               setGalleryData({...galleryData, items: newItems});
                             }}
                             className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                               item.category === cat 
                                 ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                                 : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                             }`}
                           >
                             {cat}
                           </button>
                         ))}
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info & Preview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdFilterList size={16} className="text-indigo-500" />
              Content Strategy
            </div>
            
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
              <div className="flex items-center gap-3 mb-2">
                <MdLayers className="text-indigo-600" size={18} />
                <span className="text-xs font-black text-indigo-900 uppercase">Pro Tip</span>
              </div>
              <p className="text-[10px] text-indigo-400 font-medium leading-relaxed">
                Add 8-12 high-quality images spread across all categories to keep the Media Hub looking professional and balanced.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100">
            <h4 className="font-black text-lg mb-2">Live Preview</h4>
            <p className="text-slate-400 text-xs mb-6">Verify your changes on the public gallery page.</p>
            <a 
              href={`${import.meta.env.VITE_SCHOOL_WEBSITE_URL || "http://localhost:5174"}/gallery`} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all"
            >
              <MdPlayArrow size={24} />
              <span className="font-bold text-sm">Open Media Hub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
