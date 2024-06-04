import { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import * as React from 'react';

import logger from '@/lib/logger';

import Button from '@/components/buttons/Button';

import authOptions from '@/app/api/auth/[...nextauth]/authOptions';

export const metadata: Metadata = {
  title: 'Not Found',
};

export default async function NotFound() {
  const session = await getServerSession(authOptions);
  logger({ session }, 'not-found.tsx line 15');
  return (
    <main>
      <section>
        <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-white'>
          <h1 className='h0'>Page Not Found</h1>
          <Button className='animated-underline'>
            <Link className='mt-4' href='/'>
              Back to home
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
