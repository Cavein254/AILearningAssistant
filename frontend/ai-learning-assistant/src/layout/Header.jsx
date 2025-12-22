import React from "react";
import { useAuth } from "../context/Authcontext";
import { Bell, User, Menu, ChevronDown } from "lucide-react";

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-white/70 backdrop-blur-md border-b border-slate-200/60">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between h-full px-4 md:px-8">
        {/* Mobile Menu Button - Glass Style */}
        <button
          onClick={toggleSidebar}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 hover:bg-slate-900 hover:text-white transition-all duration-300 active:scale-95"
          aria-label="Toggle Sidebar"
        >
          <Menu size={22} strokeWidth={2.5} />
        </button>

        {/* Spacer for desktop layout alignment */}
        <div className="hidden md:block" />

        {/* Right Actions Area */}
        <div className="flex items-center gap-2 md:gap-5">
          {/* Notification Button */}
          <button className="relative group inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-300">
            <Bell
              size={20}
              strokeWidth={2}
              className="group-hover:rotate-12 transition-transform"
            />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 border-2 border-white rounded-full"></span>
          </button>

          {/* Vertical Divider */}
          <div className="h-6 w-[1px] bg-slate-200 hidden sm:block" />

          {/* User Profile Pill */}
          <div className="flex items-center gap-3 pl-1 pr-1 md:pr-4 py-1 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform">
                <User size={18} strokeWidth={2.5} />
              </div>
              {/* Status Indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-slate-900 leading-none mb-0.5">
                {user?.username || "Username"}
              </p>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider leading-none">
                {user?.email || "Email"}
              </p>
            </div>

            {/* Optional Dropdown Arrow */}
            <ChevronDown
              size={14}
              className="text-slate-400 hidden md:block group-hover:text-slate-600 transition-colors"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
