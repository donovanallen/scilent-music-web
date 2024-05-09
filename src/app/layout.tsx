import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import * as React from 'react';

import '@/styles/globals.css';

import Sidebar from '@/components/Sidebar';

import authOptions from '@/app/api/auth/[...nextauth]/authOptions';
import { siteConfig } from '@/constant/config';
import AuthSessionProvider from '@/providers/AuthSessionProvider';
import ModalProvider from '@/providers/ModalProvider';
import ToastProvider from '@/providers/ToastProvider';

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
  const session = await getServerSession(authOptions);

  return (
    <html>
      <AuthSessionProvider session={session}>
        <body>
          <ToastProvider />
          <ModalProvider />
          <Sidebar>{children}</Sidebar>
          <SpeedInsights />
          <Analytics />
        </body>
      </AuthSessionProvider>
    </html>
  );
}
