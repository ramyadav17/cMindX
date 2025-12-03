import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "cMindX – Self-Evolving Website Agent",
  description:
    "cMindX is an AI-powered agent that observes user behaviour, runs experiments and evolves your website content and layout automatically."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
