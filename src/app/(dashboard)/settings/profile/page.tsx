import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Settings as SettingsIcon, User, Lock, Bell, Palette } from "lucide-react";
import ProfileFormClient from "./_components/profile-form-client";
import { Prisma } from "@prisma/client";


export default async function ProfileSettingsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  const user = await db.user.findUnique({
    where: { id: userId || "" },
  });

  if (!user) redirect("/sign-in");

  const tabs = [
    { id: "profile", label: "Profile", icon: User, href: "/settings/profile", active: true },
    { id: "security", label: "Security", icon: Lock, href: "/settings/security", active: false },
    { id: "notifications", label: "Notifications", icon: Bell, href: "/settings/notifications", active: false },
    { id: "appearance", label: "Appearance", icon: Palette, href: "/settings/appearance", active: false },
  ];

  // Gunakan type casting yang aman
  const typedUser = user as unknown as { 
    name: string; 
    email: string; 
    displayName?: string | null; 
    bio?: string | null; 
  };

  const userData = {
    name: typedUser.name,
    email: typedUser.email,
    displayName: typedUser.displayName ?? "",
    bio: typedUser.bio ?? "",
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
            <a
              key={tab.id}
              href={tab.href}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all
                ${tab.active 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"}`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </a>
          ))}
        </nav>

        {/* SETTINGS CONTENT */}
        <div className="flex-1 bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-10 backdrop-blur-sm shadow-2xl">
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight mb-1 italic uppercase">Profile Information</h2>
              <p className="text-zinc-500 text-sm font-medium">Update your personal details and how others see you.</p>
            </div>

            {/* Kirim data ke Client Component */}
            <ProfileFormClient user={userData} />
          </div>
        </div>
      </div>
    </div>
  );
}