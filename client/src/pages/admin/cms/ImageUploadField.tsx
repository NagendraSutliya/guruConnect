import { useState } from "react";
import api from "../../../api/axiosInstance";
import { MdCloudUpload } from "react-icons/md";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  className?: string;
  isSmall?: boolean;
}

export default function ImageUploadField({ label, value, onChange, className = "", isSmall = false }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const data = new FormData();
      data.append("file", file);

      const uploadRes = await api.post("/upload/single", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (uploadRes.data.success) {
        onChange(uploadRes.data.data.url);
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image. Make sure file is an image and size is reasonable.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className={`${isSmall ? 'text-[10px]' : 'text-xs'} font-black ${isSmall ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-widest ml-1`}>
        {label}
      </label>
      <div className="flex gap-2 items-center">
        {value && (
          <div className="shrink-0 w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Image URL or upload..."
          className={`flex-1 bg-slate-50 border border-slate-100 rounded-xl ${isSmall ? 'py-2 px-3 text-xs' : 'py-3 px-4 text-sm'} font-medium text-slate-800 outline-none focus:border-indigo-500 transition-all focus:bg-white`}
        />
        <div className="relative group">
          <input 
            type="file" 
            onChange={handleUpload} 
            accept="image/*" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            title="Upload Image"
          />
          <div className={`flex items-center gap-2 ${isSmall ? 'px-3 py-2 text-[10px]' : 'px-4 py-3 text-xs'} bg-indigo-50 text-indigo-600 rounded-xl font-black uppercase tracking-widest group-hover:bg-indigo-100 transition-colors ${uploading ? 'opacity-70' : ''}`}>
            {uploading ? (
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <MdCloudUpload size={isSmall ? 16 : 20} />
            )}
            {!isSmall && (uploading ? "Uploading" : "Upload")}
          </div>
        </div>
      </div>
    </div>
  );
}
