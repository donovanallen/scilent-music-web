'use client'; // Error components must be Client Components

import * as React from 'react';
import toast from 'react-hot-toast';

import Button from '@/components/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    toast.error(`${error.name}: ${error.message} - ${error.cause}`);
  }, [error]);

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
