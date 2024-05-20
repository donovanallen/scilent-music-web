'use client';

import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { FaSpotify } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa6';

import { cn } from '@/lib/utils';
import useAuthModal from '@/hooks/useAuthModal';

import Button from '@/components/buttons/Button';
// import Modal from '@/components/Modal';
import NextModal from '@/components/next/Modal';

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
        variant='ghost'
        size='base'
        aria-label='Log in with Spotify'
        className={cn(
          'bg-spotify-primary rounded-lg min-w-fit w-1/2 mt-6',
          'self-center justify-center gap-x-4',
          'text-sm md:text-base',
          'hover:shadow-md transition',
        )}
        isLoading={status === 'loading'}
        name='Log in'
      >
        Log in
      </Button>
    </NextModal>
  );
};

export default AuthModal;
