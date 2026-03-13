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
      className={`fixed top-5 right-5 ${bgColor} text-white px-4 py-2 rounded shadow-md`}
    >
      {message}
    </div>
  );
};

export default Toast;
