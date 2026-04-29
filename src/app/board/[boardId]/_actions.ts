"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createList(boardId: string, title: string) {
  const lastList = await db.list.findFirst({
    where: { boardId },
    orderBy: { order: "desc" },
  });
  const newOrder = lastList ? lastList.order + 1 : 1;

  await db.list.create({
    data: { title, boardId, order: newOrder }
  });
  revalidatePath(`/board/${boardId}`);
}

export async function deleteList(id: string, boardId: string) {
  await db.list.delete({ where: { id } });
  revalidatePath(`/board/${boardId}`);
}

export async function updateListTitle(id: string, title: string, boardId: string) {
  await db.list.update({
    where: { id },
    data: { title }
  });
  revalidatePath(`/board/${boardId}`);
}

export async function createCard(listId: string, title: string, boardId: string) {
  const lastCard = await db.card.findFirst({
    where: { listId },
    orderBy: { order: "desc" },
  });
  const newOrder = lastCard ? lastCard.order + 1 : 1;

  await db.card.create({
    data: { title, listId, order: newOrder }
  });
  revalidatePath(`/board/${boardId}`);
}

export async function deleteBoardAction(id: string) {
  try {
    await db.board.delete({
      where: { id }
    });
    revalidatePath("/");
  } catch (error) {
    throw new Error("Failed to delete board");
  }}