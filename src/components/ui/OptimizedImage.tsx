'use client';

import Image, { ImageProps } from 'next/image';
import { Box, Skeleton } from '@mui/material';
import { useState } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string;
  showSkeleton?: boolean;
  containerSx?: object;
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/images/placeholder.png',
  showSkeleton = true,
  containerSx = {},
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    if (currentSrc !== fallbackSrc && fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      setIsLoading(false);
      setHasError(true);
    }
    onError?.();
  };

  return (
    <Box
      position="relative"
      sx={{
        overflow: 'hidden',
        borderRadius: 1,
        ...containerSx,
      }}
    >
      {/* Skeleton loader */}
      {isLoading && showSkeleton && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
      )}

      {/* Image */}
      {!hasError && (
        <Image
          {...props}
          src={currentSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out',
            ...props.style,
          }}
          // Performance optimizations
          loading="lazy"
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
      )}

      {/* Error state */}
      {hasError && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
          bgcolor="grey.100"
          color="text.secondary"
          sx={{
            minHeight: 100,
            borderRadius: 1,
          }}
        >
          <Box textAlign="center">
            <Box component="span" sx={{ fontSize: '2rem' }}>
              🖼️
            </Box>
            <Box component="div" sx={{ fontSize: '0.75rem', mt: 1 }}>
              Error al cargar imagen
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

// Convenience components for common use cases
export function AvatarImage({
  size = 40,
  ...props
}: OptimizedImageProps & { size?: number }) {
  return (
    <OptimizedImage
      {...props}
      width={size}
      height={size}
      containerSx={{
        width: size,
        height: size,
        borderRadius: '50%',
      }}
    />
  );
}

export function CardImage({
  aspectRatio = '16/9',
  ...props
}: OptimizedImageProps & { aspectRatio?: string }) {
  return (
    <OptimizedImage
      {...props}
      fill
      containerSx={{
        aspectRatio,
        position: 'relative',
      }}
    />
  );
}
