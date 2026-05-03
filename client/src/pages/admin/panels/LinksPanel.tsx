import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import {  FiCopy, FiExternalLink, FiRefreshCw, FiCheck } from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

const LinksPanel = () => {
  const { showToast } = useToast();
  const [link, setLink] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    api
      .get("/admin/link", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((res) => setLink(res.data.data || null))
      .finally(() => setLoading(false));
  }, []);

  const generateLink = async () => {
    try {
      setLoading(true);
      const res = await api.post(
        "/admin/link",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      setLink(res.data);
      showToast("Access portal link generated successfully", "success");
    } catch (err) {
      showToast("Link generation failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopying(true);
    showToast("Link copied to clipboard", "success");
    setTimeout(() => setCopying(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 opacity-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-black uppercase tracking-widest text-slate-500">Syncing Gateway...</p>
      </div>
    );
  }

  const url = link?.linkCode ? `${window.location.origin}/feedback/${link.linkCode}` : "";

  return (
    <div className="min-h-[70vh] flex flex-col animate-fadeIn p-4">
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-blue-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-blue-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Public Access Portal</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage your institution's public feedback entry point.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setLoading(true);
              api.get("/admin/link", { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }).then(res => setLink(res.data.data || null)).finally(() => setLoading(false));
            }}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-sm"
          >
            <FiRefreshCw />
            <span>Sync Gateway</span>
          </button>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-md rounded-[3rem] border border-white/20 shadow-2xl overflow-hidden relative">

          {(!link || !link.linkCode) ? (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm font-medium mb-8">
                No active gateway found. Generate a secure, unique link to start collecting student feedback publicly.
              </p>
              <button
                onClick={generateLink}
                className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-200 transition-all active:scale-95"
              >
                <FiRefreshCw className="animate-spin-slow" />
                Initialize Portal
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 ml-1">Secure Feedback URL</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-white border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-600 truncate shadow-sm">
                    {url}
                  </div>
                  <button
                    onClick={() => copyLink(url)}
                    className={`flex items-center justify-center w-14 h-14 rounded-2xl transition-all active:scale-90 shadow-lg ${
                      copying ? "bg-emerald-500 text-white shadow-emerald-200" : "bg-slate-900 text-white shadow-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    {copying ? <FiCheck size={20} /> : <FiCopy size={20} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 font-black text-xs uppercase tracking-widest hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm"
                >
                  <FiExternalLink />
                  Preview Portal
                </a>
                <button
                  onClick={generateLink}
                  className="flex items-center justify-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 font-black text-xs uppercase tracking-widest hover:border-rose-200 hover:text-rose-600 transition-all shadow-sm"
                >
                  <FiRefreshCw />
                  Regenerate Link
                </button>
              </div>

              {copying && (
                <div className="flex items-center justify-center gap-2 text-emerald-600 animate-pulse">
                   <FiCheck className="text-lg" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Link Copied to Clipboard</span>
                </div>
              )}
            </div>
          )}
        </div>

    </div>
  );
};

export default LinksPanel;
