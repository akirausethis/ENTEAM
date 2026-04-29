import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Settings, MoreHorizontal, Plus } from "lucide-react";
import { BoardContent } from "@/components/board-content"; // Kamu perlu bikin file ini nanti

export default async function BoardIdPage({ 
  params 
}: { 
  params: Promise<{ boardId: string }> // Tambahkan Promise di sini
}) {
  const { boardId } = await params;
  
  // 1. Cek User
  const cookieStore = await cookies();
  const userName = cookieStore.get("user_name")?.value;
  const user = await db.user.findFirst({ where: { name: userName } });

  if (!user) redirect("/sign-in");

  // 2. Ambil Data Board + List + Card
  const board = await db.board.findFirst({
    where: {
      id: boardId,
      userId: user.id, // Safety: Biar gak bisa intip board orang lewat URL
    },
    include: {
      lists: {
        orderBy: { order: "asc" },
        include: {
          cards: { orderBy: { order: "asc" } },
        },
      },
    },
  });

  if (!board) redirect("/dashboard");

  return (
    <div className="h-full flex flex-col bg-zinc-950">
      {/* HEADER BOARD */}
      <div className="flex items-center justify-between p-6 border-b border-zinc-900">
        <div className="flex items-center gap-4">
          {/* FIX TOMBOL BACK: Arahkan ke /dashboard */}
          <Link 
            href="/dashboard" 
            className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 hover:bg-zinc-800 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </Link>
          
          <div>
            <h1 className="text-2xl font-black text-white italic tracking-tight uppercase">
              {board.title}
            </h1>
            <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
              <span>Updated 5 min ago</span>
              <span className="w-1 h-1 bg-zinc-800 rounded-full" />
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" /> 1 Member
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-all">
            <Users className="w-4 h-4" /> Invite
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-all">
            <Settings className="w-4 h-4" /> Board Settings
          </button>
          <button className="p-2 text-zinc-500">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* CONTENT AREA (Kanban Board) */}
      <div className="flex-1 overflow-x-auto p-6">
        {/* Oper data lists ke Client Component agar bisa Drag & Drop */}
        <BoardContent boardId={boardId} initialData={board.lists} />
      </div>
    </div>
  );
}