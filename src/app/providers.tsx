'use client';

import { NextUIProvider } from '@nextui-org/react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import ModalProvider from '@/providers/ModalProvider';
import ToastProvider from '@/providers/ToastProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider className='h-full'>
      <NextThemesProvider
        // enableSystem={false}
        attribute='class'
        defaultTheme='dark'
      >
        <SessionProvider>
          <ToastProvider />
          <ModalProvider />
          <SpeedInsights />
          <Analytics />
          {children}
        </SessionProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
