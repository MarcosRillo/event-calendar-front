import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ✅ Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
        ]
      }
    ]
  },
  
  // ✅ Configuración experimental para optimizaciones
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },

  // ✅ Rewrites mejorados con fallbacks seguros
  async rewrites() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiBaseUrl}/api/:path*`,
      },
      {
        source: '/sanctum/:path*',
        destination: `${apiBaseUrl}/sanctum/:path*`,
      },
    ];
  },

  // ✅ Configuraciones adicionales de performance
  poweredByHeader: false, // Oculta el header "x-powered-by"
  
  // ✅ Optimizaciones de imagen
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
}

export default nextConfig
