import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from 'next';
import * as React from 'react';

import '@/styles/globals.css';

import { getAuthSession } from '@/lib/helper';
import logger from '@/lib/logger';

import Sidebar from '@/components/Sidebar';

import { Providers } from '@/app/providers';
import { siteConfig } from '@/constant/config';
import AuthSessionProvider from '@/providers/AuthSessionProvider';
import ModalProvider from '@/providers/ModalProvider';
import ToastProvider from '@/providers/ToastProvider';
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();
  logger({ session }, 'layout.tsx line 38');

  return (
    <html suppressHydrationWarning>
      <body>
        <Providers>
          <AuthSessionProvider session={session}>
            <ToastProvider />
            <ModalProvider />
            <SpeedInsights />
            <Analytics />
            <TrackPlayerProvider>
              {/* <main className='h-full'> */}
              {session ? <Sidebar>{children}</Sidebar> : children}
              {/* </main> */}
            </TrackPlayerProvider>
          </AuthSessionProvider>
        </Providers>
      </body>
    </html>
  );
}
