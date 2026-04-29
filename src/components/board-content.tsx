"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, X } from "lucide-react";
import { createList, createCard } from "../app/(dashboard)/actions" // Pastikan path action bener
import { List, Card } from "@prisma/client";

interface BoardContentProps {
  boardId: string;
  initialData: (List & { cards: Card[] })[];
}

export const BoardContent = ({ boardId, initialData }: BoardContentProps) => {
  const [lists, setLists] = useState(initialData);
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  const onAddList = async () => {
    if (!newListTitle) return;
    const newList = await createList(boardId, newListTitle);
    setLists([...lists, { ...newList, cards: [] }]);
    setNewListTitle("");
    setIsAddingList(false);
  };

  return (
    <div className="flex gap-6 h-full items-start">
      {/* RENDER LISTS */}
      {lists.map((list) => (
        <div key={list.id} className="w-80 shrink-0 bg-zinc-900/40 border border-zinc-800/50 rounded-[24px] flex flex-col max-h-full">
          <div className="p-4 flex items-center justify-between">
            <h3 className="text-sm font-black text-white px-2 uppercase tracking-wider">{list.title}</h3>
            <button className="p-2 text-zinc-600 hover:text-white transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 space-y-2 pb-2">
            {list.cards.map((card) => (
              <div key={card.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl shadow-sm group hover:border-indigo-500/50 transition-all cursor-pointer">
                <p className="text-sm font-bold text-zinc-300 group-hover:text-white">{card.title}</p>
              </div>
            ))}
          </div>

          {/* ADD CARD BUTTON */}
          <div className="p-3">
            <button 
              onClick={async () => {
                const title = prompt("Nama Card?");
                if (title) {
                  const newCard = await createCard(list.id, title, boardId);
                  setLists(lists.map(l => l.id === list.id ? { ...l, cards: [...l.cards, newCard] } : l));
                }
              }}
              className="w-full flex items-center gap-2 p-3 rounded-xl hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-all text-xs font-bold"
            >
              <Plus className="w-4 h-4" /> Add a card
            </button>
          </div>
        </div>
      ))}

      {/* ADD LIST BUTTON */}
      {isAddingList ? (
        <div className="w-80 shrink-0 bg-zinc-900 border border-zinc-800 p-4 rounded-[24px] space-y-3">
          <input 
            autoFocus
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            placeholder="Enter list title..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
          <div className="flex items-center gap-2">
            <button onClick={onAddList} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-black transition-all">
              Add List
            </button>
            <button onClick={() => setIsAddingList(false)} className="text-zinc-500 hover:text-white p-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsAddingList(true)}
          className="w-80 shrink-0 bg-white/5 border border-dashed border-white/10 hover:bg-white/10 hover:border-white/20 p-4 rounded-[24px] flex items-center gap-2 text-zinc-400 font-bold text-sm transition-all shadow-xl shadow-black/20"
        >
          <Plus className="w-5 h-5" /> Add another list
        </button>
      )}
    </div>
  );
};