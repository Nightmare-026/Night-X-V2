export function lazyLoadIntersection(callback: () => void, element: Element) {
  if (!('IntersectionObserver' in window)) {
    callback();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Disconnect immediately to prevent loop
        observer.unobserve(entry.target);
        observer.disconnect();
        callback();
      }
    });
  }, { threshold: 0.1 });

  observer.observe(element);
  
  // Safety timeout to prevent infinite hanging
  setTimeout(() => {
    observer.disconnect();
  }, 10000);
}

export function measureWebVitals(metric: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
  }
}

export function generateBlurDataURL(width: number, height: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = 8;
  canvas.height = 8;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#1a1a2e'; // Night X dark background
    ctx.fillRect(0, 0, 8, 8);
  }
  return canvas.toDataURL('image/jpeg', 0.1);
}

export function deferNonCritical(fn: () => void) {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(fn);
  } else {
    setTimeout(fn, 1);
  }
}

export function preloadTool(slug: string) {
  // In Next.js App Router, router.prefetch() is the standard way.
  // This is a utility wrapper that could be expanded if we use a dynamic import map.
  // For now, it's a no-op if called server-side.
  if (typeof window === 'undefined') return;
  // Next.js automatically prefetches Link components with prefetch={true}
  // But for manual preloading we can use standard fetch to pre-warm the cache or custom logic.
  try {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = `/tools/${slug}`;
    document.head.appendChild(link);
  } catch (e) {
    console.error('Error preloading tool:', e);
  }
}
