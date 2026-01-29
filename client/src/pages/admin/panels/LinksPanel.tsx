import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";

const LinksPanel = () => {
  const [link, setLink] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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
    setMessage("Public link generated");
    setTimeout(() => setMessage(""), 2000);
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setMessage("Link copied to clipboard");
    setTimeout(() => setMessage(""), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const url = link ? `http://localhost:5173/feedback/${link.linkCode}` : "";

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full min-h-[30vh] space-y-4">
        <h2 className="text-xl font-semibold text-center">
          🔗 Public Feedback Link
        </h2>

        {/* {!link && ( */}
        {(!link || !link.linkCode) && (
          <div className="text-center space-y-4">
            <p className="text-gray-500 text-sm">
              No public feedback link exists yet.
            </p>
            <button
              onClick={generateLink}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition"
            >
              Generate Link
            </button>
          </div>
        )}

        {link && (
          <div className="relative">
            <input
              readOnly
              value={url}
              onFocus={(e) => e.target.select()}
              className="w-full border rounded-lg p-2 pr-20 text-sm bg-gray-50"
            />

            {/* ICONS */}
            <div className="absolute inset-y-0 right-2 flex items-center gap-2">
              {/* OPEN */}
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="group relative cursor-pointer text-gray-600 hover:text-blue-600"
              >
                🔗
                <span
                  className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 
                  whitespace-nowrap rounded bg-black text-white text-xs px-2 py-1 
                  opacity-0 group-hover:opacity-100 transition"
                >
                  Open link
                </span>
              </a>

              {/* COPY */}
              <button
                onClick={() => copyLink(url)}
                className="group relative cursor-pointer text-gray-600 hover:text-green-600"
              >
                📋
                <span
                  className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 
                  whitespace-nowrap rounded bg-black text-white text-xs px-2 py-1 
                  opacity-0 group-hover:opacity-100 transition"
                >
                  Copy link
                </span>
              </button>
            </div>
          </div>
        )}

        {message && (
          <p className="text-center text-sm text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default LinksPanel;
