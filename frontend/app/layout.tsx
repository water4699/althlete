import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Athlete Registration System",
  description: "Privacy-preserving athlete registration using FHE",
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" translate="no">
      <body className="bg-slate-950 text-slate-100 antialiased">
        <Providers>
          <div className="relative min-h-screen overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-slate-950 to-slate-950" />
            <div className="absolute inset-x-0 top-[-200px] h-[500px] blur-3xl opacity-30 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500" />

            <Navigation />

            <main className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-10">
              {children}
        </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
