import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlayGround - Turf Booking Platform",
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
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black min-h-screen text-white font-display overflow-x-hidden selection:bg-neon-green selection:text-black">
        {children}
      </body>
    </html>
  );
}
