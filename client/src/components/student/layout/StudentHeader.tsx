import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    <header className="w-full bg-white shadow px-6 py-3 flex justify-between items-center">
      <h2 className="text-lg font-semibold text-gray-700">Student Portal</h2>

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
