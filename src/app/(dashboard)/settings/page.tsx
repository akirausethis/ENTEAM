"use client";

import { useState } from "react";
import { 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  Bell, 
  Palette, 
  Globe, 
  Save, 
  Mail, 
  Shield 
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateProfileAction, updatePasswordAction } from "../actions";

interface UserProfile {
  name: string;
  displayName: string | null;
  email: string;
  bio: string | null;
}

export default function SettingsPage({ initialUser }: { initialUser?: UserProfile }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

  // State Form Profile
  const [formData, setFormData] = useState({
    fullName: initialUser?.name || "",
    displayName: initialUser?.displayName || "",
    email: initialUser?.email || "",
    bio: initialUser?.bio || "",
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  // Logic Simpan Profile
  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const result = await updateProfileAction(formData);
      if (result.success) {
        toast.success("Anjay! Profil & Session berhasil diupdate 🚀");
        router.refresh();
      } else {
        toast.error(result.error || "Gagal update profil");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan server");
    } finally {
      setIsLoading(false);
    }
  };

  // Logic Simpan Security
  const handleUpdatePassword = async () => {
    const currentPass = (document.getElementById("current-pass") as HTMLInputElement).value;
    const newPass = (document.getElementById("new-pass") as HTMLInputElement).value;
    
    if (!currentPass || !newPass) return toast.error("Isi dulu passwordnya!");
    
    setIsLoading(true);
    try {
      const result = await updatePasswordAction({ currentPass, newPass });
      if (result.success) {
        toast.success("Password updated! Akun lo makin aman 🛡️");
        (document.getElementById("current-pass") as HTMLInputElement).value = "";
        (document.getElementById("new-pass") as HTMLInputElement).value = "";
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Gagal update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 sm:p-12 max-w-5xl mx-auto min-h-screen">
      <header className="mb-12">
        <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-[0.3em] mb-2">
          <SettingsIcon className="w-4 h-4" /> System Preferences
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">Settings</h1>
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
        <div className="flex-1 bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-10 backdrop-blur-sm shadow-2xl">
          
          {/* TAB PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight mb-1 italic uppercase">Profile Information</h2>
                <p className="text-zinc-500 text-sm font-medium">Update your personal details and how others see you.</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600 ml-1">Full Name (Login ID)</label>
                    <input 
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-bold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600 ml-1">Display Name</label>
                    <input 
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-bold" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600 ml-1">Email Address</label>
                  <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-xl px-4 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
                    <Mail className="w-4 h-4 text-zinc-500" />
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-transparent border-none p-4 text-sm text-white focus:outline-none font-bold" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600 ml-1">Bio</label>
                  <textarea 
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 resize-none transition-all font-medium leading-relaxed" 
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-zinc-800 flex justify-end">
                <button 
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-white/5"
                >
                  <Save className="w-4 h-4" /> {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* TAB SECURITY */}
          {activeTab === "security" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight mb-1 italic uppercase">Security Settings</h2>
                <p className="text-zinc-500 text-sm font-medium">Manage your password and account security.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600 ml-1">Current Password</label>
                  <input 
                    type="password"
                    id="current-pass"
                    placeholder="••••••••"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-bold" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600 ml-1">New Password</label>
                  <input 
                    type="password"
                    id="new-pass"
                    placeholder="Min. 8 characters"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-bold" 
                  />
                </div>
              </div>

              <div className="pt-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                      <Lock className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-wider">Two-Factor Authentication</p>
                      <p className="text-[10px] text-zinc-600 font-medium">Add an extra layer of security.</p>
                    </div>
                  </div>
                  <div className="w-10 h-5 bg-zinc-800 rounded-full relative cursor-pointer hover:bg-zinc-700 transition-all">
                      <div className="absolute left-1 top-1 w-3 h-3 bg-zinc-500 rounded-full transition-all" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      <Shield className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-wider">Active Sessions</p>
                      <p className="text-[10px] text-zinc-600 font-medium">Logged in on 1 device.</p>
                    </div>
                  </div>
                  <button className="text-[9px] font-black uppercase text-red-500 hover:underline tracking-tighter">Sign out all</button>
                </div>
              </div>

              <div className="pt-8 border-t border-zinc-800 flex justify-end">
                <button 
                  onClick={handleUpdatePassword}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-white hover:bg-zinc-200 text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-white/5"
                >
                  <Save className="w-4 h-4" /> {isLoading ? "Saving..." : "Save Security"}
                </button>
              </div>
            </div>
          )}

          {/* TAB LAINNYA */}
          {(activeTab === "notifications" || activeTab === "appearance") && (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
              <div className="p-4 bg-zinc-800/30 rounded-full">
                <SettingsIcon className="w-8 h-8 text-zinc-700 animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-white font-bold tracking-tight uppercase text-xs tracking-[0.3em]">Under Construction</h3>
                <p className="text-zinc-600 text-[10px] font-black uppercase mt-1">Tab {activeTab} akan segera hadir!</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}