"use client";

import { useState } from "react";
import { Settings as SettingsIcon, User, Lock, Bell, Palette, Globe, Save } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  return (
    <div className="p-8 sm:p-12 max-w-5xl mx-auto min-h-screen">
      <header className="mb-12">
        <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-[0.3em] mb-2">
          <SettingsIcon className="w-4 h-4" /> System Preferences
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter">Settings</h1>
      </header>

      <div className="flex flex-col md:flex-row gap-12">
        {/* SIDE NAV SETTINGS */}
        <nav className="w-full md:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all
                ${activeTab === tab.id 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"}`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* SETTINGS CONTENT */}
        <div className="flex-1 bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-10 backdrop-blur-sm">
          <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-black text-white tracking-tight mb-1">Profile Information</h2>
                <p className="text-zinc-500 text-sm">Update your personal details and how others see you.</p>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-black text-zinc-600 ml-1">Full Name</label>
                        <input defaultValue="Kelvin" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-black text-zinc-600 ml-1">Display Name</label>
                        <input defaultValue="Kelvin IT" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-zinc-600 ml-1">Email Address</label>
                    <div className="flex items-center gap-3 bg-zinc-800/30 border border-zinc-800 rounded-xl p-3 text-zinc-500 text-sm">
                        <Globe className="w-4 h-4" /> kelvin@enteam.com (Primary)
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-zinc-600 ml-1">Bio</label>
                    <textarea rows={3} placeholder="Tell us about yourself..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 resize-none" />
                </div>
            </div>

            <div className="pt-6 border-t border-zinc-800 flex justify-end">
                <button className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95">
                    <Save className="w-4 h-4" /> Save Changes
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}