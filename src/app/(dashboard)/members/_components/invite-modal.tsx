"use client";

import { useState } from "react";
import { inviteMember } from "../../actions";
import { UserPlus, X, Loader2 } from "lucide-react";

interface InviteModalProps {
  boards: { id: string; title: string }[];
}

export default function InviteModal({ boards }: InviteModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [boardId, setBoardId] = useState(boards[0]?.id || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!email || !boardId) {
      setError("Please fill out all fields.");
      return;
    }

    setLoading(true);
    const res = await inviteMember(email, boardId);
    setLoading(false);

    if (res?.success) {
      setSuccess(res.message);
      setEmail("");
      setTimeout(() => {
        setIsOpen(false);
        setSuccess("");
      }, 2000);
    } else {
      setError(res?.message || "Something went wrong");
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3.5 rounded-md font-bold transition-all active:scale-95 shadow-sm"
      >
        <UserPlus className="w-4 h-4" />
        Invite Member
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-black w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-black/10 dark:border-white/10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-black/10 dark:border-white/10">
              <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-tight">Invite Member</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-zinc-500 hover:text-black dark:hover:text-white rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="p-6 space-y-6">
              {error && (
                <div className="p-3 rounded-md bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm font-bold border border-red-200 dark:border-red-900/50">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-sm font-bold border border-emerald-200 dark:border-emerald-900/50">
                  {success}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
                <input 
                  type="email" 
                  placeholder="colleague@enteam.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-sm font-medium focus:outline-none focus:border-black dark:focus:border-white transition-all text-black dark:text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Workspace</label>
                {boards.length === 0 ? (
                   <p className="text-sm font-medium text-red-500">You don't have any workspaces yet. Create one first.</p>
                ) : (
                  <select 
                    value={boardId}
                    onChange={(e) => setBoardId(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-md px-4 py-3 text-sm font-medium focus:outline-none focus:border-black dark:focus:border-white transition-all text-black dark:text-white"
                  >
                    {boards.map(b => (
                      <option key={b.id} value={b.id}>{b.title}</option>
                    ))}
                  </select>
                )}
              </div>

              <button 
                type="submit"
                disabled={loading || boards.length === 0}
                className="w-full py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-md font-black uppercase tracking-wider hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Send Invitation
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
