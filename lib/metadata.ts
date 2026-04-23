import { Metadata } from 'next';

export function constructMetadata({
  title = "Night X | The Ultimate Utility Hub",
  description = "A powerful, unified workspace with 40+ free utilities for developers, creators, and professionals. Compress images, encode data, generate passwords, and more.",
  image = "/api/og",
  icons = "/favicon.ico",
  noIndex = false
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@NightX"
    },
    icons,
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://night-x.com'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    })
  };
}
