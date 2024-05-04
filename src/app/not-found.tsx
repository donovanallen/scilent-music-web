import { Metadata } from 'next';
import * as React from 'react';

import Button from '@/components/Button';

export const metadata: Metadata = {
  title: 'Not Found',
};

export default function NotFound() {
  return (
    <main>
      <section>
        <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-white'>
          <h1 className='h0'>Page Not Found</h1>
          <Button>
            <a className='mt-4' href='/'>
              Back to home
            </a>
          </Button>
        </div>
      </section>
    </main>
  );
}
