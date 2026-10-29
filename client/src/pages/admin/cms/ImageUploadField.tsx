import { useState } from "react";
import api from "../../../api/axiosInstance";
import { MdCloudUpload } from "react-icons/md";
import { useToast } from "../../../context/ToastContext";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  className?: string;
  isSmall?: boolean;
}

export default function ImageUploadField({ label, value, onChange, className = "", isSmall = false }: ImageUploadFieldProps) {
  const { showToast } = useToast();
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
        showToast("Image uploaded successfully!", "success");
      } else {
        showToast("Image upload failed", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error uploading image. Please check file format and size.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className={`block text-xs font-semibold text-ink-secondary`}>
        {label}
      </label>
      <div className="flex gap-2 items-center">
        {value && (
          <div className="shrink-0 w-10 h-10 rounded-control bg-surface-subtle overflow-hidden border border-line-input shadow-xs flex items-center justify-center">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Image URL or upload from device..."
          className={`flex-1 bg-surface-subtle border border-line-input rounded-control ${
            isSmall ? 'h-9 px-2.5 text-xs' : 'h-10 px-3 text-xs'
          } text-ink outline-none focus:border-primary focus:bg-white transition-colors`}
        />
        <div className="relative group shrink-0">
          <input 
            type="file" 
            onChange={handleUpload} 
            accept="image/*" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            title="Upload Image"
          />
          <div className={`flex items-center gap-1.5 ${
            isSmall ? 'h-9 px-3 text-xs' : 'h-10 px-3.5 text-xs'
          } bg-primary-tint hover:bg-primary-tint/80 border border-primary/20 text-primary-dark rounded-control font-semibold transition-colors cursor-pointer shadow-xs ${
            uploading ? 'opacity-70' : ''
          }`}>
            {uploading ? (
              <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <MdCloudUpload size={16} />
            )}
            <span>{uploading ? "Uploading..." : "Upload"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
