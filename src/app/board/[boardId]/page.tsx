import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BoardContent } from "@/components/board-content";
import { Prisma } from "@prisma/client";
import { BoardHeader } from "./_components/board-header";

type BoardWithListsAndCards = Prisma.BoardGetPayload<{
  include: {
    lists: {
      include: {
        cards: true;
      };
    };
    _count: {
      select: { members: true };
    };
  };
}>;

export default async function BoardIdPage({ 
  params 
}: { 
  params: Promise<{ boardId: string }> 
}) {
  const { boardId } = await params;
  
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  const user = await db.user.findUnique({ where: { id: userId || "" } });

  if (!user) redirect("/sign-in");

  const board = await db.board.findFirst({
    where: {
      id: boardId,
      OR: [
        { userId: user.id },
        { members: { some: { userId: user.id } } }
      ]
    },
    include: {
      lists: {
        orderBy: { order: "asc" },
        include: {
          cards: { orderBy: { order: "asc" } },
        },
      },
      _count: {
        select: { members: true }
      }
    },
  }) as BoardWithListsAndCards;

  if (!board) redirect("/dashboard");

  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 min-h-screen text-black dark:text-white font-sans antialiased">
      <div className="p-6 pb-2">
        <BoardHeader board={{
          id: board.id,
          title: board.title,
          updatedAt: board.updatedAt,
          _count: board._count
        }} />
      </div>

      <div className="flex-1 overflow-x-auto p-6 pt-0">
        <BoardContent boardId={boardId} initialData={board.lists} />
      </div>
    </div>
  );
}