import type { Metadata } from "next";
import "./globals.css";
import StoreInitializer from "@/components/StoreInitializer";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: {
    default: "TurfKings - Book Premium Sports Turfs",
    template: "%s | TurfKings",
  },
  description: "Book premium cricket, football and badminton turfs near you. Real-time availability, instant confirmation. Experience the thrill under the lights.",
  keywords: ["turf booking", "cricket ground", "football turf", "badminton court", "sports booking", "turf near me"],
  authors: [{ name: "TurfKings" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    siteName: "TurfKings",
    title: "TurfKings - Book Premium Sports Turfs",
    description: "Book premium cricket, football and badminton turfs near you. Real-time availability, instant confirmation.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "TurfKings" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TurfKings - Book Premium Sports Turfs",
    description: "Book premium cricket, football and badminton turfs near you.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/Dark-Logo.svg", type: "image/svg+xml" }],
    shortcut: "/Dark-Logo.svg",
    apple: "/Dark-Logo.svg",
  },
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
            __html: `
              window.__INITIAL_USER__ = ${serializedUser};
              // Disable scroll restoration and force instant scroll to top
              if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
              }
              // Force scroll to top immediately on page load
              window.scrollTo(0, 0);
              document.documentElement.scrollTop = 0;
              document.body.scrollTop = 0;
            `,
          }}
        />
        <StoreInitializer initialUser={initialUser} />
        {children}
      </body>
    </html>
  );
}
