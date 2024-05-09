'use client'; // Error components must be Client Components

import { signOut } from 'next-auth/react';
import * as React from 'react';
import toast from 'react-hot-toast';

import logger from '@/lib/logger';

import Button from '@/components/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    if (error.message.includes('401')) {
      // Handle NextAuth 401 errors
      logger({ error }, '401 AUTH ERROR - error.tsx - line 19');
      toast.error('Session expired. Please log in again.');
      signOut();
      // Optionally, redirect to login or refresh the token
      reset();
    } else {
      // Handle other errors
      toast.error(`${error.name}: ${error.message} - ${error.cause}`);
    }
    logger({ error }, 'error.tsx line 30');
  }, [error, reset]);

  return (
    <main>
      <section>
        <div className='layout flex min-h-screen flex-col items-center justify-center text-center'>
          <h1 className='mt-8 h0'>Oops, something went wrong!</h1>
          <Button onClick={reset} className='mt-4'>
            Try again
          </Button>
        </div>
      </section>
    </main>
  );
}
