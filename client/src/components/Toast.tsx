import { useEffect } from "react";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warn";
  onClose: () => void;
}

const Toast = ({ message, type = "info", onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // auto close after 3s
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : type === "warn"
      ? "bg-yellow-500"
      : "bg-blue-500";

  return (
    <div
      className={`fixed top-8 right-8 z-[99999] ${bgColor} text-white px-6 py-4 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center gap-4 animate-slideIn backdrop-blur-xl border border-white/30 min-w-[300px] pointer-events-auto`}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-0.5">Notification</p>
        <span className="font-bold text-sm tracking-tight">{message}</span>
      </div>
      <button 
        onClick={onClose}
        className="hover:bg-white/10 p-2 rounded-lg transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
