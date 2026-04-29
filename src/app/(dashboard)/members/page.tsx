"use client";

import { useState } from "react";
import { Users2, UserPlus, Mail, ShieldCheck, MoreVertical, Search } from "lucide-react";

const INITIAL_MEMBERS = [
  { id: "1", name: "Kelvin", email: "kelvin@enteam.com", role: "Admin", status: "Online", avatar: "K" },
  { id: "2", name: "Kenneth", email: "kenneth@enteam.com", role: "Editor", status: "Offline", avatar: "C" },
  { id: "3", name: "Elby", email: "elby@enteam.com", role: "Viewer", status: "Online", avatar: "N" },
];

export default function MembersPage() {
  const [members] = useState(INITIAL_MEMBERS);

  return (
    <div className="p-8 sm:p-12 max-w-7xl mx-auto min-h-screen">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-[0.3em]">
            <Users2 className="w-4 h-4" /> Team Management
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter">Members</h1>
        </div>
        
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
          <UserPlus className="w-5 h-5" />
          Invite Member
        </button>
      </header>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <div className="relative w-64 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                <input placeholder="Search members..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
            </div>
            <span className="text-zinc-500 text-xs font-medium">{members.length} Total Members</span>
        </div>

        <div className="divide-y divide-zinc-800/50">
          {members.map((member) => (
            <div key={member.id} className="p-6 flex items-center justify-between hover:bg-zinc-800/20 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-zinc-800 to-zinc-700 rounded-2xl flex items-center justify-center border border-zinc-700 text-white font-black">
                  {member.avatar}
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    {member.name}
                    {member.role === "Admin" && <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />}
                  </h3>
                  <div className="flex items-center gap-2 text-zinc-500 text-xs mt-1">
                    <Mail className="w-3 h-3" /> {member.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-widest font-black text-zinc-600 mb-1">Role</div>
                  <div className="text-xs text-zinc-300 font-bold">{member.role}</div>
                </div>
                <div className="text-right w-20">
                    <div className={`text-[10px] font-black uppercase ${member.status === "Online" ? "text-emerald-500" : "text-zinc-600"}`}>
                        ● {member.status}
                    </div>
                </div>
                <button className="p-2 text-zinc-600 hover:text-white transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}