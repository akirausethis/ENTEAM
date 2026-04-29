import { db } from "../../../lib/db"; // Sesuaikan jumlah titiknya!
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Settings, Users, MoreHorizontal } from "lucide-react";
import { ListContainer } from "./_components/list-container";

interface BoardIdPageProps {
  params: Promise<{ boardId: string }>;
}

export default async function BoardIdPage({ params }: BoardIdPageProps) {
  const { boardId } = await params;

const board = await db.board.findUnique({
    where: { id: boardId },
    include: {
      lists: {
        include: {
          cards: {
            orderBy: {
              order: "asc", // Urutkan kartu berdasarkan order
            },
          },
        },
        orderBy: {
          order: "asc", // Urutkan list berdasarkan order
        },
      },
    },
  });

  if (!board) notFound();

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      
      {/* BOARD HEADER (Specific to this project) */}
      <header className="h-20 border-b border-zinc-800/60 flex items-center justify-between px-8 bg-zinc-950/40 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-4">
          {/* Tombol Back ke Dashboard */}
          <Link 
            href="/" 
            className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">{board.title}</h2>
            <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-bold uppercase tracking-wider mt-0.5">
              <span>Updated 5 min ago</span>
              <span>•</span>
              <Users className="w-3 h-3 text-zinc-700" />
              <span>3 Members</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all font-medium text-xs">
            <Users className="w-3.5 h-3.5" />
            Invite
          </button>
          <button className="flex items-center gap-2 p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all font-medium text-xs">
            <Settings className="w-3.5 h-3.5" />
            Board Settings
          </button>
          <div className="w-px h-6 bg-zinc-800/80 mx-1" />
          <button className="p-3 rounded-xl text-zinc-600 hover:text-white hover:bg-zinc-800 transition-all">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </header>

{/* Area Kanban */}
      <main className="flex-1 overflow-hidden p-8">
        {/* 2. OPER DATA-NYA DI SINI (Ini obat error-nya) */}
        <ListContainer 
          boardId={boardId} 
          data={board.lists} 
        />
      </main>
    </div>
  );
}