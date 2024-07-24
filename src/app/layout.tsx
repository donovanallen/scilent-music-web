import { Metadata } from 'next';
import * as React from 'react';

import '@/styles/globals.css';

import AuthenticatedLayout from '@/components/AuthenticatedLayout';

import { Providers } from '@/app/providers';
import { siteConfig } from '@/constant/config';
import TrackPlayerProvider from '@/providers/TrackPlayerProvider';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: `/favicon/site.webmanifest`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body>
        <Providers>
          <TrackPlayerProvider>
            <AuthenticatedLayout>{children}</AuthenticatedLayout>
          </TrackPlayerProvider>
        </Providers>
      </body>
    </html>
  );
}
