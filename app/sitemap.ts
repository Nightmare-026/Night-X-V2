import { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools-registry';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://night-x-v2.vercel.app';
  const lastModified = new Date();

  // Get all public tools for SEO
  const toolRoutes = TOOLS.filter(t => t.isPublic).map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const staticRoutes = [
    '',
    '/tools',
    '/pricing',
    '/changelog',
    '/status',
    '/security',
    '/docs',
    '/about',
    '/services',
    '/contact',
    '/faq',
    '/feedback',
    '/support',
    '/privacy',
    '/terms',
    '/auth/signin',
    '/auth/signup',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === '' || route === '/tools' ? ('daily' as const) : ('weekly' as const),
    priority: route === '' ? 1.0 : (route === '/tools' || route === '/pricing' ? 0.9 : 0.7),
  }));

  return [...staticRoutes, ...toolRoutes];
}
