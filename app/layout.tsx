import { GeistSans } from "geist/font/sans";
import ReduxProvider from "@/providers/ReduxProvider";
import { Toaster } from "@/components/ui/toaster"
import "./globals.css";


const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "ProManager",
  description: "Task Management Board for Teams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
        <ReduxProvider>
        {children}
        </ReduxProvider>
        </main>
        <Toaster/>
      </body>
    </html>
  );
}
