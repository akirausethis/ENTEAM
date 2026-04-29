import { cookies } from "next/headers";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Ambil nama user dari cookie yang diset saat login/signup
  const cookieStore = await cookies();
  const userName = cookieStore.get("user_name")?.value || "User";

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      {/* 2. Kirim nama ke Sidebar sebagai props */}
      <Sidebar userName={userName} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </main>
    </div>
  );
}