import React from "react";
import { Menu, LogOut, CheckCircle2 } from "lucide-react";

export default function Navbar({ user, onLogout, onToggleSidebar }) {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand identity for mobile/top bar */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900 hidden sm:inline-block">
            TaskMaster
          </span>
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 pl-2">
          <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center border border-brand-200">
            {initials}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-none">
              {user?.name || "User"}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-none">
              {user?.email || ""}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          title="Sign Out"
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors ml-1"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
