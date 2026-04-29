"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  Settings, 
  Sparkles,
  Zap,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils"; // Pastikan kamu punya utility class-variance-authority/clsx

interface SidebarProps {
  userName: string;
}

export const Sidebar = ({ userName }: SidebarProps) => {
  const pathname = usePathname();

  const routes = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: pathname === "/dashboard" },
    { label: "Tasks", icon: CheckSquare, href: "/tasks", active: pathname === "/tasks" },
    { label: "Members", icon: Users, href: "/members", active: pathname === "/members" },
    { label: "Settings", icon: Settings, href: "/settings", active: pathname === "/settings" },
    { label: "AI Assistant", icon: Sparkles, href: "/ai-assistant", active: pathname === "/ai-assistant" },
  ];

  return (
    <div className="w-72 h-full bg-zinc-950 border-r border-zinc-900 flex flex-col p-6 space-y-8">
      {/* LOGO */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Zap className="w-5 h-5 text-white fill-white" />
        </div>
        <span className="text-xl font-black text-white tracking-tighter italic">ENTEAM</span>
      </div>

      {/* NAV LINKS */}
      <div className="flex-1 space-y-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all group",
              route.active 
                ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" 
                : "text-zinc-500 hover:text-white hover:bg-zinc-900"
            )}
          >
            <div className="flex items-center gap-3">
              <route.icon className={cn("w-4 h-4", route.active ? "text-indigo-400" : "text-zinc-600")} />
              {route.label}
            </div>
            {route.active && <ChevronRight className="w-3 h-3" />}
          </Link>
        ))}
      </div>

      {/* UPGRADE PRO BOX */}
      <div className="p-5 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] relative overflow-hidden group shadow-2xl shadow-indigo-500/20">
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        <h4 className="text-white font-black text-sm mb-1">Upgrade Pro</h4>
        <p className="text-indigo-100 text-[10px] font-medium leading-relaxed mb-4">Get unlimited workspaces and invite more team members.</p>
        <button className="w-full py-2.5 bg-white text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-indigo-50 transition-all active:scale-95">
          Learn More
        </button>
      </div>

      {/* USER PROFILE - SEKARANG DINAMIS! */}
      <div className="flex items-center gap-3 px-2 py-4 border-t border-zinc-900">
        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-black text-indigo-500 shadow-inner">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-black text-white italic tracking-tight truncate">
            {userName}
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Free Plan
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};