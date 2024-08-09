'use client';

import Box from '@/components/Box';
import LoadingIndicator from '@/components/LoadingIndicator';

import Logo from '~/svg/Logo_Gray.svg';

export default function ProfileLoading() {
  return (
    <Box className='flex flex-col items-center justify-center h-full w-full gap-y-12'>
      <Logo className='w-1/4' />
      <LoadingIndicator />
      <h4>Loading profile...</h4>
    </Box>
  );
}
