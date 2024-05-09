'use client';

import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { FaSpotify } from 'react-icons/fa';

import useAuthModal from '@/hooks/useAuthModal';

import Button from '@/components/buttons/Button';
import Modal from '@/components/Modal';

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
      description='Connect your Spotify account to continue.'
      isOpen={isOpen}
      onChange={onChange}
    >
      {/* <Logo className='self-center w-1/3 my-20' /> */}
      <Button
        onClick={() => signIn('spotify')}
        rightIcon={FaSpotify}
        variant='ghost'
        size='lg'
        aria-label='Log in with Spotify'
        className='bg-spotify-primary gap-x-2 rounded-lg w-fit self-center text-sm md:text-base items-center justify-center mt-6'
        isLoading={status === 'loading'}
        name='Log in'
      >
        Log in
      </Button>
    </Modal>
  );
};

export default AuthModal;
