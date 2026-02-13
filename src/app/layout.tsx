import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DEEPLOL.GG | Elite League Analytics",
  description: "Advanced performance matrix and tag engine for League of Legends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=auto_awesome,dark_mode,dns,expand_more,help,language,light_mode,lock,military_tech,refresh,search,star,verified,ward" />
      </head>
      <body className={`${inter.className} bg-[var(--bg-root)] text-[var(--text-primary)] antialiased`}>
        <ThemeProvider>
          <Navbar />
          <main className="pt-20">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
