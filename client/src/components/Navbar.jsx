import React from "react";
import { Brain, LogOut, User } from "lucide-react";

export default function Navbar({ onLogout, userName }) {
  return (
    <nav className="bg-white/70 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg text-slate-900">
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-200">
            <Brain size={20} className="text-white" />
          </div>
          <span>Brainly</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            <User size={12} /> <span>{userName || "User"}</span>
          </div>
          <button
            onClick={onLogout}
            className="text-slate-400 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
