'use client';

import { NextUIProvider } from '@nextui-org/react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import ModalProvider from '@/providers/ModalProvider';
import ToastProvider from '@/providers/ToastProvider';
import TrackPlayerProvider from '@/providers/TrackPlayerProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider className='h-full'>
      <NextThemesProvider attribute='class' defaultTheme='dark'>
        <SpeedInsights />
        <Analytics />
        <ToastProvider />
        <ModalProvider />
        <TrackPlayerProvider>{children}</TrackPlayerProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
