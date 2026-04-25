import type { Metadata, Viewport } from "next";
import "./globals.css";
import "../styles/responsive-fixes.css";
import SessionProvider from "@/components/providers/SessionProvider";
import { SearchProvider } from "@/components/providers/SearchProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Outfit, DM_Sans } from 'next/font/google';

const outfit = Outfit({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
});

export const viewport: Viewport = {
  themeColor: "#06080F",
  width: "device-width",
  initialScale: 1,
};

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nightx.app";

export const metadata: Metadata = {
  title: {
    default: "Night X | Elite Utility Tools Hub",
    template: "%s | Night X",
  },
  metadataBase: new URL(siteUrl),
  description: "Experience the ultimate productivity hub. 40+ browser-first tools for developers, designers, and creators. Secure, fast, and privacy-focused.",
  keywords: ["utility tools", "developer tools", "image tools", "security tools", "text tools", "Night X", "AI productivity", "privacy tools"],
  authors: [{ name: "Nightmare-026", url: "https://github.com/Nightmare-026" }],
  creator: "Nightmare-026",
  publisher: "Nightmare-026",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Night X | Elite Utility Tools Hub",
    description: "40+ elite browser-first tools for creators and developers. Secure, fast, and privacy-focused utility workspace.",
    url: siteUrl,
    siteName: "Night X",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Night X - Elite Utility Hub",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Night X | Elite Utility Tools Hub",
    description: "40+ elite browser-first tools for creators and developers. Secure, fast, and privacy-focused utility workspace.",
    images: ["/og-image.png"],
    creator: "@Nightmare_026",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-background font-dm-sans antialiased selection:bg-accent-purple/30">
        <SessionProvider>
          <SearchProvider>
            <div className="relative flex min-h-screen flex-col">
              <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-accent-purple focus:text-white top-0 left-0">
                Skip to main content
              </a>
              <Header />
              <main id="main-content" className="flex-1 relative">
                {children}
              </main>
              <Footer />
            </div>
          </SearchProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
