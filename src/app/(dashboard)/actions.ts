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
  const userId = cookieStore.get("user_id")?.value;
  
  if (!userId) return null;

  return await db.user.findUnique({
    where: { id: userId },
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
    cookieStore.set("user_id", updatedUser.id, {
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
      return { error: "Email is already in use by another account." };
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
    if (!user) return { error: "Session expired. Please log in again." };

    // 1. Validasi Password Lama dengan bcrypt.compare
    const isMatch = await bcrypt.compare(formData.currentPass, user.password); 
    if (!isMatch) return { error: "Incorrect current password." };

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
    if (!user) return { error: "Please log in to perform this action." };
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

export async function updateListOrder(boardId: string, lists: { id: string, order: number }[]) {
  try {
    const transaction = lists.map((list) => 
      db.list.update({
        where: { id: list.id },
        data: { order: list.order },
      })
    );
    await db.$transaction(transaction);
    revalidatePath(`/board/${boardId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to update list order" };
  }
}

export async function updateCardOrder(boardId: string, cards: { id: string, order: number, listId: string }[]) {
  try {
    const transaction = cards.map((card) => 
      db.card.update({
        where: { id: card.id },
        data: { order: card.order, listId: card.listId },
      })
    );
    await db.$transaction(transaction);
    revalidatePath(`/board/${boardId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to update card order" };
  }
}

export async function inviteMember(email: string, boardId: string) {
  try {
    const user = await getSessionUser();
    if (!user) return { success: false, message: "Unauthorized" };

    // Find the invited user
    const invitedUser = await db.user.findUnique({ where: { email } });
    if (!invitedUser) return { success: false, message: "User with this email not found." };

    // Prevent inviting yourself
    if (invitedUser.id === user.id) return { success: false, message: "You cannot invite yourself." };

    // Check if the board belongs to the current user
    const board = await db.board.findUnique({ where: { id: boardId } });
    if (!board || board.userId !== user.id) {
      return { success: false, message: "Board not found or you don't have permission." };
    }

    // Check if already a member
    const existingMembership = await db.boardMember.findUnique({
      where: {
        boardId_userId: {
          boardId: board.id,
          userId: invitedUser.id,
        },
      },
    });

    if (existingMembership) {
      return { success: false, message: "User is already a member of this workspace." };
    }

    // Create membership
    await db.boardMember.create({
      data: {
        boardId: board.id,
        userId: invitedUser.id,
        role: "Member",
      },
    });

    revalidatePath("/members");
    revalidatePath(`/board/${board.id}`);
    
    return { success: true, message: `Successfully invited ${invitedUser.displayName || invitedUser.name}.` };
  } catch (error) {
    console.error("INVITE_MEMBER_ERROR:", error);
    return { success: false, message: "Failed to invite member." };
  }
}