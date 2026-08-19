import type { Metadata, Viewport } from "next";
import "./globals.css";
import "../styles/responsive-fixes.css";
import SessionProvider from "@/components/providers/SessionProvider";
import { SearchProvider } from "@/components/providers/SearchProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollObserver from "@/components/layout/ScrollObserver";
import PageTransition from "@/components/layout/PageTransition";
import { Inter } from 'next/font/google';
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  themeColor: "#080A0E",
  width: "device-width",
  initialScale: 1,
};

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://night-x-v2.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Night X | The Sovereign Workspace for Everyday Digital Work",
    template: "%s | Night X",
  },
  metadataBase: new URL(siteUrl),
  description: "Experience the ultimate productivity hub. 42+ private browser-first tools for developers, designers, and creators. Instant execution, zero server latency, files stay on your device.",
  keywords: ["utility tools", "developer tools", "image tools", "security tools", "text tools", "Night X", "AI productivity", "privacy tools", "client-side processing"],
  authors: [{ name: "Nightmare-026", url: "https://github.com/Nightmare-026" }],
  creator: "Nightmare-026",
  publisher: "Night X Platform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Night X | The Sovereign Workspace for Everyday Digital Work",
    description: "42+ elite browser-first tools for creators and developers. Secure, fast, and privacy-focused utility workspace.",
    url: siteUrl,
    siteName: "Night X",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Night X - Sovereign Utility Hub",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Night X | The Sovereign Workspace for Everyday Digital Work",
    description: "42+ elite browser-first tools for creators and developers. Secure, fast, and privacy-focused utility workspace.",
    images: ["/og-image.png"],
    creator: "@Nightmare_026",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      "url": siteUrl,
      "name": "Night X",
      "description": "The Sovereign Workspace for Everyday Digital Work",
      "publisher": {
        "@type": "Organization",
        "name": "Night X",
        "url": siteUrl
      }
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#software`,
      "name": "Night X Platform",
      "operatingSystem": "All modern browsers (Chromium, Firefox, Safari)",
      "applicationCategory": "DeveloperApplication, UtilitiesApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "42+ Client-Side Browser Tools",
        "100% In-Browser Memory Safety",
        "Zero-Lag WASM Image Compression",
        "SubtleCrypto Hash Generation",
        "AI Workflow Automation"
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} overflow-x-hidden`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#080A0E] text-white font-inter antialiased selection:bg-primary/30 overflow-x-hidden">
        <SessionProvider>
          <SearchProvider>
            <ToastProvider>
              <ScrollObserver />
              
              {/* Global Ambient Background Effects */}
              <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
                <div className="absolute top-[-180px] left-[-180px] w-[550px] h-[550px] bg-primary/10 rounded-full blur-[70px] animate-blob-float-1" />
                <div className="absolute top-[45%] right-[-180px] w-[480px] h-[480px] bg-accent-cyan/8 rounded-full blur-[70px] animate-blob-float-2" />
                <div className="absolute bottom-[-180px] left-[30%] w-[420px] h-[420px] bg-primary/6 rounded-full blur-[70px] animate-blob-float-3" />
                <div className="noise-overlay" />
              </div>

              <div className="relative flex min-h-screen flex-col z-10">
                <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-primary focus:text-black font-bold top-0 left-0">
                  Skip to main content
                </a>
                <Header />
                <main id="main-content" className="flex-1 relative flex flex-col">
                  <PageTransition>{children}</PageTransition>
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
