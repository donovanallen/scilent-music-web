'use client';

import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { FaSpotify } from 'react-icons/fa';

import useAuthModal from '@/hooks/useAuthModal';

import Button from '@/components/Button';
import Modal from '@/components/Modal';

import Logo from '~/svg/Logo_White.svg';

const AuthModal = () => {
  const router = useRouter();
  const { onClose, isOpen } = useAuthModal();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      router.refresh();
      onClose();
    }
  }, [session, status, router, onClose]);

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Modal
      title=''
      description=''
      isOpen={isOpen}
      onChange={onChange}
      className='py-6'
    >
      <div className='flex flex-col items-center gap-y-12 text-center mt-6'>
        <Logo className='px-36' />
        <h3>Log in to continue</h3>
        <Button
          onClick={() => signIn('spotify')}
          className='bg-spotify-primary text-white flex items-center gap-x-2 w-fit rounded-lg px-6'
        >
          <>
            <h4 className='subtitle'>Log in with Spotify</h4>
            <FaSpotify />
          </>
        </Button>
      </div>
    </Modal>
  );
};

export default AuthModal;
