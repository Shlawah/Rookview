import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rookview",
  description: "Automations, Stock Research & AI Tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#000" }}>{children}</body>
    </html>
  );
}