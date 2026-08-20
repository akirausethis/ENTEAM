"use client";

import { useState } from "react";
import { Plus, GripVertical, Trash2, X, Calendar, AlignLeft, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { createList, deleteList, createCard, updateListOrder, updateCardOrder } from "@/app/(dashboard)/actions";
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
      
      const orderedLists = newOrderedData.map((list, idx) => ({ ...list, order: idx + 1 }));
      setOrderedData(orderedLists);
      updateListOrder(boardId, orderedLists.map(l => ({ id: l.id, order: l.order })));
    } else {
      const sourceListIndex = newOrderedData.findIndex(l => l.id === source.droppableId);
      const destListIndex = newOrderedData.findIndex(l => l.id === destination.droppableId);
      if (sourceListIndex === -1 || destListIndex === -1) return;
      
      const sourceList = newOrderedData[sourceListIndex];
      const destList = newOrderedData[destListIndex];

      const [movedCard] = sourceList.cards.splice(source.index, 1);
      movedCard.listId = destination.droppableId;

      destList.cards.splice(destination.index, 0, movedCard);
      
      const destCardsOrdered = destList.cards.map((card, idx) => ({ ...card, order: idx + 1, listId: destination.droppableId }));
      destList.cards = destCardsOrdered;

      setOrderedData([...newOrderedData]);
      updateCardOrder(boardId, destCardsOrdered.map(c => ({ id: c.id, order: c.order, listId: c.listId })));
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
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="flex gap-6 h-full items-start pb-4">
            {orderedData.map((list, index) => (
              <Draggable key={list.id} draggableId={list.id} index={index}>
                {(provided, snapshot) => (
                  <div 
                    ref={provided.innerRef} 
                    {...provided.draggableProps} 
                    className={`w-80 shrink-0 bg-white dark:bg-black border ${snapshot.isDragging ? 'border-black dark:border-white shadow-xl' : 'border-black/10 dark:border-white/10 shadow-sm'} rounded-xl flex flex-col transition-all duration-200`}
                  >
                    <div {...provided.dragHandleProps} className="p-4 flex items-center justify-between group border-b border-black/5 dark:border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md transition-colors text-zinc-400 cursor-grab active:cursor-grabbing">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <div className="font-bold text-xs text-black dark:text-white uppercase tracking-widest">{list.title}</div>
                        <div className="ml-2 bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 px-2 py-0.5 rounded-sm text-[10px] font-bold text-zinc-500">
                          {list.cards.length}
                        </div>
                      </div>
                      <button onClick={() => deleteList(list.id, boardId)} className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <Droppable droppableId={list.id} type="card">
                      {(provided, snapshot) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className={`p-3 space-y-3 min-h-[50px] transition-colors rounded-b-xl ${snapshot.isDraggingOver ? 'bg-zinc-50 dark:bg-zinc-900/50' : ''}`}>
                          {list.cards?.map((card, cardIndex) => (
                            <Draggable key={card.id} draggableId={card.id} index={cardIndex}>
                              {(provided, snapshot) => (
                                  <div 
                                    ref={provided.innerRef} 
                                    {...provided.draggableProps} 
                                    {...provided.dragHandleProps} 
                                    className={`bg-white dark:bg-zinc-950 border ${snapshot.isDragging ? 'border-black dark:border-white shadow-lg' : 'border-black/10 dark:border-white/10 shadow-sm hover:border-black/20 dark:hover:border-white/20'} p-4 rounded-lg flex flex-col gap-3 group/card transition-all cursor-grab active:cursor-grabbing`}
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex items-start gap-3 mt-0.5">
                                        <div className="relative flex items-center justify-center">
                                          <input type="checkbox" className="peer w-4 h-4 rounded-sm border-black/20 dark:border-white/20 bg-transparent text-black dark:text-white focus:ring-0 cursor-pointer transition-colors checked:bg-black dark:checked:bg-white" />
                                        </div>
                                        <span className="text-[13px] text-black dark:text-white font-medium leading-tight">{card.title}</span>
                                      </div>
                                      <button className="opacity-0 group-hover/card:opacity-100 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md transition-all">
                                        <MoreHorizontal className="w-4 h-4 text-zinc-400" />
                                      </button>
                                    </div>
                                    {(card.description || card.deadline) && (
                                      <div className="pl-7 space-y-2">
                                        {card.description && (
                                          <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed font-medium">{card.description}</p>
                                        )}
                                        {card.deadline && (
                                          <div className="inline-flex items-center gap-1.5 text-[10px] text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 px-2 py-1 rounded-sm">
                                            <Calendar className="w-3 h-3" /> {card.deadline}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}

                          {addingCardToListId === list.id ? (
                            <div className="space-y-3 p-4 bg-white dark:bg-zinc-950 rounded-lg border border-black/20 dark:border-white/20 shadow-md">
                              <div className="space-y-1.5">
                                <label className="text-[9px] uppercase tracking-widest font-bold text-zinc-500 ml-1">Title</label>
                                <input
                                  autoFocus
                                  placeholder="Task name..."
                                  className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-md px-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-all font-medium"
                                  value={newCardTitle}
                                  onChange={(e) => setNewCardTitle(e.target.value)}
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[9px] uppercase tracking-widest font-bold text-zinc-500 ml-1">Notes</label>
                                <div className="flex items-start gap-2 border border-black/10 dark:border-white/10 rounded-md px-3 py-2 focus-within:border-black dark:focus-within:border-white transition-all">
                                  <AlignLeft className="w-4 h-4 text-zinc-400 mt-0.5" />
                                  <textarea 
                                    rows={2}
                                    placeholder="Add notes..." 
                                    className="bg-transparent border-none text-xs text-black dark:text-white focus:outline-none w-full resize-none font-medium"
                                    value={newCardDesc}
                                    onChange={(e) => setNewCardDesc(e.target.value)}
                                  />
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[9px] uppercase tracking-widest font-bold text-zinc-500 ml-1">Deadline</label>
                                <div className="flex items-center gap-2 border border-black/10 dark:border-white/10 rounded-md px-3 py-2 focus-within:border-black dark:focus-within:border-white transition-all">
                                  <Calendar className="w-4 h-4 text-zinc-400" />
                                  <input 
                                    type="date" 
                                    className="bg-transparent border-none text-xs text-black dark:text-white focus:outline-none w-full font-medium"
                                    value={newCardDate}
                                    onChange={(e) => setNewCardDate(e.target.value)}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-2 pt-2">
                                <button onClick={() => onAddCard(list.id)} className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest hover:opacity-80 transition-all shadow-sm">Add Card</button>
                                <button onClick={() => setAddingCardToListId(null)} className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md transition-colors"><X className="w-4 h-4" /></button>
                              </div>
                            </div>
                          ) : (
                            <button onClick={() => setAddingCardToListId(list.id)} className="w-full p-2.5 flex items-center justify-center gap-2 text-xs font-bold text-zinc-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-all tracking-widest uppercase">
                              <Plus className="w-3.5 h-3.5" /> Add a card
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
              <div className="w-80 shrink-0 bg-white dark:bg-black border border-black/20 dark:border-white/20 p-4 rounded-xl space-y-4 shadow-md">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">List Title</label>
                  <input 
                    autoFocus
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    placeholder="e.g. Done..."
                    className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-md px-3 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-all font-medium"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={onAddList} className="flex-1 bg-black dark:bg-white text-white dark:text-black py-2.5 rounded-md text-[11px] font-bold uppercase tracking-widest hover:opacity-80 transition-all shadow-sm">Create List</button>
                  <button onClick={() => setIsAddingList(false)} className="p-2.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md transition-colors"><X className="w-4 h-4" /></button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsAddingList(true)}
                className="w-80 shrink-0 bg-transparent border border-dashed border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40 hover:bg-black/5 dark:hover:bg-white/5 p-6 rounded-xl flex items-center justify-center gap-2 text-zinc-500 font-bold text-xs transition-all uppercase tracking-widest"
              >
                <Plus className="w-4 h-4" /> ADD ANOTHER LIST
              </button>
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};