import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://night-x.com';

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
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.7,
  }));

  return staticRoutes;
}
