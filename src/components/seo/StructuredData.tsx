'use client';

interface StructuredDataProps {
  data: object;
}

/**
 * Component to inject structured data (JSON-LD) into the page
 */
export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
