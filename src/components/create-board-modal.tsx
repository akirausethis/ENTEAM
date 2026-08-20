"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Loader2, X, Briefcase } from "lucide-react";

interface CreateBoardModalProps {
  createAction: (title: string) => Promise<{ id: string } | undefined>;
}

export const CreateBoardModal = ({ createAction }: CreateBoardModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    
    if (!trimmedTitle) {
      toast.error("Board name cannot be empty.");
      return;
    }

    if (typeof createAction !== "function") {
      toast.error("A system error occurred. Please refresh the page.");
      return;
    }

    try {
      setIsLoading(true);
      const newBoard = await createAction(trimmedTitle);

      if (newBoard?.id) {
        toast.success("Board Created Successfully!");
        setIsOpen(false);
        setTitle("");
        router.push(`/board/${newBoard.id}`);
      } else {
        throw new Error("Failed to get new board ID");
      }
    } catch (error) {
      toast.error("Failed to create board. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="group bg-black dark:bg-white text-white dark:text-black px-6 py-4 rounded-md font-bold hover:opacity-90 transition-all flex items-center gap-3 active:scale-95 shadow-sm border border-black/10 dark:border-white/10"
      >
        <div className="w-6 h-6 bg-white/20 dark:bg-black/20 rounded-md flex items-center justify-center group-hover:rotate-90 transition-transform">
          <Plus className="w-4 h-4" />
        </div>
        New Workspace
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-white/40 dark:bg-black/40 backdrop-blur-sm">
          <div 
            className="absolute inset-0" 
            onClick={() => !isLoading && setIsOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-black dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 rounded-md transition-all"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-black dark:bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Briefcase className="w-6 h-6 text-white dark:text-black" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">New Workspace</h2>
                <p className="text-zinc-500 text-sm font-medium">Create a new board for your project</p>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Workspace Name</label>
                <input 
                  type="text"
                  value={title}
                  disabled={isLoading}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q4 Marketing Campaign"
                  className="w-full bg-transparent border border-black/20 dark:border-white/20 rounded-md px-4 py-3 text-sm font-medium focus:outline-none focus:border-black dark:focus:border-white transition-all disabled:opacity-50"
                  autoFocus
                />
              </div>
              
              <div className="flex items-center gap-3 pt-4">
                <button 
                  type="button"
                  disabled={isLoading}
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-6 py-3.5 text-zinc-500 hover:text-black dark:hover:text-white font-bold transition-colors disabled:opacity-50 border border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isLoading || !title.trim()}
                  className="flex-[1.5] bg-black dark:bg-white text-white dark:text-black font-bold py-3.5 rounded-md transition-all flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-50 border border-black/10 dark:border-white/10"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    "Launch Board"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};