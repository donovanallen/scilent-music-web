import { Metadata } from 'next';
import * as React from 'react';

import '@/styles/globals.css';

import { getAuthSession } from '@/lib/helper';
import logger from '@/lib/logger';

import Sidebar from '@/components/Sidebar';

import { Providers } from '@/app/providers';
import { siteConfig } from '@/constant/config';
import AuthSessionProvider from '@/providers/AuthSessionProvider';

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
        <AuthSessionProvider session={session}>
          <Providers>
            {session ? <Sidebar>{children}</Sidebar> : children}
          </Providers>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
