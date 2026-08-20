import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import DashboardClient from "../dashboard-client";

/**
 * SERVER ACTION
 * Sekarang sudah pakai userId dari session cookie.
 */
async function createBoardAction(title: string) {
  "use server";

  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) return undefined;

    // 1. Cari user di DB untuk dapat ID-nya
    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) return undefined;

    // 2. Buat board baru (Tanpa field 'background' karena gak ada di schema)
    const newBoard = await db.board.create({
      data: {
        title,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");
    return newBoard;
  } catch (error) {
    console.error("CREATE_BOARD_ERROR:", error);
    return undefined;
  }
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  // 1. Ambil info user
  const user = await db.user.findUnique({
    where: { id: userId || "" }
  });

  // 2. Ambil board KHUSUS milik user yang login
  const boards = await db.board.findMany({
    where: {
      userId: user?.id
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <DashboardClient 
      key={boards.length}
      initialData={boards} 
      createBoardAction={createBoardAction} 
    />
  );
}