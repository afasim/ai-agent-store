import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Agent Store - Build, Publish, and Run AI Agents",
  description: "An open-source marketplace for discovering and running custom AI agents. Build AI-powered applications without writing code.",
  keywords: ["AI", "agents", "marketplace", "chatbot", "AI assistant"],
  authors: [{ name: "AI Agent Store" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased bg-white">
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
