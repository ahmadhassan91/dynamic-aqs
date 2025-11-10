import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ColorSchemeScript } from '@mantine/core';
import { HydrationProvider } from '@/components/providers/HydrationProvider';

// Import Mantine styles first
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/charts/styles.css';

// Import global styles last
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dynamic AQS CRM',
  description: 'Comprehensive Customer Relationship Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <HydrationProvider>
          {children}
        </HydrationProvider>
      </body>
    </html>
  );
}