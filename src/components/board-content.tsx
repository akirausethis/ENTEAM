"use client";

import { useState } from "react";
import { Plus, GripVertical, Trash2, X, Calendar, AlignLeft, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { createList, deleteList, createCard } from "@/app/(dashboard)/actions";
import { List, Card } from "@prisma/client";

interface CardItem extends Card {
  description: string | null;
  deadline: string | null; 
}

interface ListWithCards extends List {
  cards: CardItem[];
}

interface BoardContentProps {
  boardId: string;
  initialData: ListWithCards[];
}

export const BoardContent = ({ boardId, initialData }: BoardContentProps) => {
  const [orderedData, setOrderedData] = useState<ListWithCards[]>(initialData);
  const [addingCardToListId, setAddingCardToListId] = useState<string | null>(null);
  const [isAddingList, setIsAddingList] = useState(false);
  
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDesc, setNewCardDesc] = useState("");
  const [newCardDate, setNewCardDate] = useState("");
  const [newListTitle, setNewListTitle] = useState("");

  const [prevData, setPrevData] = useState(initialData);
  if (initialData !== prevData) {
    setOrderedData(initialData);
    setPrevData(initialData);
  }

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

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

  const onAddList = async () => {
    if (!newListTitle.trim()) return;
    try {
      await createList(boardId, newListTitle);
      setNewListTitle("");
      setIsAddingList(false);
      toast.success("List created!");
    } catch (error) {
      toast.error("Failed to create list");
    }
  };

  const onAddCard = async (listId: string) => {
    if (!newCardTitle.trim()) return;
    try {
      await createCard(listId, newCardTitle, boardId, newCardDesc, newCardDate);
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
      <style jsx global>{`
        ::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; opacity: 0.7; }
        input[type="date"]::-webkit-inner-spin-button,
        input[type="date"]::-webkit-clear-button { display: none; }
      `}</style>

      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="flex gap-6 h-full items-start pb-4">
            {orderedData.map((list, index) => (
              <Draggable key={list.id} draggableId={list.id} index={index}>
                {(provided, snapshot) => (
                  <div 
                    ref={provided.innerRef} 
                    {...provided.draggableProps} 
                    className={`w-80 shrink-0 bg-zinc-900/60 border ${snapshot.isDragging ? 'border-indigo-500 shadow-2xl' : 'border-zinc-800'} rounded-[2.5rem] flex flex-col transition-all duration-300`}
                  >
                    <div {...provided.dragHandleProps} className="p-6 flex items-center justify-between group border-b border-zinc-800/50">
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-4 h-4 text-zinc-700" />
                        <div className="font-bold text-[11px] text-zinc-300 uppercase tracking-widest italic">{list.title}</div>
                      </div>
                      <button onClick={() => deleteList(list.id, boardId)} className="opacity-0 group-hover:opacity-100 p-2 text-zinc-500 hover:text-red-400 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <Droppable droppableId={list.id} type="card">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="p-4 space-y-3 min-h-[20px]">
                          {list.cards?.map((card, cardIndex) => (
                            <Draggable key={card.id} draggableId={card.id} index={cardIndex}>
                              {(provided, snapshot) => (
                                <div 
                                  ref={provided.innerRef} 
                                  {...provided.draggableProps} 
                                  {...provided.dragHandleProps} 
                                  className={`bg-zinc-800/40 border ${snapshot.isDragging ? 'border-indigo-500 bg-zinc-800' : 'border-zinc-800'} p-4 rounded-2xl flex flex-col gap-2 group/card transition-all`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <input type="checkbox" className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-0 cursor-pointer" />
                                      <span className="text-sm text-zinc-200 font-bold leading-none">{card.title}</span>
                                    </div>
                                    <MoreHorizontal className="w-4 h-4 text-zinc-600 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                                  </div>
                                  {(card.description || card.deadline) && (
                                    <div className="pl-7 space-y-1.5">
                                      {card.deadline && (
                                        <div className="flex items-center gap-1.5 text-[9px] text-indigo-400 font-black uppercase tracking-tighter">
                                          <Calendar className="w-3 h-3" /> {card.deadline}
                                        </div>
                                      )}
                                      {card.description && (
                                        <p className="text-[10px] text-zinc-500 line-clamp-2 italic font-medium">{card.description}</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}

                          {addingCardToListId === list.id ? (
                            <div className="space-y-3 p-5 bg-zinc-900/90 rounded-[2rem] border border-zinc-800 shadow-2xl animate-in fade-in zoom-in duration-200">
                              <div className="space-y-1.5">
                                <label className="text-[9px] uppercase tracking-[0.2em] font-black text-zinc-600 ml-1">Title</label>
                                <input
                                  autoFocus
                                  placeholder="Task name..."
                                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
                                  value={newCardTitle}
                                  onChange={(e) => setNewCardTitle(e.target.value)}
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[9px] uppercase tracking-[0.2em] font-black text-zinc-600 ml-1">Notes</label>
                                <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 focus-within:border-indigo-500/50 transition-all">
                                  <AlignLeft className="w-4 h-4 text-zinc-500" />
                                  <textarea 
                                    rows={1}
                                    placeholder="Add notes..." 
                                    className="bg-transparent border-none text-[11px] text-zinc-300 focus:outline-none w-full resize-none"
                                    value={newCardDesc}
                                    onChange={(e) => setNewCardDesc(e.target.value)}
                                  />
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[9px] uppercase tracking-[0.2em] font-black text-zinc-600 ml-1">Deadline</label>
                                <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 focus-within:border-indigo-500/50 transition-all">
                                  <Calendar className="w-4 h-4 text-white/70" />
                                  <input 
                                    type="date" 
                                    className="bg-transparent border-none text-[11px] text-zinc-200 focus:outline-none w-full color-scheme-dark font-black h-6 uppercase"
                                    value={newCardDate}
                                    onChange={(e) => setNewCardDate(e.target.value)}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-2 pt-2">
                                <button onClick={() => onAddCard(list.id)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20">Add</button>
                                <button onClick={() => setAddingCardToListId(null)} className="p-1.5 text-zinc-500 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
                              </div>
                            </div>
                          ) : (
                            <button onClick={() => setAddingCardToListId(list.id)} className="w-full p-3 flex items-center gap-2 text-xs font-black text-zinc-600 hover:text-indigo-400 transition-all uppercase tracking-tighter italic">
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

            {isAddingList ? (
              <div className="w-80 shrink-0 bg-zinc-900 border border-zinc-800 p-6 rounded-[2.5rem] space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">List Title</label>
                  <input 
                    autoFocus
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    placeholder="e.g. Done..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-bold"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={onAddList} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all">Create</button>
                  <button onClick={() => setIsAddingList(false)} className="p-3 text-zinc-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsAddingList(true)}
                className="w-80 shrink-0 bg-white/5 border border-dashed border-white/10 hover:bg-white/10 hover:border-white/20 p-8 rounded-[2.5rem] flex items-center justify-center gap-3 text-zinc-500 font-black text-sm transition-all italic tracking-tighter"
              >
                <Plus className="w-5 h-5" /> ADD ANOTHER LIST
              </button>
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};