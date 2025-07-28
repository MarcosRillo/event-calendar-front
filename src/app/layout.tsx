export const metadata = {
  title: 'Event Calendar - Ente de Turismo de Tucumán',
  description: 'Sistema de gestión de eventos para el Ente de Turismo de Tucumán',
}

import './globals.css';
import ClientThemeProvider from '@/components/ClientThemeProvider';
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ClientThemeProvider>
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  )
}
