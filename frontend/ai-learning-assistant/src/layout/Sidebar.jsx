import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  BrainCircuit,
  BookOpen,
  X,
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/documents", icon: FileText, label: "Documents" },
    { to: "/flashcards", icon: BookOpen, label: "Flashcards" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] md:hidden transition-all duration-500 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white/80 backdrop-blur-2xl border-r border-slate-200/60 z-[70] 
    md:sticky md:translate-x-0 md:flex md:flex-col transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
      isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
    }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-20 px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200">
              <BrainCircuit
                size={22}
                strokeWidth={2.5}
                className="text-white"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-bold text-slate-900 leading-none">
                AI Assistant
              </h1>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter mt-1">
                Learning Lab
              </span>
            </div>
          </div>

          {/* Close button - only visible on mobile */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Area */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar">
          <p className="px-4 mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Main Menu
          </p>
          <ul className="space-y-1.5">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={() => window.innerWidth < 768 && toggleSidebar()}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Indicator Bar */}
                      {isActive && (
                        <div className="absolute left-0 w-1 h-5 bg-emerald-500 rounded-r-full" />
                      )}
                      <link.icon
                        size={20}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={`transition-all duration-300 ${
                          isActive
                            ? "scale-110"
                            : "group-hover:scale-110 group-hover:text-emerald-500"
                        }`}
                      />
                      <span className="text-sm font-bold tracking-tight">
                        {link.label}
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Section */}
        <div className="p-4 mt-auto border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-4 py-3 text-sm font-bold text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
          >
            <div className="p-1.5 rounded-lg group-hover:bg-red-100 transition-colors">
              <LogOut size={18} strokeWidth={2.5} />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
