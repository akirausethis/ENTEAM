"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import bcrypt from "bcrypt"; // WAJIB: Untuk ganti password

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
 * PROFILE ACTIONS
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

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        name: formData.fullName,
        displayName: formData.displayName,
        email: formData.email,
        bio: formData.bio,
      },
    });

    const cookieStore = await cookies();
    cookieStore.set("user_name", updatedUser.name, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    revalidatePath("/", "layout");
    revalidatePath("/settings");
    
    return { success: true };
  } catch (error: unknown) {
    console.error("UPDATE_PROFILE_ERROR:", error);
    const prismaError = error as { code?: string };
    if (prismaError.code === 'P2002') {
      return { error: "Email sudah digunakan orang lain Ngab!" };
    }
    return { error: "Gagal memperbarui profil." };
  }
}

/**
 * SECURITY ACTIONS: Ganti Password (FIXED)
 */
export async function updatePasswordAction(formData: {
  currentPass: string;
  newPass: string;
}) {
  try {
    const user = await getSessionUser();
    if (!user) return { error: "Session expired, login lagi Ngab!" };

    // 1. Validasi Password Lama dengan bcrypt.compare
    const isMatch = await bcrypt.compare(formData.currentPass, user.password); 
    if (!isMatch) return { error: "Password lama kamu salah!" };

    // 2. Hash Password Baru sebelum disimpan
    const hashedNewPassword = await bcrypt.hash(formData.newPass, 10);

    // 3. Update ke Database
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
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
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    await db.user.update({
      where: { email },
      data: { twoFactorCode: code }
    });

    console.log(`[EMAIL SERVICE] Kirim kode ke ${email}: ${code}`);
    return { success: true, message: "Kode verifikasi dikirim ke email kamu!" };
  } catch (error) {
    return { error: "Gagal mengirim kode." };
  }
}

export async function verify2FACodeAction(email: string, inputCode: string) {
  try {
    const user = await db.user.findUnique({ where: { email } });
    if (user?.twoFactorCode === inputCode) {
      await db.user.update({
        where: { email },
        data: { twoFactorCode: null }
      });
      return { success: true };
    }
    return { error: "Kode verifikasi salah!" };
  } catch (error) {
    return { error: "Terjadi kesalahan verifikasi." };
  }
}

/**
 * BOARD, LIST & CARD ACTIONS
 */
export async function createBoardAction(title: string) {
  try {
    const user = await getSessionUser();
    if (!user) return { error: "Login dulu Ngab!" };
    const board = await db.board.create({ data: { title, userId: user.id } });
    revalidatePath("/dashboard");
    return { success: true, id: board.id }; 
  } catch (error) {
    return { error: "Gagal membuat board." };
  }
}

export async function deleteBoardAction(id: string) {
  try {
    await db.board.delete({ where: { id } });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete board" };
  }
}

export async function createList(boardId: string, title: string) {
  try {
    const lastList = await db.list.findFirst({ where: { boardId }, orderBy: { order: "desc" } });
    const newOrder = lastList ? lastList.order + 1 : 1;
    const list = await db.list.create({ data: { title, boardId, order: newOrder } });
    revalidatePath(`/board/${boardId}`);
    return list;
  } catch (error) {
    throw new Error("Gagal membuat list.");
  }
}

export async function deleteList(id: string, boardId: string) {
  try {
    await db.list.delete({ where: { id } });
    revalidatePath(`/board/${boardId}`);
    return { success: true };
  } catch (error) {
    throw new Error("Failed to delete list");
  }
}

export async function createCard(
  listId: string, 
  title: string, 
  boardId: string, 
  description?: string, 
  deadline?: string
) {
  try {
    // 1. Ambil order terakhir
    const lastCard = await db.card.findFirst({
      where: { listId },
      orderBy: { order: "desc" },
    });
    
    const nextOrder = lastCard ? lastCard.order + 1 : 1;

    // 2. Simpan ke Database
    const card = await db.card.create({
      data: {
        title: title,
        listId: listId,
        order: nextOrder,
        description: description || "",
        deadline: deadline || "",
        priority: "MEDIUM", // Default
        isCompleted: false,
      },
    });

    revalidatePath(`/board/${boardId}`);
    revalidatePath("/tasks");
    
    return card;
  } catch (error) {
    console.error("PRISMA_CREATE_CARD_ERROR:", error);
    throw new Error("Gagal membuat card.");
  }
}
/**
 * AI ASSISTANT ACTION
 */
export async function createCardByAI(prompt: string) {
  try {
    const user = await getSessionUser();
    if (!user) return { success: false, message: "Login dulu!" };

    const API_KEY = process.env.GEMINI_API_KEY;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Extract JSON: {"taskTitle": "...", "workspaceName": "..."} from: ${prompt}` }] }],
        }),
      }
    );

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const jsonMatch = responseText?.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { success: false, message: "AI bingung." };

    const { taskTitle, workspaceName } = JSON.parse(jsonMatch[0]);
    const allBoards = await db.board.findMany({ where: { userId: user.id }, include: { lists: { take: 1 } } });
    const targetBoard = allBoards.find(b => workspaceName && b.title.toLowerCase().includes(workspaceName.toLowerCase())) || allBoards[0];
    const targetList = targetBoard?.lists[0];

    if (!targetList) return { success: false, message: "Workspace/Kolom tidak ketemu." };

    await createCard(targetList.id, taskTitle, targetBoard.id, "Created by Gemini AI ✨");
    revalidatePath("/dashboard");
    revalidatePath(`/board/${targetBoard.id}`);
    return { success: true, message: `Anjay! "${taskTitle}" masuk ke "${targetBoard.title}".` };
  } catch (error) {
    return { success: false, message: "Terjadi kesalahan pada AI." };
  }
}