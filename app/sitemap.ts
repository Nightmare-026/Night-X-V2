import { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools-registry';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://night-x.com';
  const lastModified = new Date();

  // Get all public tools for SEO
  const toolRoutes = TOOLS.filter(t => t.isPublic).map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const staticRoutes = [
    '',
    '/auth/signin',
    '/auth/signup',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/support',
    '/services',
    '/feedback',
    '/faq'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.7,
  }));

  return [...staticRoutes, ...toolRoutes];
}
