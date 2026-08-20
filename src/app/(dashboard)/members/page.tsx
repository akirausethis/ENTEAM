import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { Users2, Mail, ShieldCheck, MoreVertical, Search } from "lucide-react";
import InviteModal from "./_components/invite-modal";

export default async function MembersPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  const currentUser = await db.user.findUnique({ where: { id: userId || "" } });

  // Fetch users who have been invited to boards owned by the current user
  const boardMembers = await db.boardMember.findMany({
    where: {
      board: {
        userId: currentUser?.id,
      },
    },
    include: {
      user: true,
    },
  });

  // Extract unique users from the memberships
  const uniqueUsers = Array.from(new Map(boardMembers.map(bm => [bm.user.id, bm.user])).values());

  const members = uniqueUsers.map((u) => ({
    id: u.id,
    name: u.displayName || u.name,
    email: u.email,
    role: "Member",
    status: "Online",
    avatar: (u.displayName || u.name).charAt(0).toUpperCase(),
  }));

  // Fetch boards owned by user for the invite modal
  const userBoards = await db.board.findMany({
    where: { userId: currentUser?.id },
    select: { id: true, title: true }
  });

  return (
    <div className="p-8 sm:p-12 max-w-7xl mx-auto min-h-screen text-black dark:text-white font-sans antialiased">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-black/10 dark:border-white/10 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-zinc-500">
            <Users2 className="w-4 h-4" /> Team Management
          </div>
          <h1 className="text-5xl font-black tracking-tighter">Members</h1>
        </div>
        
        <InviteModal boards={userBoards} />
      </header>

      <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-50 dark:bg-zinc-900/50">
            <div className="relative w-full sm:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                <input placeholder="Search members..." className="w-full bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-md pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-all font-medium" />
            </div>
            <span className="text-zinc-500 text-xs font-bold tracking-widest uppercase">{members.length} Total Members</span>
        </div>

        <div className="divide-y divide-black/5 dark:divide-white/5">
          {members.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-black/10 dark:border-white/10">
                <Users2 className="w-8 h-8 text-zinc-400" />
              </div>
              <h3 className="text-lg font-black text-black dark:text-white mb-2 tracking-tight">No members yet</h3>
              <p className="text-sm font-medium text-zinc-500 max-w-sm">
                You haven't invited anyone to your workspaces yet. Click the "Invite Member" button to start building your team.
              </p>
            </div>
          ) : (
            members.map((member) => (
              <div key={member.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-md flex items-center justify-center border border-black/10 dark:border-white/10 font-black shadow-sm">
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm flex items-center gap-2">
                      {member.name}
                      {member.role === "Admin" && <ShieldCheck className="w-4 h-4 text-zinc-400" />}
                    </h3>
                    <div className="flex items-center gap-2 text-zinc-500 text-xs mt-1 font-medium">
                      <Mail className="w-3.5 h-3.5 opacity-70" /> {member.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-8">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-1">Role</div>
                    <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{member.role}</div>
                  </div>
                  <div className="text-left sm:text-right w-20">
                      <div className={`text-[10px] font-bold uppercase tracking-widest ${member.status === "Online" ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-500"}`}>
                          ● {member.status}
                      </div>
                  </div>
                  <button className="p-2 text-zinc-400 hover:text-black dark:hover:text-white transition-colors rounded-md hover:bg-black/5 dark:hover:bg-white/5">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}