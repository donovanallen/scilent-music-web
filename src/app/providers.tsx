'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider className='h-full'>
      <NextThemesProvider
        // enableSystem={false}
        attribute='class'
        defaultTheme='dark'
      >
        {children}
      </NextThemesProvider>
    </NextUIProvider>
  );
}
