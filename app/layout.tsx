import type { Metadata } from "next";
import "./globals.css";
import StoreInitializer from "@/components/StoreInitializer";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "TurfKings - Turf Booking Platform",
  description: "Premium cricket and football grounds available near you. Experience the thrill under the lights.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  const initialUser = session?.user || null;
  const serializedUser = initialUser ? JSON.stringify(initialUser) : null;

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/Dark-Logo.svg" type="image/svg+xml" />
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
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__INITIAL_USER__ = ${serializedUser};`,
          }}
        />
        <StoreInitializer initialUser={initialUser} />
        {children}
      </body>
    </html>
  );
}
