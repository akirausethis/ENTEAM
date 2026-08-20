"use client";

import { useState } from "react";
import { UserPlus, Settings, ChevronLeft, X, Check } from "lucide-react";
import { toast } from "sonner";
import { inviteMemberAction } from "../_actions";

interface BoardHeaderProps {
  board: {
    id: string;
    title: string;
    updatedAt: Date;
    _count: {
      members: number;
    };
  };
}

export function formatTimeAgo(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  if (diffInSeconds < 60) return "JUST NOW";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} MIN AGO`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} HOURS AGO`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} DAYS AGO`;
}

export const BoardHeader = ({ board }: BoardHeaderProps) => {
  const [email, setEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onInvite = async () => {
    if (!email.trim()) return;
    
    setIsLoading(true);
    try {
      const res = await inviteMemberAction(board.id, email);
      if (res?.success) {
        toast.success("User invited successfully!");
        setEmail("");
        setIsInviting(false);
      } else {
        toast.error(res?.error || "Gagal mengundang user.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white dark:bg-black p-4 sm:p-6 rounded-xl border border-black/10 dark:border-white/10 shadow-sm">
      <div className="flex items-center gap-4 sm:gap-6">
        <button 
          onClick={() => window.history.back()}
          className="p-2.5 sm:p-3 bg-zinc-100 dark:bg-zinc-900 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors border border-black/5 dark:border-white/5"
        >
          <ChevronLeft className="w-5 h-5 text-black dark:text-white" />
        </button>
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-black dark:text-white uppercase tracking-tighter leading-none truncate max-w-[200px] sm:max-w-none">
            {board.title}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-black/50 dark:bg-white/50 rounded-full" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                UPDATED {formatTimeAgo(board.updatedAt)}
              </span>
            </div>
            <div className="w-1 h-1 bg-black/20 dark:bg-white/20 rounded-full" />
            <span className="text-[10px] font-bold text-black dark:text-white uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-sm border border-black/10 dark:border-white/10">
              {board._count.members + 1} MEMBERS
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isInviting ? (
          <div className="flex items-center gap-2 animate-in slide-in-from-right-4 duration-300">
            <div className="relative group">
              <input 
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onInvite()}
                placeholder="Enter email address..."
                className="bg-transparent border border-black/20 dark:border-white/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-all w-[200px] sm:w-[250px] font-medium"
              />
            </div>
            <button 
              disabled={isLoading}
              onClick={onInvite} 
              className="bg-black dark:bg-white hover:opacity-80 disabled:opacity-50 p-2.5 rounded-md transition-all shadow-sm"
            >
              <Check className="w-4 h-4 text-white dark:text-black" />
            </button>
            <button 
              onClick={() => setIsInviting(false)} 
              className="p-2.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md transition-colors border border-black/5 dark:border-white/5"
            >
              <X className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsInviting(true)}
              className="flex items-center gap-2 bg-black dark:bg-white hover:opacity-90 px-5 py-2.5 rounded-md transition-all shadow-sm"
            >
              <UserPlus className="w-4 h-4 text-white dark:text-black" />
              <span className="text-xs font-bold text-white dark:text-black uppercase tracking-widest">Invite</span>
            </button>
            
            <button className="p-2.5 bg-white dark:bg-black hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-md border border-black/10 dark:border-white/10 transition-colors">
              <Settings className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};