'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useIntersectionObserver } from '@/lib/performance/lazyLoading';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  lazy?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
  lazy = true,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(!lazy || priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || shouldLoad) return;

    const observer = useIntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, priority, shouldLoad]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate blur placeholder if not provided
  const generateBlurDataURL = (w: number, h: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, w, h);
    }
    return canvas.toDataURL();
  };

  const defaultBlurDataURL = blurDataURL || (width && height ? generateBlurDataURL(width, height) : undefined);

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Failed to load image</span>
      </div>
    );
  }

  if (!shouldLoad) {
    return (
      <div 
        ref={imgRef}
        className={`bg-gray-200 animate-pulse ${className}`}
        style={{ width, height }}
      />
    );
  }

  const imageProps: any = {
    src,
    alt,
    quality,
    priority,
    onLoad: handleLoad,
    onError: handleError,
    className: `transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`,
  };

  if (fill) {
    imageProps.fill = true;
  } else {
    imageProps.width = width;
    imageProps.height = height;
  }

  if (placeholder === 'blur' && defaultBlurDataURL) {
    imageProps.placeholder = 'blur';
    imageProps.blurDataURL = defaultBlurDataURL;
  }

  if (sizes) {
    imageProps.sizes = sizes;
  }

  return (
    <div ref={imgRef} className="relative">
      <Image {...imageProps} />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
}

// Responsive image component with automatic sizing
interface ResponsiveImageProps extends Omit<OptimizedImageProps, 'width' | 'height'> {
  aspectRatio?: number;
  maxWidth?: number;
}

export function ResponsiveImage({
  aspectRatio = 16 / 9,
  maxWidth = 1200,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  ...props
}: ResponsiveImageProps) {
  return (
    <div 
      className="relative w-full"
      style={{ 
        aspectRatio: aspectRatio.toString(),
        maxWidth: `${maxWidth}px`,
      }}
    >
      <OptimizedImage
        {...props}
        fill
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}

// Avatar component with optimized loading
interface AvatarImageProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  className?: string;
}

export function AvatarImage({
  src,
  alt,
  size = 'md',
  fallback,
  className = '',
}: AvatarImageProps) {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const sizePixels = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  };

  if (!src || hasError) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gray-300 flex items-center justify-center ${className}`}>
        <span className="text-gray-600 font-medium">
          {fallback || alt.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={sizePixels[size]}
      height={sizePixels[size]}
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      onError={() => setHasError(true)}
      quality={90}
    />
  );
}