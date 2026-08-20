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

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const result = await updateProfileAction(formData);
      if (result.success) {
        toast.success("Profile and session successfully updated");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Server error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    const currentPass = (document.getElementById("current-pass") as HTMLInputElement).value;
    const newPass = (document.getElementById("new-pass") as HTMLInputElement).value;
    
    if (!currentPass || !newPass) return toast.error("Please fill in all password fields!");
    
    setIsLoading(true);
    try {
      const result = await updatePasswordAction({ currentPass, newPass });
      if (result.success) {
        toast.success("Password updated! Your account is now more secure.");
        (document.getElementById("current-pass") as HTMLInputElement).value = "";
        (document.getElementById("new-pass") as HTMLInputElement).value = "";
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 sm:p-12 max-w-5xl mx-auto min-h-screen text-black dark:text-white font-sans antialiased">
      <header className="mb-12 border-b border-black/10 dark:border-white/10 pb-8">
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-zinc-500 mb-2">
          <SettingsIcon className="w-4 h-4" /> System Preferences
        </div>
        <h1 className="text-5xl font-black tracking-tighter">Settings</h1>
      </header>

      <div className="flex flex-col md:flex-row gap-12">
        {/* SIDE NAV SETTINGS */}
        <nav className="w-full md:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-md font-bold text-sm transition-all
                ${activeTab === tab.id 
                  ? "bg-black dark:bg-white text-white dark:text-black shadow-md" 
                  : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"}`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* SETTINGS CONTENT */}
        <div className="flex-1 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-xl p-10 shadow-sm">
          
          {/* TAB PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="border-b border-black/10 dark:border-white/10 pb-4">
                <h2 className="text-2xl font-black tracking-tight mb-1">Profile Information</h2>
                <p className="text-zinc-500 text-sm font-medium">Update your personal details and how others see you.</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-widest font-bold text-zinc-500">Full Name (Login ID)</label>
                    <input 
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-transparent border border-black/20 dark:border-white/20 rounded-md p-3 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-all font-medium" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-widest font-bold text-zinc-500">Display Name</label>
                    <input 
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      className="w-full bg-transparent border border-black/20 dark:border-white/20 rounded-md p-3 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-all font-medium" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-widest font-bold text-zinc-500">Email Address</label>
                  <div className="flex items-center gap-3 bg-transparent border border-black/20 dark:border-white/20 rounded-md px-3 focus-within:border-black dark:focus-within:border-white transition-all">
                    <Mail className="w-4 h-4 text-zinc-400" />
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-transparent border-none py-3 text-sm focus:outline-none font-medium" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-widest font-bold text-zinc-500">Bio</label>
                  <textarea 
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full bg-transparent border border-black/20 dark:border-white/20 rounded-md p-3 text-sm focus:outline-none focus:border-black dark:focus:border-white resize-none transition-all font-medium leading-relaxed" 
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-black/10 dark:border-white/10 flex justify-end">
                <button 
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-8 py-3.5 rounded-md font-bold text-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* TAB SECURITY */}
          {activeTab === "security" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="border-b border-black/10 dark:border-white/10 pb-4">
                <h2 className="text-2xl font-black tracking-tight mb-1">Security Settings</h2>
                <p className="text-zinc-500 text-sm font-medium">Manage your password and account security.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-widest font-bold text-zinc-500">Current Password</label>
                  <input 
                    type="password"
                    id="current-pass"
                    placeholder="••••••••"
                    className="w-full bg-transparent border border-black/20 dark:border-white/20 rounded-md p-3 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-all font-medium" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-widest font-bold text-zinc-500">New Password</label>
                  <input 
                    type="password"
                    id="new-pass"
                    placeholder="Min. 8 characters"
                    className="w-full bg-transparent border border-black/20 dark:border-white/20 rounded-md p-3 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-all font-medium" 
                  />
                </div>
              </div>

              <div className="pt-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-black/5 dark:bg-white/5 rounded-md">
                      <Lock className="w-4 h-4 opacity-70" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest">Two-Factor Auth</p>
                      <p className="text-[11px] text-zinc-500 font-medium">Add an extra layer of security.</p>
                    </div>
                  </div>
                  <div className="w-10 h-5 bg-zinc-300 dark:bg-zinc-700 rounded-full relative cursor-pointer hover:opacity-80 transition-all">
                      <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-black/5 dark:bg-white/5 rounded-md">
                      <Shield className="w-4 h-4 opacity-70" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest">Active Sessions</p>
                      <p className="text-[11px] text-zinc-500 font-medium">Logged in on 1 device.</p>
                    </div>
                  </div>
                  <button className="text-[10px] font-bold uppercase tracking-widest hover:underline opacity-80">Sign out all</button>
                </div>
              </div>

              <div className="pt-8 border-t border-black/10 dark:border-white/10 flex justify-end">
                <button 
                  onClick={handleUpdatePassword}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-8 py-3.5 rounded-md font-bold text-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {isLoading ? "Saving..." : "Save Security"}
                </button>
              </div>
            </div>
          )}

          {/* TAB LAINNYA */}
          {(activeTab === "notifications" || activeTab === "appearance") && (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
              <div className="p-4 bg-black/5 dark:bg-white/5 rounded-full border border-black/10 dark:border-white/10">
                <SettingsIcon className="w-8 h-8 opacity-40 animate-spin-slow" />
              </div>
              <div>
                <h3 className="font-bold tracking-tight text-xl">Under Construction</h3>
                <p className="text-zinc-500 text-sm font-medium mt-1">The {activeTab} tab is coming soon!</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}