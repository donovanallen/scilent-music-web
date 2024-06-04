'use client';

import React from 'react';

import useAuthModal from '@/hooks/useAuthModal';

import Box from '@/components/Box';
import Button from '@/components/buttons/Button';

import Logo from '~/svg/Logo_Full_Gray.svg';

const Login = () => {
  const authModal = useAuthModal();

  return (
    <Box className='h-full flex flex-col items-center justify-center gap-y-12'>
      <Logo className='w-1/2' />
      <Button
        onClick={authModal.onOpen}
        size='base'
        className='animated-underline'
        variant='outline'
      >
        Get Started
      </Button>
    </Box>
  );
};

export default Login;
