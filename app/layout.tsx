import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/provider/theme-provider";
import Navbar from "./components/nav-bar";
import { Toaster } from "@/components/ui/toaster";
//import { SessionProvider } from "next-auth/react";
//import { getServerSession } from "next-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next.js App with Authentication",
  description:
    "Modern Next.js application with authentication and theme switching",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //const session = await getServerSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50`}
        //className={inter.className}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <SessionProvider session={session}></SessionProvider> */}
          <div className="flex flex-col min-h-screen">
            <div className="container mx-auto px-4 sm:px-6">
              <Navbar />

              <main className="flex-1 py-4">{children}</main>

              <footer className="py-4 text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
                © {new Date().getFullYear()} Your App. All rights reserved.
              </footer>

              <Toaster />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
