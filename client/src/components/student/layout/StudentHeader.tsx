import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";

interface Props {
  openProfile: () => void;
}

const StudentHeader = ({ openProfile }: Props) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const closeDropdown = () => setOpen(false);

  const goToProfile = () => {
    // navigate("/student/profile");
    openProfile();
    closeDropdown();
  };

  const goToChangePassword = () => {
    navigate("/student/change-password");
    closeDropdown();
  };

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("studentToken");
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between bg-white border-b border-slate-100 px-6 h-20 sticky top-0 z-40">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/guruconnect-logo.png"
            alt="GuruConnect Logo"
            className="h-16 w-auto object-contain"
          />
          <div className="flex flex-col justify-center">
            <span className="text-xl font-black tracking-tighter leading-none">
              <span className="text-orange-600">guru</span>
              <span className="text-blue-600">Connect</span>
            </span>
          </div>
        </Link>

        <div className="h-8 w-px bg-slate-200 hidden md:block" />

        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-orange-50 rounded-lg">
          <GraduationCap className="text-orange-600 w-5 h-5" />
          <span className="text-sm font-bold text-orange-700 uppercase tracking-wider">Student Portal</span>
        </div>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2"
        >
          <div className="w-9 h-9 bg-purple-600 text-white flex items-center justify-center rounded-full">
            S
          </div>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
            <button
              onClick={goToProfile}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Profile
            </button>

            <button
              onClick={goToChangePassword}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Change Password
            </button>

            <div className="border-t" />

            <button
              onClick={logout}
              className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default StudentHeader;
