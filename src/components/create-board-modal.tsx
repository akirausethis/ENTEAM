"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Loader2, X, Layout } from "lucide-react";

interface CreateBoardModalProps {
  // Gunakan 'undefined' agar sinkron dengan interface di Dashboard
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
      toast.error("Nama board tidak boleh kosong!");
      return;
    }

    // Safety Check: Pastikan createAction beneran fungsi
    if (typeof createAction !== "function") {
      console.error("Error: createAction is not a function. Check your props in page.tsx");
      toast.error("Sistem sedang bermasalah, coba refresh halaman.");
      return;
    }

    try {
      setIsLoading(true);
      
      // Jalankan action ke database
      const newBoard = await createAction(trimmedTitle);

      if (newBoard?.id) {
        toast.success("Board Berhasil Dibuat!", {
          description: `Project "${trimmedTitle}" siap dikelola.`,
        });

        setIsOpen(false);
        setTitle("");
        
        // Redirect ke halaman board baru
        router.push(`/board/${newBoard.id}`);
      } else {
        // Jika fungsi jalan tapi tidak balikkan ID
        throw new Error("Failed to get new board ID");
      }
    } catch (error) {
      console.error(error);
      toast.error("Waduh, gagal membuat board. Coba lagi ya!");
    } finally {
      setIsLoading(false);
    }
  };

  // --- UI LOGIC ---

  // Tombol Trigger (Buka Modal)
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="group bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-8 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95 flex items-center gap-2"
      >
        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        <span>Create New Board</span>
      </button>
    );
  }

  // Tampilan Modal (Pop-up)
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay: Klik di luar modal untuk menutup */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={() => !isLoading && setIsOpen(false)} 
      />
      
      {/* Modal Card */}
      <div className="relative bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors p-2"
          disabled={isLoading}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-8">
          <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center mb-4 border border-indigo-500/20">
            <Layout className="w-6 h-6 text-indigo-500" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter mb-2 leading-none">
            Create Board
          </h2>
          <p className="text-zinc-500 font-medium text-sm">
            Tentukan nama project impianmu hari ini.
          </p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600 ml-1">
              Project Title
            </label>
            <input
              autoFocus
              required
              disabled={isLoading}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              placeholder="Contoh: Redesign Landing Page"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button 
              type="button"
              disabled={isLoading}
              onClick={() => setIsOpen(false)}
              className="flex-1 px-6 py-4 text-zinc-400 hover:text-white font-bold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isLoading || !title.trim()}
              className="flex-[1.5] bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white py-4 rounded-2xl font-black transition-all shadow-lg shadow-indigo-500/10 active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Launching...</span>
                </>
              ) : (
                "Launch Board"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};