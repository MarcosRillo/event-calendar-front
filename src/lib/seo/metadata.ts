import type { Metadata } from 'next';

interface PageMetadataOptions {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
}

interface BreadcrumbItem {
  label: string;
  url: string;
}

// Base site configuration
const SITE_CONFIG = {
  name: 'Event Calendar',
  description: 'Sistema de gestión de eventos - Ente de Turismo de Tucumán',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://eventos.tucumanturismo.gov.ar',
  ogImage: '/images/og-default.jpg',
  twitter: '@TucumanTurismo',
};

/**
 * Creates standardized metadata for pages
 */
export function createPageMetadata(options: PageMetadataOptions): Metadata {
  const {
    title,
    description,
    keywords = [],
    ogImage = SITE_CONFIG.ogImage,
    canonical,
    noIndex = false
  } = options;

  const fullTitle = title.includes(SITE_CONFIG.name) 
    ? title 
    : `${title} | ${SITE_CONFIG.name}`;

  const defaultKeywords = [
    'eventos',
    'turismo', 
    'tucuman',
    'calendario',
    'actividades',
    'cultura'
  ];

  return {
    title: fullTitle,
    description,
    keywords: [...keywords, ...defaultKeywords].join(', '),
    
    authors: [{ name: 'Ente de Turismo de Tucumán' }],
    creator: 'Ente de Turismo de Tucumán',
    publisher: 'Ente de Turismo de Tucumán',
    
    openGraph: {
      title: fullTitle,
      description,
      url: canonical ? `${SITE_CONFIG.url}${canonical}` : undefined,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'es_AR',
      type: 'website',
    },
    
    twitter: {
      card: 'summary_large_image',
      site: SITE_CONFIG.twitter,
      creator: SITE_CONFIG.twitter,
      title: fullTitle,
      description,
      images: [ogImage],
    },
    
    alternates: {
      canonical: canonical ? `${SITE_CONFIG.url}${canonical}` : undefined,
    },
    
    robots: noIndex ? {
      index: false,
      follow: false,
    } : {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    },
  };
}

/**
 * Creates JSON-LD structured data for SEO
 */
export function createStructuredData(type: 'WebSite' | 'Organization' | 'Event', data: Record<string, unknown> = {}) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  switch (type) {
    case 'WebSite':
      return {
        ...baseData,
        name: SITE_CONFIG.name,
        description: SITE_CONFIG.description,
        url: SITE_CONFIG.url,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_CONFIG.url}/buscar?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
        ...data,
      };
      
    case 'Organization':
      return {
        ...baseData,
        name: 'Ente de Turismo de Tucumán',
        description: 'Organismo oficial de promoción turística de la Provincia de Tucumán',
        url: SITE_CONFIG.url,
        logo: `${SITE_CONFIG.url}/images/logo.png`,
        sameAs: [
          'https://www.facebook.com/TucumanTurismo',
          'https://www.instagram.com/tucumanturismo',
          'https://twitter.com/TucumanTurismo',
        ],
        ...data,
      };
      
    case 'Event':
      return {
        ...baseData,
        ...data,
      };
      
    default:
      return baseData;
  }
}

/**
 * Creates breadcrumb structured data
 */
export function createBreadcrumbData(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}
