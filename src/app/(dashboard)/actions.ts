"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * AI ASSISTANT ACTION (Direct API Fetch Version)
 * Tanpa library tambahan, langsung tembak ke Google Gemini API v1 Stable
 */
export async function createCardByAI(prompt: string) {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return { success: false, message: "API Key Gemini belum dipasang di .env Ngab!" };
    }

    // Kita pakai fetch langsung ke endpoint v1 Stable (Anti 404)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Kamu adalah asisten database untuk EnTeam. Tugasmu mengekstrak data dari user. 
                         Balas HANYA dengan JSON mentah tanpa markdown: {"taskTitle": "nama tugas", "workspaceName": "nama board"}. 
                         Pesan user: ${prompt}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("GOOGLE_API_ERROR:", errorData);
      return { success: false, message: "Gagal ngobrol sama Gemini. Cek terminal!" };
    }

    const data = await response.json();
    
    // Parsing response teks dari struktur JSON Google
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      return { success: false, message: "AI gak kasih jawaban Ngab, coba lagi." };
    }

    // Pembersih JSON untuk nangkep teks di antara { ... }
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { success: false, message: "Format AI ngaco, coba perintah yang lebih jelas." };
    }

    const aiData = JSON.parse(jsonMatch[0]);
    const { taskTitle, workspaceName } = aiData;

    if (!taskTitle) {
      return { success: false, message: "Judul tugas gak nangkep Ngab." };
    }

    // Ambil semua board untuk pencarian fleksibel
    const allBoards = await db.board.findMany({
      include: { 
        lists: { 
          orderBy: { order: "asc" }, 
          take: 1 
        } 
      }
    });

    if (allBoards.length === 0) {
      return { success: false, message: "Kamu belum punya workspace." };
    }

    // Cari board yang mirip, kalau gak ketemu pake board pertama
    const targetBoard = allBoards.find(b => 
      workspaceName && b.title.toLowerCase().includes(workspaceName.toLowerCase())
    ) || allBoards[0];

    const targetList = targetBoard.lists[0];

    if (!targetList) {
      return { success: false, message: `Workspace "${targetBoard.title}" belum punya kolom.` };
    }

    // Hitung order terakhir
    const lastCard = await db.card.findFirst({
      where: { listId: targetList.id },
      orderBy: { order: "desc" },
    });
    const nextOrder = lastCard ? lastCard.order + 1 : 1;

    // Simpan ke Database
    await db.card.create({
      data: {
        title: taskTitle,
        listId: targetList.id,
        order: nextOrder,
        description: "Created by AI Assistant ✨",
      }
    });

    revalidatePath("/");
    revalidatePath(`/board/${targetBoard.id}`);

    return { 
      success: true, 
      message: `Anjay! Tugas "${taskTitle}" masuk ke "${targetBoard.title}".` 
    };

  } catch (error) {
    console.error("--- ERROR_LOG ---");
    if (error instanceof Error) console.error(error.message);
    return { success: false, message: "Gagal eksekusi. Pastikan internet lancar!" };
  }
}

// --- BASIC BOARD ACTIONS ---

export async function deleteBoardAction(id: string) {
  try {
    await db.board.delete({ where: { id } });
    revalidatePath("/");
    return { success: true };
  } catch {
    throw new Error("Failed to delete board");
  }
}

// --- LIST ACTIONS ---

export async function createList(boardId: string, title: string) {
  try {
    const lastList = await db.list.findFirst({
      where: { boardId },
      orderBy: { order: "desc" },
    });
    const newOrder = lastList ? lastList.order + 1 : 1;

    const list = await db.list.create({
      data: { title, boardId, order: newOrder },
    });
    revalidatePath(`/board/${boardId}`);
    return list;
  } catch {
    throw new Error("Failed to create list");
  }
}

export async function updateListTitle(id: string, title: string, boardId: string) {
  try {
    await db.list.update({ where: { id }, data: { title } });
    revalidatePath(`/board/${boardId}`);
  } catch {
    throw new Error("Failed to update list title");
  }
}

export async function deleteList(id: string, boardId: string) {
  try {
    await db.list.delete({ where: { id } });
    revalidatePath(`/board/${boardId}`);
  } catch {
    throw new Error("Failed to delete list");
  }
}

// --- CARD ACTIONS ---

export async function createCard(listId: string, title: string, boardId: string) {
  try {
    const lastCard = await db.card.findFirst({
      where: { listId },
      orderBy: { order: "desc" },
    });
    const newOrder = lastCard ? lastCard.order + 1 : 1;

    const card = await db.card.create({
      data: { title, listId, order: newOrder },
    });
    revalidatePath(`/board/${boardId}`);
    return card;
  } catch {
    throw new Error("Failed to create card");
  }
}