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
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search tasks or descriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
          />
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] overflow-hidden backdrop-blur-sm shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800/50">
              <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500">Task Name</th>
              <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500">Description</th>
              <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500">Assignee</th>
              <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500">Priority</th>
              <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500">Deadline</th>
              <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/30">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <tr key={task.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <span className={`font-bold text-sm tracking-tight ${task.status === "COMPLETED" ? "text-zinc-500 line-through" : "text-white"}`}>
                      {task.title}
                    </span>
                  </td>

                  <td className="px-8 py-6 max-w-[250px]">
                    <div className="flex items-start gap-2 text-zinc-500">
                      <AlignLeft className="w-3.5 h-3.5 mt-0.5 shrink-0 text-indigo-500/50" />
                      <p className="text-[11px] leading-relaxed line-clamp-2 italic font-medium">
                        {task.description || "No description provided."}
                      </p>
                    </div>
                  </td>
                  
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                        <User2 className="w-4 h-4 text-indigo-400" />
                      </div>
                      <span className="text-xs font-bold text-zinc-300">{task.assignee}</span>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border ${
                      task.priority === "URGENT" ? "text-purple-500 border-purple-500/20 bg-purple-500/10" :
                      task.priority === "HIGH" ? "text-red-500 border-red-500/20 bg-red-500/10" :
                      task.priority === "MEDIUM" ? "text-amber-500 border-amber-500/20 bg-amber-500/10" :
                      "text-emerald-500 border-emerald-500/20 bg-emerald-500/10"
                    }`}>
                      {task.priority}
                    </span>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="text-xs font-bold">{task.deadline}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <Layout className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{task.workspace}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                     <div className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border w-fit ${
                          task.status === "COMPLETED" ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/10" : "text-indigo-500 border-indigo-500/20 bg-indigo-500/10"
                     }`}>
                      {task.status}
                     </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-8 py-24">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-zinc-800/50 rounded-3xl flex items-center justify-center mb-4 border border-zinc-700/50">
                      <FolderOpen className="w-8 h-8 text-zinc-600" />
                    </div>
                    <h3 className="text-white font-black uppercase italic tracking-tighter text-xl">No tasks found</h3>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
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