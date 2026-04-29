import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import DashboardClient from "../dashboard-client";

/**
 * SERVER ACTION
 * Fungsi ini berjalan di server untuk membuat board baru.
 * Kita kirim fungsi ini sebagai props ke Client Component.
 */
async function createBoardAction(title: string) {
  "use server";

  try {
    // 1. Buat board baru di database
    const newBoard = await db.board.create({
      data: {
        title,
        background: "indigo", // Default background
      },
    });

    // 2. Refresh data di halaman dashboard secara real-time
    revalidatePath("/");

    // 3. Kembalikan data board agar Client bisa redirect ke /board/[id]
    return newBoard;
  } catch (error) {
    console.error("CREATE_BOARD_ERROR:", error);
    return undefined;
  }
}

export default async function DashboardPage() {
  // 1. Ambil semua board milik user dari database
  const boards = await db.board.findMany({
    orderBy: {
      createdAt: "desc", // Yang terbaru muncul di atas
    },
  });

  return (
    /**
     * Kita panggil DashboardClient (file yang barusan kita buat).
     * * KEY: Sangat penting! Menggunakan boards.length sebagai key akan 
     * memaksa Client Component reset state saat jumlah data berubah.
     */
    <DashboardClient 
      key={boards.length}
      initialData={boards} 
      createBoardAction={createBoardAction} 
    />
  );
}