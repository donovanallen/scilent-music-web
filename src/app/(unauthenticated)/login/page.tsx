'use client';

import { Tooltip } from '@nextui-org/react';

import useAuthModal from '@/hooks/useAuthModal';

import Box from '@/components/Box';
import Button from '@/components/buttons/Button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

import LogoGray from '~/svg/Logo_Full_Gray.svg';

const Login = () => {
  const authModal = useAuthModal();

  return (
    <Box className='h-full flex flex-col items-center justify-center gap-y-20'>
      <LogoGray className='w-2/3' />
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
