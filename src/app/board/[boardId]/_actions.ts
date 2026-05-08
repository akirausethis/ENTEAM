"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * BOARD ACTIONS
 */
export async function deleteBoardAction(id: string) {
  try {
    await db.board.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("DELETE_BOARD_ERROR:", error);
    return { error: "Failed to delete board" };
  }
}

/**
 * LIST ACTIONS
 */
export async function createList(boardId: string, title: string) {
  try {
    if (!boardId || !title) throw new Error("Board ID dan Title wajib ada!");

    const lastList = await db.list.findFirst({
      where: { boardId: boardId },
      orderBy: { order: "desc" },
    });
    
    const newOrder = lastList ? lastList.order + 1 : 1;

    const list = await db.list.create({
      data: {
        title: title,
        boardId: boardId,
        order: newOrder,
      },
    });

    revalidatePath(`/board/${boardId}`);
    return list;
  } catch (error) {
    console.error("CREATE_LIST_ERROR:", error);
    throw new Error("Gagal membuat list.");
  }
}

export async function deleteList(id: string, boardId: string) {
  try {
    await db.list.delete({ where: { id } });
    revalidatePath(`/board/${boardId}`);
    return { success: true };
  } catch (error) {
    console.error("DELETE_LIST_ERROR:", error);
    throw new Error("Failed to delete list");
  }
}

/**
 * CARD ACTIONS
 * Format Object Destructuring agar sinkron dengan Frontend
 */
export async function createCard({
  listId,
  title,
  boardId,
  description,
  deadline,
  priority = "MEDIUM"
}: {
  listId: string;
  title: string;
  boardId: string;
  description?: string;
  deadline?: string;
  priority?: string;
}) {
  try {
    const lastCard = await db.card.findFirst({
      where: { listId },
      orderBy: { order: "desc" },
    });
    
    const nextOrder = lastCard ? lastCard.order + 1 : 1;

    const card = await db.card.create({
      data: {
        title,
        listId,
        order: nextOrder,
        description: description || "", 
        deadline: deadline || "", 
        priority: priority,
        isCompleted: false, 
      },
    });

    revalidatePath(`/board/${boardId}`);
    revalidatePath("/tasks"); 
    
    return card;
  } catch (error) {
    console.error("CREATE_CARD_ERROR:", error);
    throw new Error("Gagal membuat card.");
  }
}

export async function inviteMemberAction(boardId: string, email: string) {
  try {
    const userToInvite = await db.user.findUnique({ where: { email } });
    if (!userToInvite) return { error: "User dengan email ini tidak ditemukan!" };

    const existingMember = await db.boardMember.findFirst({
      where: { boardId, userId: userToInvite.id }
    });
    if (existingMember) return { error: "User ini sudah jadi member, Ngab!" };

    await db.boardMember.create({
      data: {
        boardId,
        userId: userToInvite.id,
        role: "MEMBER"
      }
    });

    revalidatePath(`/board/${boardId}`);
    return { success: true };
  } catch (error) {
    return { error: "Gagal invite member." };
  }
}