'use client';

import React from 'react';

import useAuthModal from '@/hooks/useAuthModal';

import Box from '@/components/Box';
import Button from '@/components/buttons/Button';

const Login = () => {
  const authModal = useAuthModal();

  return (
    <Box className='h-full flex items-center justify-center '>
      <Button
        onClick={authModal.onOpen}
        className='flex text-center justify-center'
      >
        Get Started
      </Button>
    </Box>
  );
};

export default Login;
