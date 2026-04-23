'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string | null | undefined;
}

export default function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  ...props 
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Generate a very small blur data URL for placeholders
  const blurDataURL = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiMxYTFhMmUiLz48L3N2Zz4=';

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-white/5 rounded-lg border border-white/10 ${className}`} style={{ width: props.width || '100%', height: props.height || '100%', position: props.fill ? 'absolute' : 'relative' }}>
        <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  // Use standard img tag for blob or data URLs as Next.js Image doesn't support them well
  if (src.startsWith('blob:') || src.startsWith('data:')) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        {...(props as any)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      onLoad={() => setLoaded(true)}
      onError={() => setError(true)}
      placeholder="blur"
      blurDataURL={blurDataURL}
      {...props}
    />
  );
}
