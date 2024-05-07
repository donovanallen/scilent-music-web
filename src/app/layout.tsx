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

// const ttHoves = localFont({
//   src: [
//     {
//       path: '/fonts/TTHoves/TTHoves-Black.otf',
//       weight: '900',
//       style: 'normal',
//     },
//     {
//       path: '/fonts/TTHoves/TTHoves-ExtraBold.otf',
//       weight: '800',
//       style: 'normal',
//     },
//     {
//       path: '/fonts/TTHoves/TTHoves-Bold.otf',
//       weight: '700',
//       style: 'normal',
//     },
//     {
//       path: '/fonts/TTHoves/TTHoves-SemiBold.otf',
//       weight: '600',
//       style: 'normal',
//     },
//     {
//       path: '/fonts/TTHoves/TTHoves-Medium.otf',
//       weight: '500',
//       style: 'normal',
//     },
//     {
//       path: '/fonts/TTHoves/TTHoves-Regular.otf',
//       weight: '400',
//       style: 'normal',
//     },
//     {
//       path: '/fonts/TTHoves/TTHoves-Light.otf',
//       weight: '300',
//       style: 'normal',
//     },
//     {
//       path: '/fonts/TTHoves/TTHoves-ExtraLight.otf',
//       weight: '200',
//       style: 'normal',
//     },
//     {
//       path: '/fonts/TTHoves/TTHoves-Thin.otf',
//       weight: '100',
//       style: 'normal',
//     },
//   ],
// });

// eslint-disable-next-line unused-imports/no-unused-vars
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: `/favicon/site.webmanifest`,
  // twitter: {
  //   card: 'app',
  //   title: siteConfig.title,
  //   description: siteConfig.description,
  //   creator: '@scilent.digital',
  //   images: {
  //     url: '/favicon/adaptive_icon.png',
  //     alt: 'Scilent Music Logo',
  //   },
  //   // creatorId: '1467726470533754880',
  //   // siteId: '1467726470533754880',
  //   // app: {
  //   //   name: 'twitter_app',
  //   //   id: {
  //   //     iphone: 'twitter_app://iphone',
  //   //     ipad: 'twitter_app://ipad',
  //   //     googleplay: 'twitter_app://googleplay',
  //   //   },
  //   //   url: {
  //   //     iphone: 'https://iphone_url',
  //   //     ipad: 'https://ipad_url',
  //   //   },
  //   // },
  // },
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
        </body>
      </AuthSessionProvider>
    </html>
  );
}
