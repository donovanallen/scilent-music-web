'use client';

import { useRouter } from 'next/navigation';

import useAuthModal from '@/hooks/useAuthModal';

import Box from '@/components/Box';
import Button from '@/components/buttons/Button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

import LogoGray from '~/svg/Logo_Full_Gray.svg';

const Login = () => {
  const authModal = useAuthModal();
  const router = useRouter();

  return (
    <Box className='h-full flex flex-col items-center justify-center gap-y-20'>
      <LogoGray className='w-2/3' />
      <div className='inline-flex items-center gap-x-6'>
        <Button onClick={authModal.onOpen} size='base' variant='primary'>
          Get Started
        </Button>

        <Button
          onClick={() => router.push('/signup')}
          size='base'
          variant='ghost'
        >
          Learn More
        </Button>
      </div>
      <div className='absolute bottom-6 left-1/2'>
        <ThemeSwitcher />
      </div>
    </Box>
  );
};

export default Login;
