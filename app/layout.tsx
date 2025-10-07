import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lican",
  description: "Lican（リカン）は旅先での割り勘計算のわずらわしさをシンプルに解決してくれるサービスです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

      {/* ヘッダー */}
      <header className="w-full p-5 bg-gray-200">
        <div className="flex justify-center items-end">
          <h1 className="font-bold text-2xl mr-1 text-sky-600 mt-10">Lican</h1>
          <span className="font-bold text-xs mb-1 text-sky-600">リカン</span>
        </div>
      </header>

        {children}
      </body>
    </html>
  );
}
