import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BarChart2, Layout, CheckSquare, Users } from "lucide-react";
import { AnalyticsChart } from "./_components/analytics-chart";

export default async function AnalyticsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  const user = await db.user.findUnique({ where: { id: userId || "" } });

  if (!user) redirect("/sign-in");

  // Fetch aggregates
  const totalWorkspaces = await db.board.count({ where: { userId: user.id } });
  
  // Need to find lists and cards that belong to user's boards
  const userBoards = await db.board.findMany({ 
    where: { userId: user.id },
    select: { id: true }
  });
  
  const boardIds = userBoards.map(b => b.id);
  
  const totalLists = await db.list.count({ 
    where: { boardId: { in: boardIds } }
  });
  
  const lists = await db.list.findMany({
    where: { boardId: { in: boardIds } },
    select: { id: true }
  });
  
  const listIds = lists.map(l => l.id);
  
  const totalCards = await db.card.count({
    where: { listId: { in: listIds } }
  });

  // Get actual team members count (users invited to this user's boards)
  const boardMemberships = await db.boardMember.findMany({
    where: {
      board: {
        userId: user.id
      }
    },
    select: { userId: true }
  });
  const uniqueMemberIds = new Set(boardMemberships.map(bm => bm.userId));
  const totalMembers = uniqueMemberIds.size;

  // Real data for chart (Activity over the last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setHours(0, 0, 0, 0);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const recentCards = await db.card.findMany({
    where: { 
      listId: { in: listIds },
      createdAt: { gte: sevenDaysAgo }
    },
    select: { createdAt: true }
  });

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const chartData: { name: string, tasks: number, dateStr: string }[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    chartData.push({ name: daysOfWeek[d.getDay()], tasks: 0, dateStr: d.toDateString() });
  }

  recentCards.forEach(card => {
    const cardDateStr = card.createdAt.toDateString();
    const targetDay = chartData.find(d => d.dateStr === cardDateStr);
    if (targetDay) {
      targetDay.tasks += 1;
    }
  });

  const stats = [
    { label: "Total Workspaces", value: totalWorkspaces, icon: Layout },
    { label: "Total Columns", value: totalLists, icon: BarChart2 },
    { label: "Total Tasks", value: totalCards, icon: CheckSquare },
    { label: "Team Members", value: totalMembers, icon: Users },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter">Analytics & Reports</h1>
        <p className="text-zinc-500 text-sm font-medium mt-1">Track your productivity and team performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 p-6 rounded-2xl shadow-sm hover:border-black/20 dark:hover:border-white/20 transition-all flex flex-col justify-between h-32">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</span>
              <stat.icon className="w-4 h-4 text-black dark:text-white" />
            </div>
            <div className="text-4xl font-black text-black dark:text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 p-6 rounded-2xl shadow-sm">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-black dark:text-white uppercase tracking-widest">Weekly Activity</h3>
            <p className="text-xs font-medium text-zinc-500">Tasks created across all workspaces this week.</p>
          </div>
          <div className="h-[300px] w-full">
            <AnalyticsChart data={chartData} />
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-black/10 dark:border-white/10 p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center space-y-4">
           <div className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center">
             <BarChart2 className="w-8 h-8 text-white dark:text-black" />
           </div>
           <div>
             <h3 className="text-sm font-bold text-black dark:text-white uppercase tracking-widest mb-1">More Insights Coming</h3>
             <p className="text-xs font-medium text-zinc-500">We are working on bringing more detailed reports for your team.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
