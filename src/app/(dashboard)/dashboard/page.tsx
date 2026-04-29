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
    const userName = cookieStore.get("user_name")?.value;

    if (!userName) return undefined;

    // 1. Cari user di DB untuk dapat ID-nya
    const user = await db.user.findFirst({
      where: { name: userName }
    });

    if (!user) return undefined;

    // 2. Buat board baru (Tanpa field 'background' karena gak ada di schema)
    const newBoard = await db.board.create({
      data: {
        title,
        userId: user.id, // WAJIB ADA INI NGAB
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
  const userName = cookieStore.get("user_name")?.value;

  // 1. Ambil info user
  const user = await db.user.findFirst({
    where: { name: userName }
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