import type { Metadata, Viewport } from "next";
import "./globals.css";
import "../styles/responsive-fixes.css";
import SessionProvider from "@/components/providers/SessionProvider";
import { SearchProvider } from "@/components/providers/SearchProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollObserver from "@/components/layout/ScrollObserver";
import { Inter } from 'next/font/google';
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  themeColor: "#0A0A0F",
  width: "device-width",
  initialScale: 1,
};

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nightx.app";

export const metadata: Metadata = {
  title: {
    default: "Night X | One Hub. Every Tool You Need.",
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
    title: "Night X | One Hub. Every Tool You Need.",
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
    title: "Night X | One Hub. Every Tool You Need.",
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} overflow-x-hidden`}>
      <body className="min-h-screen bg-background font-inter antialiased selection:bg-primary/40 overflow-x-hidden">
        <SessionProvider>
          <SearchProvider>
            <ToastProvider>
              <ScrollObserver />
              
              {/* Global Background Effects */}
              <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-primary/15 rounded-full blur-[60px] animate-blob-float-1" />
                <div className="absolute top-[40%] right-[-200px] w-[500px] h-[500px] bg-accent-cyan/10 rounded-full blur-[60px] animate-blob-float-2" />
                <div className="absolute bottom-[-200px] left-[30%] w-[400px] h-[400px] bg-accent-pink/8 rounded-full blur-[60px] animate-blob-float-3" />
                <div className="noise-overlay" />
              </div>

              <div className="relative flex min-h-screen flex-col z-10">
                <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-primary focus:text-white top-0 left-0">
                  Skip to main content
                </a>
                <Header />
                <main id="main-content" className="flex-1 relative">
                  {children}
                </main>
                <Footer />
              </div>
            </ToastProvider>
          </SearchProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

