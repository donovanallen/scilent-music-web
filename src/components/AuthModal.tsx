'use client';

import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { FaSpotify } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa6';

import { cn } from '@/lib/utils';
import useAuthModal from '@/hooks/useAuthModal';

import Button from '@/components/buttons/Button';
import NextModal from '@/components/Modal';

const AuthModal = () => {
  const router = useRouter();
  const { onClose, isOpen } = useAuthModal();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.refresh();
      onClose();
    }
  }, [status, router, onClose]);

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <NextModal
      title='Get Started'
      description='Connect your Spotify account to continue.'
      isOpen={isOpen}
      onChange={onChange}
    >
      <Button
        onClick={() =>
          signIn('spotify', {
            callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}`,
          })
        }
        rightIcon={status === 'loading' ? FaSpinner : FaSpotify}
        variant='outline'
        size='base'
        aria-label='Log in with Spotify'
        className={cn(
          'w-fit mt-6',
          'self-center justify-between gap-x-4',
          'text-base md:text-base',
          'border-light animated-underline',
          'active:text-brand-dark active:border-brand-dark',
          'grayscale',
          'hover:filter-none',
          'hover:shadow-md transition',
        )}
        isLoading={status === 'loading'}
        name='Log in'
        classNames={{ rightIcon: 'text-spotify-primary text-lg' }}
      >
        Log in
      </Button>
    </NextModal>
  );
};

export default AuthModal;
