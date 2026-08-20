"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Trash2, Layout, ArrowUpRight, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { CreateBoardModal } from "../../components/create-board-modal";
import { deleteBoardAction } from "../board/[boardId]/_actions";

interface Board {
  id: string;
  title: string;
}

interface DashboardClientProps {
  initialData: Board[];
  createBoardAction: (title: string) => Promise<Board | undefined>;
}

export default function DashboardClient({ initialData, createBoardAction }: DashboardClientProps) {
  const [boards, setBoards] = useState<Board[]>(initialData || []);

  const onDragEnd = async (result: DropResult) => {
    const { destination, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === "trash-bin") {
      const boardToDelete = boards.find((b) => b.id === draggableId);
      if (!boardToDelete) return;

      const newBoards = boards.filter((b) => b.id !== draggableId);
      setBoards(newBoards);
      
      try {
        await deleteBoardAction(draggableId);
        toast.error(`Project "${boardToDelete.title}" deleted`);
      } catch (error) {
        setBoards(initialData); 
        toast.error("Failed to delete project");
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="p-8 sm:p-12 max-w-7xl mx-auto relative min-h-[85vh] text-black dark:text-white font-sans antialiased">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-black/10 dark:border-white/10 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-zinc-500">
              <Layout className="w-4 h-4" /> Workspace Overview
            </div>
            <h1 className="text-5xl font-black tracking-tighter">My Workspaces</h1>
          </div>
          <CreateBoardModal createAction={createBoardAction} />
        </header>

        {/* LOGIKA EMPTY STATE */}
        {boards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-black/10 dark:border-white/10 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 animate-in fade-in duration-500">
            <div className="p-6 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-xl mb-6 shadow-sm">
              <FolderOpen className="w-12 h-12 text-zinc-400" />
            </div>
            <h2 className="text-2xl font-bold">No workspace right now</h2>
            <p className="text-zinc-500 mt-2 font-medium">Create your first project to get started!</p>
          </div>
        ) : (
          <Droppable droppableId="board-grid" direction="horizontal" type="board">
            {(provided) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {boards.map((board, index) => (
                  <Draggable key={board.id} draggableId={board.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="outline-none"
                      >
                        <Link 
                          href={`/board/${board.id}`}
                          className={`group relative block h-60 p-8 rounded-2xl bg-white dark:bg-black transition-all duration-300 overflow-hidden shadow-sm
                            ${snapshot.isDragging 
                              ? 'border-2 border-black dark:border-white shadow-2xl z-50 scale-105' 
                              : 'border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 hover:shadow-md'
                            }
                            /* LOGIKA MENGECIL SAAT DI ATAS SAMPAH */
                            ${snapshot.draggingOver === 'trash-bin' ? 'scale-50 opacity-50 rotate-6' : ''}
                          `}
                        >
                          <div className="absolute top-6 right-6 p-2 bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <ArrowUpRight className="w-4 h-4" />
                          </div>
                          <div className="w-10 h-1 rounded-sm bg-black/20 dark:bg-white/20 mb-6 group-hover:bg-black dark:group-hover:bg-white transition-all duration-300" />
                          <h3 className="text-3xl font-bold tracking-tight leading-tight group-hover:underline underline-offset-4 decoration-2">{board.title}</h3>
                          <div className="absolute bottom-8 left-8 text-[11px] uppercase tracking-widest font-bold text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors">Launch Workspace →</div>
                        </Link>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}

        {/* TRASH BIN - HANYA MUNCUL JIKA ADA BOARDS */}
        {boards.length > 0 && (
          <Droppable droppableId="trash-bin" type="board">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`fixed bottom-12 right-12 w-24 h-24 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 z-[100] border-2 animate-in slide-in-from-bottom-10 fade-in shadow-lg
                  ${snapshot.isDraggingOver 
                    ? 'bg-red-50 dark:bg-red-950 border-red-500 scale-110' 
                    : 'bg-white dark:bg-black border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 opacity-80 hover:opacity-100'
                  }`}
              >
                <Trash2 className={`w-8 h-8 transition-all duration-200 ${snapshot.isDraggingOver ? 'text-red-600 dark:text-red-400 scale-110' : 'text-zinc-400'}`} />
                <span className={`text-[10px] font-bold uppercase tracking-widest mt-2 transition-colors ${snapshot.isDraggingOver ? 'text-red-600 dark:text-red-400' : 'text-zinc-400'}`}>
                  {snapshot.isDraggingOver ? "DROP" : "TRASH"}
                </span>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
      </div>
    </DragDropContext>
  );
}