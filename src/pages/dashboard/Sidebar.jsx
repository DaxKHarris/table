import logo from "../../assets/ayt_text.png";
import iconOnly from "../../assets/ayt_icon.png";
import {
  Home,
  Settings2,
  Search,
  History,
  EllipsisVertical,
  Leaf,
  Moon,
  Sun,
} from "lucide-react";
const Sidebar = ({ isDarkMode, setIsDarkMode, currentView, onNavigate }) => {
  // In Sidebar.jsx, update the navItems array:
  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    {
      icon: Settings2,
      label: "Configurations",
      path: "/dashboard/configurations",
    },
    { icon: History, label: "Archives", path: "/dashboard/archives" }, // Changed from History
  ];

  const profile = {
    initials: "DH",
    username: "DaxKHarris",
  };

  return (
    <aside
      className={`group fixed left-0 top-0 h-full w-16 hover:w-64 ${
        isDarkMode
          ? "bg-emerald-950 border-emerald-900"
          : "bg-emerald-900 border-emerald-800"
      } border-r transition-all duration-300 ease-in-out flex flex-col z-50 shadow-lg`}
    >
      <div className="flex items-start h-20 relative pt-3">
        {/* Icon - centered in collapsed state, larger size */}
        <div className="w-16 flex justify-center">
          <img
            src={iconOnly}
            alt="Logo"
            className="w-8 h-12 flex-shrink-0 object-contain"
          />
        </div>

        {/* Text part - top-aligned with icon, larger size */}
        <div className="flex-1">
          <img
            src={logo}
            alt="Logo"
            className="h-16 object-contain object-left"
          />
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive =
              item.path && currentView === item.path.split("/").pop();

            return (
              <li key={index}>
                <button
                  onClick={() => item.path && onNavigate(item.path)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    isActive
                      ? isDarkMode
                        ? "bg-emerald-800/70 text-white"
                        : "bg-emerald-700/70 text-white"
                      : isDarkMode
                      ? "hover:bg-emerald-900/50 text-emerald-100 hover:text-white"
                      : "hover:bg-emerald-800/50 text-emerald-100 hover:text-white"
                  }`}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm">
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-4 pb-2">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
            isDarkMode
              ? "hover:bg-emerald-900/50 text-emerald-100 hover:text-white"
              : "hover:bg-emerald-800/50 text-emerald-100 hover:text-white"
          }`}
        >
          <div className="relative w-5 h-5 flex-shrink-0">
            <Moon
              className={`absolute w-5 h-5 transition-opacity duration-300 ${
                isDarkMode ? "opacity-0" : "opacity-100"
              }`}
            />
            <Sun
              className={`absolute w-5 h-5 transition-opacity duration-300 ${
                isDarkMode ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm">
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </span>
        </button>
      </div>

      <div
        className={`p-4 ${
          isDarkMode ? "border-emerald-900" : "border-emerald-800"
        } border-t`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-semibold shadow-md ring-2 ring-emerald-700/30">
            {profile.initials}
          </div>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm font-medium text-white">
            {profile.username}
          </span>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
