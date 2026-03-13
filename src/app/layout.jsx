import { Geist, Geist_Mono } from "next/font/google";
import ChatbotWidget from "@/components/ChatbotWidget";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PATENT-IPR | Smart IP Management",
  description: "End-to-end Patent, Trademark & IP Filing with real-time case tracking. Join 1,000+ companies managing their intellectual assets globally.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ChatbotWidget />
      </body>
    </html>
  );
}
