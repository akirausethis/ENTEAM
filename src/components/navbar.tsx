"use client";

import { Bell, Search, ChevronDown } from "lucide-react";

export const Navbar = () => {
  // Nanti ini bisa kamu ambil dari session/auth (Clerk/NextAuth)
  const user = {
    name: "Kelvin",
    plan: "Free Plan",
    avatar: "" // Kosongkan untuk inisial
  };

  return (
    <nav className="h-20 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-50">
      
      {/* SEARCH BAR (Optional left side) */}
      <div className="hidden md:flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-2xl w-96 group focus-within:border-indigo-500/50 transition-all">
        <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400" />
        <input 
          placeholder="Quick search..." 
          className="bg-transparent border-none text-sm text-white focus:outline-none w-full"
        />
      </div>

      {/* RIGHT SIDE ACTIONS */}
      <div className="flex items-center gap-6 ml-auto">
        
        {/* NOTIFICATIONS */}
        <button className="relative p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-700 transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-zinc-950"></span>
        </button>

        {/* USER PROFILE SECTION */}
        <div className="flex items-center gap-4 pl-6 border-l border-zinc-800 group cursor-pointer">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-black text-white tracking-tight group-hover:text-indigo-400 transition-colors">
              {user.name}
            </span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mt-1">
              {user.plan}
            </span>
          </div>

          {/* AVATAR CIRCLE */}
          <div className="relative">
            <div className="w-11 h-11 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center border-2 border-zinc-800 shadow-lg group-hover:scale-105 transition-all">
              <span className="text-white font-black text-sm">
                {user.name.charAt(0)}
              </span>
            </div>
            {/* Status Online Indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-zinc-950 rounded-full"></div>
          </div>

          <ChevronDown className="w-4 h-4 text-zinc-600 group-hover:text-white transition-all" />
        </div>

      </div>
    </nav>
  );
};