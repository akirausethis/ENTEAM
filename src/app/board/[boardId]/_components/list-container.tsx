"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus, GripVertical, Trash2, X, MoreHorizontal, Calendar, AlignLeft } from "lucide-react";
import { toast } from "sonner";
import { createList, deleteList, updateListTitle, createCard } from "../_actions";

interface CardItem {
  id: string;
  title: string;
  description: string | null; // Ganti dari optional (?) atau undefined menjadi string | null
  order: number;
  createdAt: Date;
  updatedAt: Date;
  listId: string;
  deadline?: string; // Ini boleh tetap optional kalau tidak ada di skema Prisma
}

interface ListData {
  id: string;
  title: string;
  order: number;
  boardId: string;
  createdAt: Date;
  updatedAt: Date;
  cards: CardItem[];
}

export const ListContainer = ({ boardId, data }: { boardId: string, data: ListData[] }) => {
  const [orderedData, setOrderedData] = useState<ListData[]>(data);
  const [addingCardToListId, setAddingCardToListId] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDesc, setNewCardDesc] = useState("");
  const [newCardDate, setNewCardDate] = useState("");

  useEffect(() => { setOrderedData(data); }, [data]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    if (!destination) return;
    const newOrderedData = [...orderedData];
    if (type === "list") {
      const [reorderedItem] = newOrderedData.splice(source.index, 1);
      newOrderedData.splice(destination.index, 0, reorderedItem);
      setOrderedData(newOrderedData);
    } else {
      const sourceList = newOrderedData.find(l => l.id === source.droppableId);
      const destList = newOrderedData.find(l => l.id === destination.droppableId);
      if (!sourceList || !destList) return;
      const [movedCard] = sourceList.cards.splice(source.index, 1);
      destList.cards.splice(destination.index, 0, movedCard);
      setOrderedData(newOrderedData);
    }
  };

  const onAddCard = async (listId: string) => {
    if (!newCardTitle.trim()) return;
    try {
      await createCard(listId, newCardTitle, boardId);
      setAddingCardToListId(null);
      setNewCardTitle("");
      setNewCardDesc("");
      setNewCardDate("");
      toast.success("Card created!");
    } catch (error) {
      toast.error("Failed to add card");
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* TRICK UNTUK ICON KALENDER PUTIH & CUSTOM DATE PICKER */}
      <style jsx global>{`
        ::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
          opacity: 0.7;
        }
        input[type="date"]::-webkit-inner-spin-button,
        input[type="date"]::-webkit-clear-button {
          display: none;
        }
      `}</style>

      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="flex gap-6 h-full items-start">
            {orderedData.map((list, index) => (
              <Draggable key={list.id} draggableId={list.id} index={index}>
                {(provided, snapshot) => (
                  <div 
                    ref={provided.innerRef} 
                    {...provided.draggableProps} 
                    className={`w-80 shrink-0 bg-zinc-900/60 border ${snapshot.isDragging ? 'border-indigo-500 shadow-2xl' : 'border-zinc-800'} rounded-[2.5rem] flex flex-col transition-all duration-300`}
                  >
                    {/* LIST HEADER */}
                    <div {...provided.dragHandleProps} className="p-6 flex items-center justify-between group border-b border-zinc-800/50">
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-4 h-4 text-zinc-700" />
                        <div className="font-bold text-[11px] text-zinc-300 uppercase tracking-widest leading-none">
                          {list.title}
                        </div>
                      </div>
                      <button onClick={() => deleteList(list.id, boardId)} className="opacity-0 group-hover:opacity-100 p-2 text-zinc-500 hover:text-red-400 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* CARDS AREA */}
                    <Droppable droppableId={list.id} type="card">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="p-4 space-y-3 min-h-[20px]">
                          {list.cards?.map((card, cardIndex) => (
                            <Draggable key={card.id} draggableId={card.id} index={cardIndex}>
                              {(provided) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="bg-zinc-800/40 border border-zinc-800 p-4 rounded-2xl flex flex-col gap-2">
                                  <div className="flex items-center gap-3">
                                    <input type="checkbox" className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-indigo-600" />
                                    <span className="text-sm text-zinc-300 font-medium leading-none">{card.title}</span>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}

                          {/* FORM ADD CARD - COMPACT & ALIGNED VERSION */}
                          {addingCardToListId === list.id ? (
                            <div className="space-y-3 p-4 bg-zinc-900/90 rounded-[2rem] border border-zinc-800 shadow-2xl animate-in fade-in zoom-in duration-200">
                              
                              {/* TITLE INPUT */}
                              <div className="space-y-1.5">
                                <label className="text-[9px] uppercase tracking-[0.2em] font-black text-zinc-600 ml-1">Title</label>
                                <input
                                  autoFocus
                                  placeholder="Task name..."
                                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all"
                                  value={newCardTitle}
                                  onChange={(e) => setNewCardTitle(e.target.value)}
                                />
                              </div>

                              {/* NOTES INPUT - CENTERED ALIGN */}
                              <div className="space-y-1.5">
                                <label className="text-[9px] uppercase tracking-[0.2em] font-black text-zinc-600 ml-1">Notes</label>
                                <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all">
                                  <AlignLeft className="w-4 h-4 text-zinc-400 shrink-0" />
                                  <textarea 
                                    rows={1}
                                    placeholder="Add description..." 
                                    className="bg-transparent border-none text-[12px] text-zinc-300 focus:outline-none w-full resize-none py-0.5 leading-relaxed"
                                    value={newCardDesc}
                                    onChange={(e) => setNewCardDesc(e.target.value)}
                                  />
                                </div>
                              </div>

                              {/* DEADLINE INPUT - CENTERED ALIGN */}
                              <div className="space-y-1.5">
                                <label className="text-[9px] uppercase tracking-[0.2em] font-black text-zinc-600 ml-1">Deadline</label>
                                <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all">
                                  <Calendar className="w-4 h-4 text-white opacity-80 shrink-0" />
                                  <input 
                                    type="date" 
                                    className="bg-transparent border-none text-[12px] text-zinc-200 focus:outline-none w-full color-scheme-dark font-medium h-6"
                                    value={newCardDate}
                                    onChange={(e) => setNewCardDate(e.target.value)}
                                  />
                                </div>
                              </div>

                              {/* ACTIONS */}
                              <div className="flex items-center gap-2 pt-1">
                                <button 
                                  onClick={() => onAddCard(list.id)} 
                                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-500/10"
                                >
                                  Add Card
                                </button>
                                <button 
                                  onClick={() => setAddingCardToListId(null)} 
                                  className="p-1.5 text-zinc-500 hover:text-white transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button onClick={() => setAddingCardToListId(list.id)} className="w-full p-3 flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-indigo-400 transition-all">
                              <Plus className="w-4 h-4" /> Add a card
                            </button>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};