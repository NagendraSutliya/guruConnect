import {
  BellIcon,
  BellAlertIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const TopBar = () => {
  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm border-b">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {/* You can replace this with an <img> or SVG */}
          🎓
        </div>
        <h1 className="text-lg font-semibold text-gray-800">
          Teacher Dashboard
        </h1>
      </div>

      {/* Right: Icons + Avatar */}
      <div className="flex items-center gap-5">
        {/* Notification Bell */}
        <button
          aria-label="Notifications"
          className="relative p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <BellIcon className="w-6 h-6 text-gray-600" />
          {/* Optional: Notification badge */}
          <span className="absolute top-0 right-0 block w-2 h-2 rounded-full bg-red-500"></span>
        </button>

        {/* Alert/Other Icon */}
        <button
          aria-label="Alerts"
          className="relative p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <BellAlertIcon className="w-6 h-6 text-gray-600" />
        </button>

        {/* User Avatar + Dropdown */}
        <button
          className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="User menu"
        >
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="User avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <ChevronDownIcon className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
