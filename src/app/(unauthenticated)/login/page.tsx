'use client';

import { Tooltip } from '@nextui-org/react';
import { useTheme } from 'next-themes';
import React from 'react';

import useAuthModal from '@/hooks/useAuthModal';

import Box from '@/components/Box';
import Button from '@/components/buttons/Button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

import LogoBlack from '~/svg/Logo_Full_Black.svg';
import LogoGray from '~/svg/Logo_Full_Gray.svg';
import LogoWhite from '~/svg/Logo_Full_White.svg';

const Login = () => {
  const authModal = useAuthModal();
  const { theme } = useTheme();

  return (
    <Box className='h-full flex flex-col items-center justify-center gap-y-12'>
      {/* {theme === 'dark' ? (
        <LogoBlack className='w-1/2' />
      ) : (
      <LogoGray className='w-1/2' />
      )} */}
      <LogoGray className='w-1/2' />
      <div className='inline-flex items-center gap-x-6'>
        <Button onClick={authModal.onOpen} size='base' variant='primary'>
          Get Started
        </Button>
        <Tooltip
          placement='bottom'
          content='Coming Soon'
          classNames={{
            content: 'text-dark dark:text-light bg-light dark:bg-dark p-2',
          }}
        >
          <Button
            onClick={authModal.onOpen}
            size='base'
            variant='ghost'
            disabled
          >
            Learn More
          </Button>
        </Tooltip>
      </div>
      <div className='absolute bottom-6 left-1/2'>
        <ThemeSwitcher />
      </div>
    </Box>
  );
};

export default Login;
