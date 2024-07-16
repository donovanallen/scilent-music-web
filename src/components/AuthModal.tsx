'use client';

import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaSpotify } from 'react-icons/fa';

import logger from '@/lib/logger';
import { cn } from '@/lib/utils';
import useAuthModal from '@/hooks/useAuthModal';

import Button from '@/components/buttons/Button';
import NextModal from '@/components/Modal';

const AuthModal = () => {
  const router = useRouter();
  const { onClose, isOpen } = useAuthModal();
  const { status } = useSession();
  const [error, setError] = useState<string | undefined>();

  const handleSignIn = () => {
    signIn('spotify', {
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      redirect: false,
    }).then((res) => {
      if (res?.error) {
        toast.error('Error logging in. Try again.');
        logger({ error: res.error }, 'ERROR: Error logging in');
        setError(res.error);
      } else if (res?.ok) {
        toast.success('Welcome back!');
        onClose();
        router.push('/');
      }
    });
  };

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
        onClick={handleSignIn}
        rightIcon={FaSpotify}
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
      {error && (
        <p className='w-2/3 subtitle text-red-400 text-center self-center'>
          {error}
        </p>
      )}
    </NextModal>
  );
};

export default AuthModal;
