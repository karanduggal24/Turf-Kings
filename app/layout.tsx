import type { Metadata } from "next";
import "./globals.css";
import StoreInitializer from "@/components/StoreInitializer";

export const metadata: Metadata = {
  title: "TurfKings - Turf Booking Platform",
  description: "Premium cricket and football grounds available near you. Experience the thrill under the lights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/Dark-Logo.svg" type="image/svg+xml" />
        <link rel="icon" href="/Dark-Logo.svg" sizes="32x32" type="image/svg+xml" />
        <link rel="icon" href="/Dark-Logo.svg" sizes="16x16" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/Dark-Logo.svg" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black min-h-screen text-white font-display overflow-x-hidden selection:bg-neon-green selection:text-black" suppressHydrationWarning={true}>
        <StoreInitializer />
        {children}
      </body>
    </html>
  );
}
