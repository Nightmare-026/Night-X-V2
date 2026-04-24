import type { Metadata, Viewport } from "next";
import "./globals.css";
import "../styles/responsive-fixes.css";
import SessionProvider from "@/components/providers/SessionProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const viewport: Viewport = {
  themeColor: "#06080F",
  width: "device-width",
  initialScale: 1,
};

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nightx.app";

export const metadata: Metadata = {
  title: {
    default: "Night X | Utility Tools for Everyday Work",
    template: "%s | Night X",
  },
  metadataBase: new URL(siteUrl),
  description: "Boost your productivity with Night X. Free browser-first tools for developers including QR generation, password security, and text utilities.",
  keywords: ["utility tools", "developer tools", "image tools", "security tools", "text tools", "Night X"],
  authors: [{ name: "Nightmare-026", url: "https://github.com/Nightmare-026" }],
  creator: "Nightmare-026",
  publisher: "Nightmare-026",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Night X | Utility Tools for Everyday Work",
    description: "Free, high-performance browser tools for creators and developers. QR codes, password security, and text utilities in one place.",
    url: siteUrl,
    siteName: "Night X",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Night X Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Night X | Utility Tools for Everyday Work",
    description: "Free, high-performance browser tools for creators and developers. QR codes, password security, and text utilities in one place.",
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
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-dm-sans antialiased">
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
