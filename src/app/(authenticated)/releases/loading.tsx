'use client';

import Box from '@/components/Box';
import LoadingIndicator from '@/components/LoadingIndicator';

import Logo from '~/svg/Logo_Full_Gray.svg';

export default function ReleasesLoading() {
  return (
    <Box className='flex flex-col items-center justify-center h-full w-full gap-y-12'>
      <Logo className='w-1/2' />
      <LoadingIndicator />
    </Box>
  );
}
