import "./globals.css";
import { Toaster } from "sonner"; // Import ini

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Tambahkan ini di paling bawah body */}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}