"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

/**
 * HELPER: Ambil User dari Cookie Session
 */
async function getSessionUser() {
  const cookieStore = await cookies();
  const userName = cookieStore.get("user_name")?.value;
  if (!userName) return null;

  return await db.user.findFirst({
    where: { name: userName },
  });
}

/**
 * AI ASSISTANT ACTION
 * Menggunakan AI untuk membuat card di workspace yang tepat milik user.
 */
export async function createCardByAI(prompt: string) {
  try {
    const user = await getSessionUser();
    if (!user) return { success: false, message: "Login dulu Ngab!" };

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) return { success: false, message: "API Key Gemini ilang di .env!" };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Kamu adalah asisten database EnTeam. Ekstrak data dari user. 
                     Balas HANYA JSON mentah: {"taskTitle": "nama tugas", "workspaceName": "nama board"}. 
                     Pesan user: ${prompt}`,
            }],
          }],
        }),
      }
    );

    if (!response.ok) return { success: false, message: "Gemini lagi pusing, cek terminal!" };

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const jsonMatch = responseText?.match(/\{[\s\S]*\}/);

    if (!jsonMatch) return { success: false, message: "AI gagal paham perintahmu." };

    const { taskTitle, workspaceName } = JSON.parse(jsonMatch[0]);

    // Cek board milik USER INI SAJA
    const allBoards = await db.board.findMany({
      where: { userId: user.id },
      include: { lists: { orderBy: { order: "asc" }, take: 1 } }
    });

    if (allBoards.length === 0) return { success: false, message: "Kamu belum punya workspace." };

    const targetBoard = allBoards.find(b => 
      workspaceName && b.title.toLowerCase().includes(workspaceName.toLowerCase())
    ) || allBoards[0];

    const targetList = targetBoard.lists[0];
    if (!targetList) return { success: false, message: "Workspace belum punya kolom." };

    const lastCard = await db.card.findFirst({
      where: { listId: targetList.id },
      orderBy: { order: "desc" },
    });
    const nextOrder = lastCard ? lastCard.order + 1 : 1;

    await db.card.create({
      data: {
        title: taskTitle,
        listId: targetList.id,
        order: nextOrder,
        description: "Created by Gemini AI ✨",
      }
    });

    revalidatePath("/dashboard");
    revalidatePath(`/board/${targetBoard.id}`);

    return { success: true, message: `Anjay! "${taskTitle}" masuk ke "${targetBoard.title}".` };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Koneksi internet atau server lagi bermasalah." };
  }
}

// --- BOARD ACTIONS ---

export async function createBoardAction(title: string) {
  try {
    const user = await getSessionUser(); // Fungsi yang kita buat tadi buat ambil user dari cookie
    if (!user) return { error: "Login dulu Ngab!" };

    const board = await db.board.create({
      data: {
        title,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");
    // SANGAT PENTING: Return ID board-nya
    return { success: true, id: board.id }; 
  } catch (error) {
    console.error(error);
    return { error: "Gagal membuat board ke database." };
  }
}

export async function deleteBoardAction(id: string) {
  try {
    await db.board.delete({ where: { id } });
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    throw new Error("Failed to delete board");
  }
}

// --- LIST ACTIONS ---

export async function createList(boardId: string, title: string) {
  try {
    // Debugging: Cek apakah boardId-nya masuk atau undefined
    console.log("Mencoba membuat list untuk boardId:", boardId);

    if (!boardId || !title) {
      throw new Error("Board ID dan Title wajib ada!");
    }

    // 1. Hitung order terakhir
    const lastList = await db.list.findFirst({
      where: { boardId: boardId },
      orderBy: { order: "desc" },
    });
    
    const newOrder = lastList ? lastList.order + 1 : 1;

    // 2. Insert ke Database
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
    // LIHAT DI TERMINAL VS CODE KAMU, PASTI ADA DETAIL ERRORNYA DI SINI
    console.error("DETAIL_ERROR_PRISMA:", error);
    throw new Error("Gagal membuat list di database.");
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

export async function createCard(
  listId: string, 
  title: string, 
  boardId: string, 
  description?: string, // Parameter ke-4 (opsional)
  deadline?: string    // Parameter ke-5 (opsional)
) {
  try {
    const lastCard = await db.card.findFirst({
      where: { listId },
      orderBy: { order: "desc" },
    });
    
    const newOrder = lastCard ? lastCard.order + 1 : 1;

    const card = await db.card.create({
      data: {
        title,
        listId,
        order: newOrder,
        description: description || "", // Simpan deskripsi
        deadline: deadline || "",       // Simpan tanggal
      },
    });

    revalidatePath(`/board/${boardId}`);
    return card;
  } catch (error) {
    console.error("CREATE_CARD_ERROR:", error);
    throw new Error("Gagal membuat card.");
  }
}