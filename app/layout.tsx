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
    default: "Night X | The Workspace for Everyday Digital Work",
    template: "%s | Night X",
  },
  metadataBase: new URL(siteUrl),
  description: "Experience the ultimate private digital workspace. 42+ browser-first tools for developers, designers, and creators. Instant execution, zero server latency, files stay on your device.",
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
    title: "Night X | The Workspace for Everyday Digital Work",
    description: "42+ client-side browser tools for creators and developers. Secure, fast, and privacy-focused digital workspace.",
    url: siteUrl,
    siteName: "Night X",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Night X - The Workspace for Everyday Digital Work",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Night X | The Workspace for Everyday Digital Work",
    description: "42+ client-side browser tools for creators and developers. Secure, fast, and privacy-focused digital workspace.",
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
      "description": "The Workspace for Everyday Digital Work",
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
        "WASM Image Compression & Processing",
        "SubtleCrypto Hash Generation & Obfuscation",
        "AI Workflow Assistance"
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
      <body className="min-h-screen bg-[#080A0E] text-white font-sans antialiased selection:bg-primary/30 selection:text-white overflow-x-hidden">
        <SessionProvider>
          <SearchProvider>
            <ToastProvider>
              <ScrollObserver />
              
              {/* Subtle Ambient Glow Lighting (CSS Only - Zero JS overhead) */}
              <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
                <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/6 rounded-full blur-[100px]" />
                <div className="absolute top-[40%] right-[-120px] w-[400px] h-[400px] bg-accent-orange/4 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-150px] left-[-100px] w-[450px] h-[450px] bg-primary/4 rounded-full blur-[100px]" />
              </div>

              <div className="relative flex min-h-screen flex-col z-10">
                <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-3 focus:bg-primary focus:text-black font-bold top-2 left-2 rounded-lg">
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
