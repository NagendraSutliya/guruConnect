import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const CookieNotice: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("guruconnect_cookie_consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = (type: "essential" | "all") => {
    localStorage.setItem("guruconnect_cookie_consent", type);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-[120] animate-in fade-in slide-in-from-bottom duration-300">
      <div className="bg-white border border-line rounded-hero p-5 shadow-2xl flex flex-col gap-4 text-ink">
        <p className="text-xs sm:text-sm text-ink-body2 leading-relaxed">
          We use essential cookies to run this site and, with your permission, analytics cookies to improve it. Read our{" "}
          <Link to="/privacy" className="text-primary font-semibold hover:underline">
            Privacy policy
          </Link>
          .
        </p>

        <div className="flex items-center gap-2.5 justify-end">
          <button
            onClick={() => handleAccept("essential")}
            className="px-4 py-2 bg-page hover:bg-surface-subtle border border-line-input text-ink text-xs sm:text-sm font-semibold rounded-control transition-all"
          >
            Only essential
          </button>
          <button
            onClick={() => handleAccept("all")}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-bold rounded-control shadow-sm transition-all"
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
};
