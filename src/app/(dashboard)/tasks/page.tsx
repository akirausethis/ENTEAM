import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TasksTable from "./_components/tasks-table";

/**
 * Interface manual untuk Card - Pastikan 'description' ada di sini
 */
interface ExtendedCard {
  id: string;
  title: string;
  description: string | null; // Tambahkan ini agar sinkron dengan DB
  deadline: string | null;
  isCompleted: boolean;
  priority: string;
  list: {
    title: string;
    board: {
      title: string;
      user: {
        name: string;
        displayName: string | null;
      };
    };
  };
}

/**
 * Logic Dynamic Priority
 */
function getDynamicPriority(deadlineStr: string | null): string {
  if (!deadlineStr || deadlineStr === "No Deadline") return "LOW";
  try {
    const deadline = new Date(deadlineStr);
    const now = new Date();
    const diffInTime = deadline.getTime() - now.getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));

    if (diffInDays <= 0) return "URGENT"; 
    if (diffInDays <= 3) return "HIGH";
    if (diffInDays <= 7) return "MEDIUM";
    return "LOW";
  } catch (e) {
    return "LOW";
  }
}

export default async function TasksPage() {
  const cookieStore = await cookies();
  const userName = cookieStore.get("user_name")?.value;

  const user = await db.user.findFirst({ where: { name: userName } });
  if (!user) redirect("/sign-in");

  const tasks = await db.card.findMany({
    where: {
      list: { board: { userId: user.id } },
    },
    include: {
      list: {
        include: {
          board: {
            include: { user: true }
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedTasks = tasks.map((task) => {
    const safeTask = task as unknown as ExtendedCard;
    const dynamicPriority = getDynamicPriority(safeTask.deadline);

    return {
      id: safeTask.id,
      title: safeTask.title,
      description: safeTask.description || "", // SOLUSI: Kirim deskripsi ke TasksTable
      workspace: safeTask.list.board.title,
      status: safeTask.isCompleted ? "COMPLETED" : "ON-GOING",
      deadline: safeTask.deadline || "No Deadline",
      priority: dynamicPriority,
      assignee: safeTask.list.board.user.displayName || safeTask.list.board.user.name,
    };
  });

  return (
    <div className="p-8 sm:p-12 max-w-7xl mx-auto min-h-screen">
      <header className="mb-10">
        {/* ... Header UI Code ... */}
        <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">Team Tasks</h1>
      </header>

      {/* Sekarang TS tidak akan marah karena 'description' sudah ada */}
      <TasksTable initialTasks={formattedTasks} />
    </div>
  );
}