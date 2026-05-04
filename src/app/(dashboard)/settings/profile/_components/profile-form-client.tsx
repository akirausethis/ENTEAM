"use client";

import { useState } from "react";
import { Globe, Save, Mail } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateProfileAction } from "@/app/(dashboard)/actions";

interface UserProfile {
  name: string;
  email: string;
  displayName: string | null;
  bio: string | null;
}

export default function ProfileFormClient({ user }: { user: UserProfile }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: user.name,
    displayName: user.displayName || "",
    email: user.email,
    bio: user.bio || "",
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const result = await updateProfileAction(formData);
      if (result.success) {
        toast.success("Profil berhasil diupdate! 🚀");
        router.refresh();
      } else {
        toast.error(result.error || "Gagal update profil");
      }
    } catch (error) {
      toast.error("Kesalahan sistem!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600 ml-1">Full Name</label>
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
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 resize-none transition-all font-medium" 
        />
      </div>

      <div className="pt-8 border-t border-zinc-800 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}