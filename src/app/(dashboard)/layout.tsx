import { cookies } from "next/headers";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const userName = cookieStore.get("user_name")?.value || "User";

  return (
    // h-screen biar tingginya pas selayar, overflow-hidden biar gak ada scroll double
    <div className="flex h-screen w-full bg-zinc-950 overflow-hidden">
      
      {/* Sidebar punya lebar tetap (w-72) */}
      <Sidebar userName={userName} />
      
      {/* Main area harus flex-1 biar ngisi sisa space, w-full & overflow-auto biar bisa scroll kontennya aja */}
      <main className="flex-1 w-full h-full overflow-y-auto bg-zinc-950 relative">
        <div className="p-8 w-full max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
      
    </div>
  );
}