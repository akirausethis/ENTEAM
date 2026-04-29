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
  background: string;
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
      <div className="p-8 sm:p-12 max-w-7xl mx-auto relative min-h-[85vh]">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-[0.3em]">
              <Layout className="w-4 h-4" /> Workspace Overview
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter">My Workspaces</h1>
          </div>
          <CreateBoardModal createAction={createBoardAction} />
        </header>

        {/* LOGIKA EMPTY STATE */}
        {boards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-zinc-800 rounded-[3rem] bg-zinc-900/20 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
            <div className="p-6 bg-zinc-800/50 rounded-full mb-6">
              <FolderOpen className="w-12 h-12 text-zinc-600" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-400">No workspace right now</h2>
            <p className="text-zinc-600 mt-2">Create your first project to get started!</p>
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
                          className={`group relative block h-60 p-8 rounded-[2.5rem] bg-zinc-900/40 border transition-all duration-500 overflow-hidden backdrop-blur-sm
                            ${snapshot.isDragging 
                              ? 'border-indigo-500 bg-zinc-800 shadow-[0_0_50px_rgba(99,102,241,0.3)] z-50' 
                              : 'border-zinc-800 hover:border-zinc-700'
                            }
                            /* LOGIKA MENGECIL SAAT DI ATAS SAMPAH */
                            ${snapshot.draggingOver === 'trash-bin' ? 'scale-50 opacity-40 rotate-12' : snapshot.isDragging ? 'scale-90' : 'scale-100'}
                          `}
                        >
                          <div className="absolute top-8 right-8 p-2 bg-zinc-800 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <ArrowUpRight className="w-4 h-4 text-indigo-400" />
                          </div>
                          <div className="w-12 h-1.5 rounded-full bg-indigo-500/50 mb-6 group-hover:w-20 group-hover:bg-indigo-500 transition-all duration-500" />
                          <h3 className="text-3xl font-bold text-zinc-200 group-hover:text-white tracking-tight leading-tight">{board.title}</h3>
                          <div className="absolute bottom-8 left-8 text-[10px] uppercase tracking-[0.4em] text-zinc-600 font-black group-hover:text-indigo-400 transition-colors">Launch Workspace →</div>
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
                className={`fixed bottom-12 right-12 w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-500 z-[100] border-2 border-dashed animate-in slide-in-from-bottom-10 fade-in
                  ${snapshot.isDraggingOver 
                    ? 'bg-red-500/20 border-red-500 scale-125 shadow-[0_0_80px_rgba(239,68,68,0.35)]' 
                    : 'bg-zinc-900/50 border-zinc-800 opacity-40 hover:opacity-100 shadow-xl'
                  }`}
              >
                <Trash2 className={`w-9 h-9 transition-all duration-300 ${snapshot.isDraggingOver ? 'text-red-500 scale-125 rotate-12' : 'text-zinc-600'}`} />
                <span className={`text-[9px] font-black uppercase tracking-tighter mt-2 transition-colors ${snapshot.isDraggingOver ? 'text-red-400' : 'text-zinc-500'}`}>
                  {snapshot.isDraggingOver ? "RELEASE" : "TRASH"}
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