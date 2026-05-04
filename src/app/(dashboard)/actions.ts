"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

/**
 * HELPER: Ambil User dari Cookie Session
 * Diperbaiki untuk memastikan sinkronisasi cookie yang lebih stabil
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
 * PROFILE ACTIONS
 * Mengupdate data user di database dan memperbarui cookie session untuk sidebar
 */
export async function updateProfileAction(formData: {
  fullName: string;
  displayName: string;
  email: string;
  bio: string;
}) {
  try {
    const user = await getSessionUser();
    
    if (!user) {
      return { error: "Session tidak ditemukan. Silakan login ulang." };
    }

    // 1. Update Database menggunakan ID unik
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        name: formData.fullName,
        displayName: formData.displayName,
        email: formData.email,
        bio: formData.bio,
      },
    });

    // 2. UPDATE COOKIE SESSION (PENTING: Agar Sidebar ikut berubah)
    const cookieStore = await cookies();
    cookieStore.set("user_name", updatedUser.name, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 minggu
    });

    // 3. REVALIDATE GLOBAL (Memaksa layout/sidebar render ulang data terbaru)
    revalidatePath("/", "layout");
    revalidatePath("/settings");
    
    return { success: true };
  } catch (error: unknown) {
    console.error("UPDATE_PROFILE_ERROR:", error);
    const prismaError = error as { code?: string };
    if (prismaError.code === 'P2002') {
      return { error: "Email sudah digunakan orang lain Ngab!" };
    }
    return { error: "Gagal memperbarui profil di database." };
  }
}

/**
 * BOARD ACTIONS
 */
export async function createBoardAction(title: string) {
  try {
    const user = await getSessionUser();
    if (!user) return { error: "Login dulu Ngab!" };

    const board = await db.board.create({
      data: {
        title,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, id: board.id }; 
  } catch (error) {
    console.error(error);
    return { error: "Gagal membuat board." };
  }
}

export async function deleteBoardAction(id: string) {
  try {
    await db.board.delete({ where: { id } });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error(error);
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
    console.error(error);
    throw new Error("Failed to delete list");
  }
}

/**
 * CARD ACTIONS
 */
export async function createCard(
  listId: string, 
  title: string, 
  boardId: string, 
  description?: string, 
  deadline?: string
) {
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
      },
    });

    revalidatePath(`/board/${boardId}`);
    return card;
  } catch (error) {
    console.error("CREATE_CARD_ERROR:", error);
    throw new Error("Gagal membuat card.");
  }
}

/**
 * AI ASSISTANT ACTION
 */
export async function createCardByAI(prompt: string) {
  try {
    const user = await getSessionUser();
    if (!user) return { success: false, message: "Login dulu Ngab!" };

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) return { success: false, message: "API Key Gemini tidak ditemukan!" };

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

    if (!response.ok) return { success: false, message: "AI sedang bermasalah." };

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const jsonMatch = responseText?.match(/\{[\s\S]*\}/);

    if (!jsonMatch) return { success: false, message: "AI gagal memahami perintah." };

    const { taskTitle, workspaceName } = JSON.parse(jsonMatch[0]);

    const allBoards = await db.board.findMany({
      where: { userId: user.id },
      include: { lists: { orderBy: { order: "asc" }, take: 1 } }
    });

    if (allBoards.length === 0) return { success: false, message: "Workspace tidak ditemukan." };

    const targetBoard = allBoards.find(b => 
      workspaceName && b.title.toLowerCase().includes(workspaceName.toLowerCase())
    ) || allBoards[0];

    const targetList = targetBoard.lists[0];
    if (!targetList) return { success: false, message: "Workspace belum memiliki kolom." };

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
    return { success: false, message: "Terjadi kesalahan pada AI Assistant." };
  }
}

/**
 * SECURITY ACTIONS
 */
export async function updatePasswordAction(formData: {
  currentPass: string;
  newPass: string;
}) {
  try {
    const user = await getSessionUser();
    if (!user) return { error: "Session expired, login lagi Ngab!" };

    // 1. Validasi Password Lama
    const isMatch = user.password === formData.currentPass; 
    if (!isMatch) return { error: "Password lama kamu salah!" };

    // 2. Update ke Database
    await db.user.update({
      where: { id: user.id },
      data: { password: formData.newPass },
    });

    return { success: true };
  } catch (error) {
    console.error("SECURITY_ERROR:", error);
    return { error: "Gagal ganti password." };
  }
}

/**
 * 2FA ACTIONS
 */
export async function send2FACodeAction(email: string) {
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6 digit
    
    await db.user.update({
      where: { email },
      data: { twoFactorCode: code }
    });

    // SIMULASI KIRIM EMAIL
    console.log(`[EMAIL SERVICE] Kirim kode ke ${email}: ${code}`);
    
    return { success: true, message: "Kode verifikasi dikirim ke email kamu!" };
  } catch (error) {
    return { error: "Gagal mengirim kode verifikasi." };
  }
}

export async function verify2FACodeAction(email: string, inputCode: string) {
  try {
    const user = await db.user.findUnique({ where: { email } });

    if (user?.twoFactorCode === inputCode) {
      // Hapus kode setelah berhasil verifikasi (One Time Use)
      await db.user.update({
        where: { email },
        data: { twoFactorCode: null }
      });
      return { success: true };
    }

    return { error: "Kode verifikasi salah, Ngab!" };
  } catch (error) {
    return { error: "Terjadi kesalahan verifikasi." };
  }
}