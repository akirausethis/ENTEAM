"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  Settings, 
  BarChart2,
  Zap,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    { label: "Analytics", icon: BarChart2, href: "/analytics", active: pathname === "/analytics" },
  ];

  return (
    <div className="w-72 h-full bg-zinc-50 dark:bg-zinc-950 border-r border-black/10 dark:border-white/10 flex flex-col p-6 space-y-8 relative z-50">
      {/* LOGO */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-9 h-9 bg-black dark:bg-white rounded-md flex items-center justify-center shadow-sm">
          <Zap className="w-5 h-5 text-white dark:text-black fill-current" />
        </div>
        <span className="text-xl font-black text-black dark:text-white tracking-tighter">ENTEAM</span>
      </div>

      {/* NAV LINKS */}
      <div className="flex-1 space-y-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center justify-between px-4 py-3 rounded-md text-sm font-bold transition-all group",
              route.active 
                ? "bg-black/5 dark:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/10" 
                : "text-zinc-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
            )}
          >
            <div className="flex items-center gap-3">
              <route.icon className={cn("w-4 h-4", route.active ? "text-black dark:text-white" : "text-zinc-500")} />
              {route.label}
            </div>
            {route.active && <ChevronRight className="w-3 h-3 opacity-50" />}
          </Link>
        ))}
      </div>

      {/* UPGRADE PRO BOX */}
      <div className="p-5 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-xl relative overflow-hidden group shadow-sm">
        <h4 className="text-black dark:text-white font-black text-sm mb-1">Upgrade Pro</h4>
        <p className="text-zinc-500 text-[10px] font-medium leading-relaxed mb-4">Get unlimited workspaces and invite more team members.</p>
        <button className="w-full py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-md text-[10px] font-black uppercase tracking-wider hover:opacity-90 transition-all active:scale-95 shadow-sm border border-black/10 dark:border-white/10">
          Learn More
        </button>
      </div>

      {/* USER PROFILE - SEKARANG DINAMIS! */}
      <div className="flex items-center gap-3 px-2 py-4 border-t border-black/10 dark:border-white/10">
        <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-black/10 dark:border-white/10 flex items-center justify-center font-black text-black dark:text-white shadow-sm">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-black text-black dark:text-white tracking-tight truncate">
            {userName}
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-black/50 dark:bg-white/50" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Free Plan
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};