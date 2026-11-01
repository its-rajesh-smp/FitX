import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitX: your personal trainer, in a chat",
  description:
    "Tell FitX your goal, gear and time, and get a weekly workout plan you can change just by asking.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      {/* Browser extensions inject attributes (e.g. style) on body before hydration. */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
