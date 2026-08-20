import { cookies } from "next/headers";
import { Sidebar } from "@/components/sidebar";
import { db } from "@/lib/db";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  
  let userName = "User";
  if (userId) {
    const user = await db.user.findUnique({
      where: { id: userId }
    });
    if (user) {
      userName = user.displayName || user.name;
    }
  }

  return (
    <div className="flex h-screen w-full bg-white dark:bg-black overflow-hidden text-black dark:text-white font-sans antialiased">
      
      <Sidebar userName={userName} />
      
      <main className="flex-1 w-full h-full overflow-y-auto relative">
        <div className="p-8 w-full max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
      
    </div>
  );
}