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
        toast.success("User invited successfully! 🚀");
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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-zinc-900/40 p-6 rounded-[2.5rem] border border-zinc-800 backdrop-blur-md">
      <div className="flex items-center gap-6">
        <button 
          onClick={() => window.history.back()}
          className="p-3 bg-zinc-800/80 rounded-2xl hover:bg-zinc-700 hover:scale-105 transition-all border border-zinc-700/30 group"
        >
          <ChevronLeft className="w-5 h-5 text-white group-hover:-translate-x-0.5 transition-transform" />
        </button>
        
        <div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">
            {board.title}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                UPDATED {formatTimeAgo(board.updatedAt)}
              </span>
            </div>
            <div className="w-1 h-1 bg-zinc-800 rounded-full" />
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] bg-indigo-500/5 px-2 py-0.5 rounded-md border border-indigo-500/10">
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
                className="bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all w-[200px] sm:w-[250px] font-bold"
              />
            </div>
            <button 
              disabled={isLoading}
              onClick={onInvite} 
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 p-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
            >
              <Check className="w-4 h-4 text-white" />
            </button>
            <button 
              onClick={() => setIsInviting(false)} 
              className="p-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors border border-zinc-700/50"
            >
              <X className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsInviting(true)}
              className="flex items-center gap-2.5 bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-2xl transition-all border border-zinc-700/50 hover:border-indigo-500/30 group"
            >
              <UserPlus className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-black text-zinc-300 uppercase tracking-widest italic">Invite</span>
            </button>
            
            <button className="p-3.5 bg-zinc-800 hover:bg-zinc-700 rounded-2xl border border-zinc-700/50 hover:rotate-45 transition-all">
              <Settings className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};