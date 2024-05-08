'use client';

import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { FaSpotify } from 'react-icons/fa';

import useAuthModal from '@/hooks/useAuthModal';

import Button from '@/components/buttons/Button';
import Modal from '@/components/Modal';

import Logo from '~/svg/Logo_White.svg';

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
    <Modal
      title='Get Started'
      description='Connect your Spotify account to continue'
      isOpen={isOpen}
      onChange={onChange}
    >
      <div className='flex flex-col items-center text-center gap-y-12 my-6'>
        <Logo className='w-1/3' />

        <Button
          onClick={() => signIn('spotify')}
          rightIcon={FaSpotify}
          variant='ghost'
          aria-label='Log in with Spotify'
          className='bg-spotify-primary gap-x-2 rounded-lg'
          size='lg'
          isLoading={status === 'loading'}
        >
          Log in with Spotify
        </Button>
      </div>
    </Modal>
  );
};

export default AuthModal;
