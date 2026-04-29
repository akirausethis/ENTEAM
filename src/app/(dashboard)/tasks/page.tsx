"use client";

import { useState } from "react";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Layout, 
  Search, 
  Filter,
  MoreVertical,
  Calendar
} from "lucide-react";

// Dummy data biar keliatan "berisi"
const INITIAL_TASKS = [
  { 
    id: "1", 
    title: "Setup MQTT Broker for Smart Home", 
    board: "Internet of Things", 
    priority: "High", 
    status: "In Progress", 
    deadline: "2026-04-25" 
  },
  { 
    id: "2", 
    title: "Sentiment Analysis Dataset Preprocessing", 
    board: "NLP", 
    priority: "Medium", 
    status: "Todo", 
    deadline: "2026-04-28" 
  },
  { 
    id: "3", 
    title: "Finalize UI for Management Tool", 
    board: "Enterprise Grade", 
    priority: "High", 
    status: "Done", 
    deadline: "2026-04-20" 
  },
  { 
    id: "4", 
    title: "Database Schema Documentation", 
    board: "Enterprise Grade", 
    priority: "Low", 
    status: "Todo", 
    deadline: "2026-05-02" 
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  return (
    <div className="p-8 sm:p-12 max-w-7xl mx-auto min-h-screen">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-[0.3em]">
            <CheckCircle2 className="w-4 h-4" /> Productivity Center
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter">Tasks List</h1>
        </div>

        {/* SEARCH & FILTER UI */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              placeholder="Search tasks..." 
              className="bg-zinc-900 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-64 transition-all"
            />
          </div>
          <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* TASKS TABLE / LIST */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] overflow-hidden backdrop-blur-sm shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="p-6 text-[10px] uppercase tracking-widest font-black text-zinc-500">Task Name</th>
              <th className="p-6 text-[10px] uppercase tracking-widest font-black text-zinc-500">Workspace</th>
              <th className="p-6 text-[10px] uppercase tracking-widest font-black text-zinc-500">Priority</th>
              <th className="p-6 text-[10px] uppercase tracking-widest font-black text-zinc-500">Deadline</th>
              <th className="p-6 text-[10px] uppercase tracking-widest font-black text-zinc-500 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="group border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-all cursor-pointer">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    {task.status === "Done" ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-700 group-hover:text-indigo-500 transition-colors" />
                    )}
                    <span className={`font-bold text-zinc-200 group-hover:text-white transition-colors ${task.status === "Done" ? "line-through text-zinc-500" : ""}`}>
                      {task.title}
                    </span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2 px-3 py-1 bg-zinc-800/50 border border-zinc-700/50 rounded-full w-fit">
                    <Layout className="w-3 h-3 text-indigo-400" />
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">{task.board}</span>
                  </div>
                </td>
                <td className="p-6">
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${
                    task.priority === "High" ? "text-red-400 bg-red-400/10" : 
                    task.priority === "Medium" ? "text-amber-400 bg-amber-400/10" : 
                    "text-zinc-500 bg-zinc-500/10"
                  }`}>
                    {task.priority}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2 text-zinc-500 text-xs">
                    <Calendar className="w-4 h-4" />
                    {task.deadline}
                  </div>
                </td>
                <td className="p-6">
                   <div className="flex justify-center">
                      <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                        task.status === "Done" ? "border-emerald-500/50 text-emerald-500 bg-emerald-500/5" :
                        task.status === "In Progress" ? "border-indigo-500/50 text-indigo-500 bg-indigo-500/5" :
                        "border-zinc-700 text-zinc-600"
                      }`}>
                        {task.status}
                      </div>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* EMPTY STATE IF NO SEARCH RESULTS */}
        {tasks.length === 0 && (
          <div className="p-20 text-center">
            <Clock className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 font-medium">No tasks found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}