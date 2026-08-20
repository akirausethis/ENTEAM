"use client";

import { useState } from "react";
import { Search, Calendar, Layout, User2, AlignLeft, FolderOpen } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string; 
  workspace: string;
  status: string;
  deadline: string;
  priority: string;
  assignee: string;
}

export default function TasksTable({ initialTasks }: { initialTasks: Task[] }) {
  const [search, setSearch] = useState("");

  const filteredTasks = initialTasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    task.workspace.toLowerCase().includes(search.toLowerCase()) ||
    task.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
          <input
            type="text"
            placeholder="Search tasks or descriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-md py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-all font-medium"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50">
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">Task Name</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">Description</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">Assignee</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">Priority</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">Deadline</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <tr key={task.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-5">
                    <span className={`font-bold text-sm tracking-tight ${task.status === "COMPLETED" ? "text-zinc-400 line-through" : ""}`}>
                      {task.title}
                    </span>
                  </td>

                  <td className="px-6 py-5 max-w-[250px]">
                    <div className="flex items-start gap-2 text-zinc-500">
                      <AlignLeft className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-50" />
                      <p className="text-[11px] leading-relaxed line-clamp-2 font-medium">
                        {task.description || "No description provided."}
                      </p>
                    </div>
                  </td>
                  
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-black/5 dark:border-white/5 flex items-center justify-center">
                        <User2 className="w-4 h-4 opacity-70" />
                      </div>
                      <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{task.assignee}</span>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${
                      task.priority === "URGENT" ? "text-red-700 dark:text-red-400 border-red-500/30 bg-red-500/10" :
                      task.priority === "HIGH" ? "text-orange-700 dark:text-orange-400 border-orange-500/30 bg-orange-500/10" :
                      task.priority === "MEDIUM" ? "text-blue-700 dark:text-blue-400 border-blue-500/30 bg-blue-500/10" :
                      "text-zinc-700 dark:text-zinc-400 border-black/10 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800"
                    }`}>
                      {task.priority}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                        <Calendar className="w-3.5 h-3.5 opacity-70" />
                        <span className="text-xs font-bold">{task.deadline}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <Layout className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{task.workspace}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                     <div className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border w-fit ${
                          task.status === "COMPLETED" ? "text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10" : "text-black dark:text-white border-black/10 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800"
                     }`}>
                      {task.status}
                     </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-24">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center mb-4 border border-black/10 dark:border-white/10">
                      <FolderOpen className="w-8 h-8 text-zinc-400" />
                    </div>
                    <h3 className="font-bold tracking-tight text-xl">No tasks found</h3>
                    <p className="text-zinc-500 text-sm font-medium mt-1">
                      {search ? `No results for "${search}"` : "Your task list is empty"}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}